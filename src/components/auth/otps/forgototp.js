import React, {Component} from 'react';
import auth from '../../../services/authService';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CountdownCircle from 'react-native-countdown-circle';
import Toast from 'react-native-toast-message';
import {showToast} from '../../../services/toastService';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {backEndCallObj} from '../../../services/allService';
const Joi = require('joi-browser');
const {width, height} = Dimensions.get('window');

const verification = require('../../../assests/images/otp2.png');

const schema = Joi.object().keys({
  code: Joi.string().min(6).required(),
});

class ForgotOtp extends Component {
  state = {
    code: '',
    errors: '',
    buttonDisabled: true,
    otpbutton: true,
    shownewcode: false,
  };
  async _finishCount() {
    await this.setState({shownewcode: true});
  }
  async componentDidMount() {}
  newcode = async () => {
    try {
      const data = await backEndCallObj('/user/resendotp', {
        user_email: this.props?.fdata?.email,
      });
      //   const data = await auth.getnewcode(
      //     {
      //       user_email: this.props?.fdata?.email,
      //     },
      //     'Register',
      //   );
      //   console.log(data, 'respnc_data');
      showToast('success', data.success);
      if (data.success) {
        await this.setState({shownewcode: false});
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        await this.setState({errors: ex.response.data});
        setTimeout(async () => {
          await this.setState({errors: null});
        }, 2000);
      }
    }
  };
  _updateste = async code => {
    await this.setState({code});
    if (this.state.code.length > 3) {
      await this.setState({buttonDisabled: false});
    }
  };
  _onPressEnter = async () => {
    this.loadingButton.showLoading(true);
    await this.setState({otpbutton: !this.state.otpbutton});
    await this.setState({buttonDisabled: !this.state.buttonDisabled});
    const {code} = this.state;
    const validata = Joi.validate(
      {code: this.state.code},
      schema,
      function (err, value) {
        if (!err) return null;
        const reter = err.details[0].message;
        return reter;
      },
    );
    if (!!validata) {
      this.loadingButton.showLoading(false);
      await this.setState({errors: validata});
      showToast('error', 'Please Enter Valid OTP');
      setTimeout(async () => {
        await this.setState({errors: null});
        await this.setState({otpbutton: !this.state.otpbutton});
      }, 2000);
    } else {
      const obj = {
        user_email: this.props?.fdata?.email,
        otp: code,
      };
      setTimeout(() => {
    
        this.props.navigation.navigate("resetpass",{rsetdat: obj})
      }, 100);
    }
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#212627'}}>
        <View style={styles.wrapper}>
          <View>
            <Toast />
          </View>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                source={verification}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>

            <Text style={[styles.text, {color: '#fff'}]}>
              A one time 6-digit code has been send to your Email &nbsp;{' '}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#edc842',
                }}>
                {this.props?.regdata?.user_email}
              </Text>
            </Text>
            <Text style={styles.title}>Enter 6 digit OTP</Text>

            {this.state.otpbutton ? (
              <OTPInputView
                style={{width: '90%', height: 100, color: '#fff'}}
                pinCount={6}
                autoFocusOnLoad={false}
                codeInputFieldStyle={{color: '#fff'}}
                codeInputHighlightStyle={{borderColor: '#fff'}}
                selectionColor={'#fff'}
                keyboardType="number-pad"
                returnKeyType="done"
                onCodeChanged={code => {
                  this._updateste(code);
                }}
              />
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  paddingHorizontal: wp('20%'),
                  height: 100,
                }}>
                <View visible={!this.state.otpbutton} type="loading" />
              </View>
            )}

            <AnimateLoadingButton
              ref={c => (this.loadingButton = c)}
              width={wp('45%')}
              height={hp('6%')}
              buttonDisabled={this.state.buttonDisabled}
              borderWidth={3}
              backgroundColor="#121212"
              justifyContent="center"
              alignItems="center"
              borderRadius={10}
              titleFontFamily="Montserrat-SemiBold"
              title="VERIFY"
              titleFontSize={hp('2.5%')}
              titleColor="white"
              onPress={this._onPressEnter.bind(this)}
            />

            {this.state.shownewcode ? (
              <TouchableOpacity onPress={this.newcode}>
                <Text
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: hp('2%'),
                    marginTop: hp('4%'),
                    color: '#fff',
                  }}>
                  Didn't receive the otp?{'  '}
                  <Text
                    style={{
                      color: '#55BEE9',
                      fontFamily: 'Montserrat-SemiBold',
                      textDecorationLine: 'underline',
                    }}>
                    Click Here
                  </Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.newcoderight}>
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 8,
                    marginRight: 8,
                    color: '#fff',
                  }}>
                  Code Expires in
                </Text>
                <CountdownCircle
                  seconds={60}
                  radius={16}
                  borderWidth={3}
                  color="#edc842"
                  bgColor="#fff"
                  textStyle={{fontSize: 11, color: '#edc842'}}
                  onTimeElapsed={() => this._finishCount()}
                
                />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default ForgotOtp;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },

  background: {
    alignItems: 'center',
    width,
    height,
  },

  header: {
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#353535',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('2%'),
  },
  backArrow: {
    marginLeft: wp('2%'),
  },

  backButtonIcon: {
    width: wp('7%'),
    height: hp('5%'),
  },

  titles: {
    color: 'white',
    padding: 12,
    fontSize: hp('2.5%'),
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    flex: 1,
  },
  logoContainer: {
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },

  logo: {
    height: hp('20%'),
  },

  container: {
    alignItems: 'center',
    fontSize: hp('1.8%'),
    fontFamily: 'Montserrat-SemiBold',
    padding: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    shadowOffset: {width: 1, height: 13},
    elevation: 6,
    borderRadius: 5,
    marginTop: hp('8%'),
  },

  title: {
    marginTop: hp('5%'),
    fontSize: hp('2.5%'),
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: '#edc842',
  },

  text: {
    marginTop: hp('5%'),
    fontSize: hp('1.3%'),
    fontFamily: 'Montserrat',
  },

  newcoderight: {
    marginTop: hp('4%'),
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
    fontSize: 12,
  },
});
