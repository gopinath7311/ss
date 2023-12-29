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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import messaging from '@react-native-firebase/messaging';
import {Input, Button, Icon, CheckBox} from 'react-native-elements';
import {showToast} from '../../../services/toastService';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import LinearGradient from 'react-native-linear-gradient';

import {backEndCallObj} from '../../../services/allService';

const Joi = require('joi-browser');
const {width, height} = Dimensions.get('window');

const schema = Joi.object().keys({
  //   name: Joi.string()
  //     .min(5)
  //     .max(15)
  //     .error(() => {
  //       return {
  //         message: "'Username' is a mandatory field",
  //       };
  //     })
  //     .required()
  //     .trim(true),
  email: Joi.string().email().max(25).required(),
});
export default class Forgot extends Component {
  state = {
    email: '',
    phone: '',
    errors: '',
    isLoading: false,
    value: '',
    error: '',
    buttonDisabled: true,
    buttonshow: true,
    token: null,

    fcmtoken: '1234',
    deviceid: '',
    ip: '0.0.0.0',
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

  wsname = async name => {
    if (name.length <= 15) {
      if (name[0] == ' ') {
        showToast('error', "Don't Enter space before Name.");
        await this.setState({name: ''});
      } else {
        await this.setState({name: name});

        let na = name.replace(
          /[`~0-9!@#$₹₱%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢℅؋ƒ₼$៛₡✓•△¶∆\{\}\[\]\\\/]/gi,
          '',
        );
        const reppo = na.replace(' ', '');
        await this.setState({name: reppo});
      }
    } else {
    }
  };

  wsemail = async email => {
    if (email[0] == ' ') {
      showToast('error', 'Dont Enter space before email.');
      await this.setState({email: ''});
    } else {
      await this.setState({email: email});

      let na = email.replace(
        /[`~!#$₹₱%^&*()|+\=?;:'",<>×÷⋅°π©℗®™√€£¥¢℅؋ƒ₼$៛₡✓•△¶∆\{\}\[\]\\\/]/gi,
        '',
      );
      const reppo = na.replace(' ', '');
      await this.setState({email: reppo});
    }
  };

  _onPresslogin = async () => {
    this.loadingButton.showLoading(true);
    await this.setState({buttonDisabled: true, buttonshow: false});
    const {email} = this.state;
    Keyboard.dismiss();

    let val = '';
    const validata = Joi.validate({email}, schema, function (err, value) {
      if (!err) return null;
      const reter = err.details[0].message;
      val = err.details[0].context.key;
      return reter;
    });
    if (!!validata) {
      await this.setState({errors: validata});
      showToast('error', this.state.errors);
      this.loadingButton.showLoading(false);
      await this.setState({buttonDisabled: true, buttonshow: true});
      setTimeout(async () => {
        this.loadingButton.showLoading(false);
        await this.setState({errors: null});
        this.setState({email: ''});
      }, 2000);
    } else {
      try {
        const obj = {
          user_email: email,
          //   last_login_ip: this.state.ip,
          //   fcm_token: this.state.fcmtoken,
        };
        const dat = await backEndCallObj('/user/forgot', obj);
        if (dat.success) {
          showToast('success', dat.success);
          const fobj = {
            email: obj.user_email,
            responc: dat,
          };
          this.props.navigation.navigate('resetpass', {fdata: fobj});
          this.loadingButton.showLoading(false);
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
            await this.setState({email: ''});
          }, 2000);
        }
      }
    }
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
          <View style={styles.FormArea}>
          <Toast/>
          <Text
              style={{
                color: '#fff',
                fontFamily: 'Montserrat-Bold',
                fontSize: 23,
                marginVertical: hp('3%'),
                left: 20,
              }}>
              Forgot
            </Text>
            <View style={styles.Mainform}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Email
              </Text>
              <View style={styles.sidecont}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Please Enter Email"
                  placeholderTextColor={'#a6caaf'}
                  onChangeText={email => this.wsemail(email)}
                  value={this.state.email}
                  keyboardType="email-address"
                  returnKeyType="done"
                />
              </View>

              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#0ce652', '#0eea91', '#02f0c8', '#02f4ed']}
                style={{
                  width: wp('65%'),
                  height: hp('6%'),
                  top: hp('2%'),
                  alignItems: 'center',
                  alignSelf: 'center',
                  borderRadius: 5,
                  // justifyContent: "space-between",
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
                  //   borderWidth={3}
                  backgroundColor={['#0ce652', '#0eea91', '#02f0c8', '#02f4ed']}
                  titleFontFamily="Montserrat-Bold"
                  title="Send OTP"
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
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  logo: {
    height: hp('30%'),
    width: wp('50%'),
  },
  FormArea: {
    backgroundColor: '#030303b8',
    width: wp('97%'),
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f5fef852',
    borderRadius: 15,
    marginTop: hp('5%'),
  },
  Mainform: {
    alignItems: 'flex-start',
    marginVertical: hp('2%'),
    marginHorizontal: wp('5%'),
  },
  sidecont: {
    height: hp('5%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: hp('0.5%'),
  },
  inputStyle: {
    flex: 85,
    height: hp('5.4%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: wp('3%'),
    color: 'white',
    borderColor: '#63d35a',
    borderWidth: 0.5,
    backgroundColor: '#0000004a',
    borderRadius: 5,
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
    marginTop: hp('5%'),
    alignSelf: 'center',
  },
  errorContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('6%'),
  },
  iconWrap: {
    // paddingHorizontal: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: hp('3%'),
    width: wp('3%'),
  },
  orContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  linebar: {
    backgroundColor: '#c8cbc9',
    height: 0.5,
    width: wp('20%'),
    right: 20,
  },
});
