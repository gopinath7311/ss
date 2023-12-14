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
import {backEndCallObj} from '../../../services/allService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import update_auth from '../../../redux/actions/authAction';
import allactions from '../../../redux/actions/allactions';
import LinearGradient from 'react-native-linear-gradient';
import Form from '../forms/form';
const Joi = require('joi-browser');
const {width, height} = Dimensions.get('window');

const schema = Joi.object().keys({
  email: Joi.string()
    .email()
    .error(() => {
      return {
        message: 'Email must be valid email',
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
});
export default class Login extends Component {
  state = {
    email: '',
    phone: '',
    password: '',
    errors: '',
    isLoading: false,
    value: '',
    error: '',
    buttonDisabled: true,
    buttonshow: true,
    token: null,
    passvisible: true,
    fcmtoken: '1234',
    deviceid: '',
    ip: '0.0.0.0',
    ccode: '',
    placeholder: '+63',
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
  email = async email => {
    if (email[0] == 0) {
      showToast('error', "Don't Enter '0' before email");
      await this.setState({email: ''});
    } else if (email.includes(' ')) {
      showToast('error', 'space was not allowed in email');
      await this.setState({email: email.slice(0, -1)});
    } else {
      await this.setState({email: email});
    }
  };
  _onPresslogin = async () => {
    this.loadingButton.showLoading(true);
    await this.setState({buttonDisabled: true, buttonshow: false});
    const {email, password} = this.state;
    Keyboard.dismiss();

    let val = '';
    const validata = Joi.validate(
      {email, password},
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
        // this.setState({name: '', password: ''});
        // if (val === 'email') {
        //   this.setState({email: ''});
        // } else if (val === 'password') {
        //   this.setState({password: ''});
        // }
      }, 2000);
    } else {
      try {
        const obj = {
          user_email: this.state.email,
          password: this.state.password,
          last_login_ip: this.state.ip,
          fcm_token: this.state.fcmtoken,
          browser_id: 'abc',
        };

        const dat = await backEndCallObj('/user/login', obj);
       
        if (dat.type === 'OTP') {
          this.loadingButton.showLoading(false);
          this.props.navigation.navigate('registerotp', {regdata: obj});
          showToast('success', dat.success);
        } else if (dat.type === '2FA') {
          this.loadingButton.showLoading(false);
          this.props.navigation.navigate('twofaotp', {regdata: obj});
          // showToast('success', dat.success);
        } else {
          this.loadingButton.showLoading(false);
          await AsyncStorage.setItem('token', dat?.jwt);
          await allactions();
          await update_auth();
          this.props.navigation.navigate('home');
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
            // await this.setState({name: '', password: ''});
          }, 2000);
        }
      }
    }
  };
  passvis = async () => {
    await this.setState({passvisible: !this.state.passvisible});
  };
  sendforgot = () => {
     this.props.navigation.navigate('forgot'); 
  };

  render() {
    const {passvisible} = this.state;
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

          <View style={styles.transprentbg}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'NotoSerif-Black',
                fontSize: 23,
                marginVertical: hp('3%'),
                left: 20,
              }}>
              Login
            </Text>

            <View style={styles.Mainform}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'NotoSerif-SemiBold',
                }}>
                Username/Email
              </Text>
              <View style={styles.sidecont}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Please Enter Username / Email"
                  placeholderTextColor={'#a6caaf'}
                  returnKeyType="done"
                  onChangeText={e => this.email(e)}
                  value={this.state.email}
                  cursorColor={'white'}
                />
              </View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'NotoSerif-SemiBold',

                  marginTop: hp('3%'),
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
                      color: '#353535',
                    },
                  ]}>
                  <TextInput
                    returnKeyType="done"
                    style={[{width: wp('60%'), color: 'white'}]}
                    onChangeText={x => this.setState({password: x})}
                    maxLength={15}
                    value={this.state.password}
                    placeholder="Please Enter Password"
                    placeholderTextColor="#a6caaf"
                    cursorColor={'white'}
                    secureTextEntry={passvisible ? true : false}
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.visibilityBtn}
                    onPress={() => this.passvis()}>
                    {passvisible ? (
                      <Icon
                        name="visibility-off"
                        type="Entypo"
                        size={20}
                        color="#fff"
                      />
                    ) : (
                      <Icon
                        name="remove-red-eye"
                        type="Entypo"
                        size={20}
                        color="#fff"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => this.sendforgot()}
                style={{alignSelf: 'flex-end'}}>
                <Text
                  style={{
                    marginTop:5,
                    color: '#02f4ed',
                    fontFamily: 'NotoSerif-SemiBold',
                    marginBottom:20
                  
                  }}>
                  Forgot Password
                </Text>
              </TouchableOpacity>
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
                  title="Sign In"
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
                  fontFamily: 'NotoSerif-Bold',
                }}>
                Or
              </Text>
              <View style={[styles.linebar, {left: 20}]}></View>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('register')}
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
                  fontFamily: 'NotoSerif-Bold',
                  fontSize: 17,
                }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  transprentbg: {
    backgroundColor: '#030303b8',
    width: wp('97%'),
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f5fef852',
  },
  inputView: {
    backgroundColor: '#fff',
    height: '90%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  inputBox: {
    margin: 30,
    marginVertical: 10,
  },
  TextInputBox: {
    backgroundColor: '#fff',
    marginTop: 10,
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#4f6bed',
  },
  ButtonView: {
    backgroundColor: '#4f6bed',
    margin: 20,
    padding: 10,
    alignSelf: 'flex-end',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    zIndex: -1,
  },
  ButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  visibilityBtn: {
    position: 'absolute',
    right: 20,
    padding: 0,
    marginTop: 21,
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
