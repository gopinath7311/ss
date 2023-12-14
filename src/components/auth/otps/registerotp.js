import React, {Component} from 'react';
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
import update_auth from '../../../redux/actions/authAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const Joi = require('joi-browser');
const {width, height} = Dimensions.get('window');

const verification = require('../../../assests/images/otp2.png');

const schema = Joi.object().keys({
  code: Joi.string().min(6).required(),
});

class RegisterOtp extends Component {
  state = {
    isLoading: false,
    code: '',
    error: '',
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
        user_email: this.props?.route?.params?.regdata.user_email,
      });
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
      try {
        const obj = {
          user_email: this.props.route?.params?.regdata?.user_email,
          otp: code,
        };
        const dat = await backEndCallObj('/user/verify_otp', obj);
        // --------------??????????????---verifyyyy----=-=---=-=-=-=-=-=-=-=
        if (dat?.jwt) {
          this.loadingButton.showLoading(false);
          await AsyncStorage.setItem('token', dat?.jwt);
          await update_auth();

          this.props.navigation.navigate('home');
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          this.loadingButton.showLoading(false);
          await this.setState({errors: ex.response.data});
          showToast('error', this.state.errors);
          setTimeout(async () => {
            this.loadingButton.showLoading(false);
            await this.setState({errors: null});
            await this.setState({otpbutton: !this.state.otpbutton});
          }, 2000);
        }
      }
    }
  };
  render() {
    console.log(this.props.route.params,"reddata")
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <ImageBackground
          source={require('../../../assests/images/loginbg.png')}
          style={{flex: 1}}>
          <Image
            source={require('../../../assests/images/logoname-bg.png')}
            style={{
              width: 250,
              height: 100,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
          <Toast />

          <View style={styles.container}>
            {/* <Image
                source={verification}
                resizeMode="contain"
                style={styles.logo}
              /> */}

            <Text
              style={[styles.text, {color: '#fff', top: 30, marginBottom: 10}]}>
              A one time 6-digit code has been send to your Email &nbsp;{'   '}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#fff',
                }}>
                {this.props?.regdata?.user_email}
              </Text>
            </Text>
            <Text style={styles.title}>Enter 6 digit OTP</Text>

            {this.state.otpbutton ? (
              <OTPInputView
                style={styles.otpinput}
                pinCount={6}
                autoFocusOnLoad={false}
                codeInputFieldStyle={{
                  color: '#fff',
                  borderColor: '#63d35a',
                  backgroundColor: '#0000004a',
                }}
                codeInputHighlightStyle={{borderColor: '#090932'}}
                selectionColor={'#090932'}
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

            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#0ce652', '#0eea91', '#02f0c8', '#02f4ed']}
              style={{
                width: wp('65%'),
                height: hp('6%'),
                alignItems: 'center',
                alignSelf: 'center',
                borderRadius: 5,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 6,
              }}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={wp('65%')}
                height={hp('6%')}
                backgroundColor={['#0ce652', '#0eea91', '#02f0c8', '#02f4ed']}
                titleFontFamily="Montserrat-Bold"
                title="Verify"
                titleFontSize={hp('2.5%')}
                titleColor="#011708"
                activityIndicatorColor="red"
                onPress={this._onPressEnter.bind(this)}
              />
            </LinearGradient>

            {this.state.shownewcode ? (
              <TouchableOpacity onPress={this.newcode}>
                <Text
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: hp('2%'),
                    marginTop: hp('4%'),
                    color: '#353535',
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
                  seconds={120}
                  radius={16}
                  borderWidth={3}
                  color="#090932"
                  bgColor="#fff"
                  textStyle={{fontSize: 11, color: '#090932'}}
                  onTimeElapsed={() => this._finishCount()}
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default RegisterOtp;

const styles = StyleSheet.create({
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

  logo: {
    height: hp('15%'),
  },

  container: {
    backgroundColor: '#030303b8',
    width: wp('97%'),
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f5fef852',
  },

  title: {
    marginTop: hp('5%'),
    fontSize: hp('2.5%'),
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: '#fff',
    left: 20,
  },

  text: {
    marginTop: hp('5%'),
    fontSize: hp('1.3%'),
    fontFamily: 'Montserrat',
  },

  newcoderight: {
    marginTop: hp('4%'),
    flexDirection: 'row',
    marginBottom: 20,
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 12,
  },
  otpinput: {
    width: '90%',
    height: 100,
    color: '#fff',
    alignSelf: 'center',
  },
});
