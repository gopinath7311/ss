import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  SafeAreaView,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import publicIP from 'react-native-public-ip';
import Toast from 'react-native-toast-message';
import auth from '../../../services/authService';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CountdownCircle from 'react-native-countdown-circle';
import messaging from '@react-native-firebase/messaging';
import {Input, Button, Icon, CheckBox} from 'react-native-elements';
import {showToast} from '../../../services/toastService';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {backEndCallObj} from '../../../services/allService';
import LinearGradient from 'react-native-linear-gradient';

const Joi = require('joi-browser');
const {width, height} = Dimensions.get('window');

const schema = Joi.object().keys({
  code: Joi.string()
    .min(6)
    .error(() => {
      return {
        message: 'Please Enter Valid OTP',
      };
    })
    .required(),
  password: Joi.string()
    .min(8)
    .max(15)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})/)
    .error(() => {
      return {
        message:
          'Password at least 8 characters and below 15 characters, atleast one number and atleast one capital letter and one special character',
      };
    })
    .required(),
  confirmpassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .options({language: {any: {allowOnly: 'must match password'}}}),
});
export default class ResetPass extends Component {
  state = {
    password: '',
    confirmpassword: '',
    errors: '',
    isLoading: false,
    buttonDisabled: true,
    buttonshow: true,
    passvisible: true,
    confirmpassvisible: true,
    fcmtoken: '1234',
    deviceid: '',
    ip: '0.0.0.0',

    code: '',
    otpbutton: true,
    shownewcode: false,
  };
  componentDidMount = async () => {
    this.checkPermission();
    DeviceInfo.getUniqueId().then(async uniqueId => {
      await this.setState({deviceid: uniqueId});
    });
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      await this.setState({
        buttonDisabled: true,
        buttonshow: true,
        phone: '',
        password: '',
      });
    });
    publicIP().then(async ip => {
      await this.setState({ip});
    });
  };
  checkPermission = async () => {
    const enabled = await messaging().hasPermission();

    if (Platform.OS === 'ios') {
      if (enabled === 1) {
        this.getFcmToken();
      } else {
        this.requestPermission();
      }
    } else {
      if (enabled) {
        this.getFcmToken();
      } else {
        this.requestPermission();
      }
    }
  };

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await this.setState({fcmtoken: fcmToken});
    } else {
      await this.setState({fcmtoken: '1234'});
    }
  };

  requestPermission = async () => {
    try {
      await messaging().requestPermission();
    } catch (error) {
      await this.setState({fcmtoken: '1234'});
    }
  };

  messageListener = async () => {
    this.notificationListener = messaging().onMessage(notification => {
      const {title, body} = notification.notification;
    });
  };

  async _finishCount() {
    await this.setState({shownewcode: true});
  }

  newcode = async () => {
    try {
      const data = await backEndCallObj('/user/send_otp', {
        user_email: this.props?.fdata?.email,
        otp_type: 'forgotpwd',
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

  _passonChange = async password => {
    await this.setState({password: password});
    await this.setState({buttonDisabled: false});
    let regSpace = new RegExp(/\s/);
    if (regSpace.test(password)) {
      const repp = password.replace(' ', '');
      await this.setState({password: repp});
    } else {
      this.setState({password: password});
    }
  };
  otpcode = async code => {
    if (!/^[0-9]+$/.test(code)) {
      showToast('error', 'Please Enter Valid OTP');
      await this.setState({code: ''});
    } else {
      this.setState({code:code, buttonDisabled: true});
    }
  };
  _onPresslogin = async () => {
    this.loadingButton.showLoading(true);
    await this.setState({otpbutton: !this.state.otpbutton});
    await this.setState({buttonDisabled: true, buttonshow: false});
    Keyboard.dismiss();

    let val = '';
    const validata = Joi.validate(
      {
        code: this.state.code,
        password: this.state.password,
        confirmpassword: this.state.confirmpassword,
      },
      schema,
      function (err, value) {
        if (!err) return null;
        const reter = err.details[0].message;
        val = err.details[0].context.key;
        return reter;
      },
    );
    if (!!validata) {
      await this.setState({errors: validata});
      showToast('error', this.state.errors);
      this.loadingButton.showLoading(false);
      await this.setState({buttonDisabled: true, buttonshow: true});
      setTimeout(async () => {
        this.loadingButton.showLoading(false);
        await this.setState({errors: null});
        if (val === 'code') {
          this.setState({code: ''});
        } else if (val === 'password') {
          this.setState({password: '', confirmpassword: ''});
        } else if (val === 'confirmpassword') {
          this.setState({confirmpassword: ''});
        }
      }, 2000);
    } else {
      try {
        const obj = {
          //   user_email: this.props?.rsetdat?.user_email,
          user_email: this.props.route.params.fdata.email,
          otp: this.state.code,
          //   otp: this.props?.rsetdat?.otp,
          password: this.state.password,
          // two_fa_code: 'Disable',
          two_fa_code: this.props?.route?.params.fdata.responc.TWO_FA_status,
        };
        const dat = await backEndCallObj('/user/resetpassword', obj);
        if (dat.success) {
          showToast('success', dat.success);
          setTimeout(() => {
            this.props.navigation.navigate('login');
            //this.loadingButton?.showLoading(false);
          }, 700);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          await this.setState({buttonDisabled: true, buttonshow: true});
          await this.setState({errors: ex.response.data});
          showToast('error', this.state.errors);
          this.loadingButton.showLoading(false);

          setTimeout(async () => {
            this.loadingButton.showLoading(false);
            await this.setState({errors: null});
          }, 2000);
        }
      }
    }
  };
  passvis = async () => {
    await this.setState({passvisible: !this.state.passvisible});
  };
  confirmpassvis = async () => {
    await this.setState({confirmpassvisible: !this.state.confirmpassvisible});
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
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
          <View style={styles.body}>
            <KeyboardAvoidingView behavior={'position'} enabled>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 23,
                  marginVertical: hp('3%'),
                  left: 20,
                }}>
                Reset password
              </Text>
              <View style={styles.FormArea}>
                <View style={styles.Mainform}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 13,
                      fontFamily: 'Montserrat-SemiBold',
                      textTransform: 'uppercase',
                      marginTop: hp('1.5%'),
                    }}>
                    OTP
                  </Text>
                  <View style={styles.sidecont}>
                    <View
                      style={[
                        styles.inputStyle,
                        {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        },
                      ]}>
                      <TextInput
                        style={[{width: wp('70%'), color: 'white'}]}
                        returnKeyType="done"
                        onChangeText={code => this.otpcode(code)}
                        maxLength={6}
                        value={this.state.code}
                        placeholder="Please Enter OTP"
                        keyboardType="number-pad"
                        placeholderTextColor={'#a6caaf'}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 13,
                      fontFamily: 'Montserrat-SemiBold',
                      textTransform: 'uppercase',
                      marginTop: hp('1.5%'),
                    }}>
                    Password
                  </Text>
                  <View style={styles.sidecont}>
                    <View
                      style={[
                        styles.inputStyle,
                        {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        },
                      ]}>
                      <TextInput
                        returnKeyType="done"
                        style={[{width: wp('70%'), color: 'white'}]}
                        onChangeText={password => this._passonChange(password)}
                        maxLength={15}
                        value={this.state.password}
                        placeholder="Please Enter Password"
                        placeholderTextColor={'#a6caaf'}
                        secureTextEntry={this.state.passvisible}
                      />

                      {this.state.passvisible === true ? (
                        <TouchableOpacity onPress={() => this.passvis()}>
                          <Icon
                            name="visibility-off"
                            type="Entypo"
                            size={20}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => this.passvis()}>
                          <Icon
                            name="remove-red-eye"
                            type="Entypo"
                            size={20}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 13,
                      fontFamily: 'Montserrat-SemiBold',
                      textTransform: 'uppercase',
                      marginTop: hp('1.5%'),
                    }}>
                    Confirm password
                  </Text>
                  <View style={styles.sidecont}>
                  
                    <View
                      style={[
                        styles.inputStyle,
                        {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        },
                      ]}>
                      <TextInput
                        style={[{width: wp('70%'), color: 'white'}]}
                        onChangeText={confirmpassword =>
                          this.setState({
                            confirmpassword,
                            buttonDisabled: false,
                          })
                        }
                        maxLength={15}
                        value={this.state.confirmpassword}
                        returnKeyType="done"
                        placeholder="Please Enter Confirm Password"
                        placeholderTextColor={'#a6caaf'}
                        secureTextEntry={this.state.confirmpassvisible}
                      />

                      {this.state.confirmpassvisible === true ? (
                        <TouchableOpacity onPress={() => this.confirmpassvis()}>
                          <Icon
                            name="visibility-off"
                            type="Entypo"
                            size={20}
                            color="#fff"
                            style={{}}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => this.confirmpassvis()}>
                          <Icon
                            name="remove-red-eye"
                            type="Entypo"
                            size={20}
                            color="#fff"
                            style={{}}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {this.state.shownewcode ? (
                    <TouchableOpacity
                      onPress={this.newcode}
                      style={styles.newcoderight}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat',
                          fontSize: hp('2%'),
                          color: '#fff',
                        }}>
                        Didn't receive the otp?{'  '}
                        <Text
                          style={{
                            color: '#06e3dc',
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
                        color="green"
                        bgColor="#fff"
                        textStyle={{fontSize: 11, color: 'black'}}
                        onTimeElapsed={() => this._finishCount()}
                      />
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
                      backgroundColor={[
                        '#0ce652',
                        '#0eea91',
                        '#02f0c8',
                        '#02f4ed',
                      ]}
                      titleFontFamily="Montserrat-Bold"
                      title="Reset"
                      titleFontSize={hp('2.5%')}
                      titleColor="#011708"
                      activityIndicatorColor="red"
                      onPress={this._onPresslogin.bind(this)}
                    />
                  </LinearGradient>
                </View>
                <View style={styles.orContainer}>
                  <View style={styles.linebar}></View>
                  <Text
                    style={{
                      color: '#f5fef8',
                      fontFamily: 'Montserrat-ExtraBold',
                    }}>
                    Or
                  </Text>
                  <View style={[styles.linebar, {left: 20}]}></View>
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('login')}
                  style={{
                    width: wp('65%'),
                    height: hp('5.5%'),
                    backgroundColor: '#0000004a',
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginBottom: 20,
                    borderColor: '#02f4ed',
                    borderWidth: 0.5,
                  }}>
                  <Text
                    style={{
                      color: '#06e3dc',
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 17,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Background: {
    alignItems: 'center',
    width,
    height,
  },
  body: {
    backgroundColor: '#030303b8',
    width: wp('97%'),
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f5fef852',
  },
  logo: {
    height: hp('30%'),
    width: wp('50%'),
  },
  FormArea: {
    alignSelf: 'center',
    width: wp('95%'),
    alignItems: 'center',
    paddingHorizontal: hp('2%'),
    borderRadius: 15,
  },
  Mainform: {
    alignItems: 'flex-start',
  },
  sidecont: {
    height: hp('5%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: hp('0.3%'),
  },
  inputStyle: {
    flex: 85,
    height: hp('5.4%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: wp('2%'),
    color: '#353535',
    backgroundColor: '#0000004a',
    borderRadius: 5,
    borderColor: '#63d35a',
    borderWidth: 0.5,
  },
  sideconts: {
    flex: 15,
    backgroundColor: '#000',
    width: wp('10%'),
    height: hp('5.3%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomStartRadius: 5,
    borderTopLeftRadius: 5,
    borderRightColor: '#edc842',
    borderRightWidth: 1.1,
  },
  ButtonWrapper: {
    flexDirection: 'row',
    marginTop: hp('3%'),
    alignSelf: 'center',
  },
  errorContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('6%'),
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: hp('3%'),
    width: wp('3%'),
  },
  newcoderight: {
    marginTop: hp('4%'),
    flexDirection: 'row',
    alignSelf: 'center',
    bottom: 10,
  },
  orContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    top: 5,
  },
  linebar: {
    backgroundColor: '#c8cbc9',
    height: 0.5,
    width: wp('20%'),
    right: 20,
  },
});
