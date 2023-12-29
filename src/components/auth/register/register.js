import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Image,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Input, Button, Icon} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import publicIP from 'react-native-public-ip';
import messaging from '@react-native-firebase/messaging';
import queryString from 'query-string';

import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');
import Toast from 'react-native-toast-message';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {showToast} from '../../../services/toastService';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {backEndCallObj} from '../../../services/allService';
import {BarIndicator, BallIndicator} from 'react-native-indicators';
import _ from 'lodash';
var Joi = require('joi-browser');

const schema = Joi.object().keys({
  name: Joi.string()
    .min(6)
    .max(15)
    .error(() => {
      return {
        message: "'Username' is a mandatory field",
      };
    })
    .required()
    .trim(true),
  email: Joi.string().email().max(25).required(),
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

class Register extends Component {
  state = {
    name: '',
    email: '',
    ip: '0.0.0.0',
    phone: '',
    password: '',
    confirmpassword: '',
    errors: '',
    buttonDisabled: true,
    buttonshow: true,
    valuehide: '',
    passvisible: true,
    confirmpassvisible: true,
    namevisible: true,
    fcmtoken: '0',
    referral: '',
    ccode: '',
    placeholder: '+63',
    deviceid: '',

    isChecked: false,
    isModalVisible: false,
    userLoader: false,
    username: false,
  };

  constructor(props) {
    super(props);

    this.usernamecheck = _.debounce(this.usernamecheck, 1000);
  }

  componentDidMount = async () => {
    this.checkPermission();
    DeviceInfo.getUniqueId().then(async uniqueId => {
      await this.setState({deviceid: uniqueId});
    });

    this.getdyn();
    publicIP().then(async ip => {
      
      await this.setState({ip});

    });
  };
  getdyn = () => {
    if (Platform.OS === 'ios') {
      Linking.getInitialURL().then(res => {
        dynamicLinks()
          .resolveLink(res)
          .then(response => {
            if (response) {
              var url = response.url;

              const value = queryString.parseUrl(url);

              const ref = value.query;
              if (ref && ref.ref) {
                this.setState({referral: ref.ref});
              }
            }
          });
      });
    } else {
      dynamicLinks()
        .getInitialLink()
        .then(link => {
          if (link) {
            var url = link.url;
            const value = queryString.parseUrl(url);

            const ref = value.query;
            if (ref && ref.ref) {
              this.setState({referral: ref.ref});
            }
          }
        });
    }
  };
  checkPermission = async () => {
try {
  const enabled = await messaging().hasPermission();

    if (Platform.OS === 'ios') {
      if (enabled === 1) {
        this.getFcmToken();
      } else {
        this.requestPermission();
      }
    } else {
      if (!enabled) {
        this.getFcmToken();
      } else {
        this.requestPermission();
      }
    }
} catch (error) {
  console.log(error,'errr')
}
    
  };

  getFcmToken = async () => {

    const fcmToken = await messaging().getToken();
    console.log(fcmToken,"fcmt")
    if (fcmToken) {
      await this.setState({fcmtoken: fcmToken});
    } else {
      await this.setState({fcmtoken: 0});
    }
  };

  requestPermission = async () => {
    try {
      await messaging().requestPermission();
    } catch (error) {
      await this.setState({fcmtoken: 0});
    }
  };

  messageListener = async () => {
    this.notificationListener = messaging().onMessage(notification => {
      const {title, body} = notification.notification;
    });
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

  _onChange = async phone => {
    if (phone.length <= 10) {
      if (phone[0] == 0) {
        showToast('error', "Don't Enter space & '0' before Phone Number.");
        await this.setState({phone: ''});
      } else {
        await this.setState({phone: phone});
        await this.setState({buttonDisabled: false});
        let na = phone.replace(
          /[`~!@#$%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢✓•△¶∆\{\}\[\]\\\/]/gi,
          '',
        );
        const reppo = na.replace(' ', '');
        await this.setState({phone: reppo});
      }
    } else {
    }
  };
  usernamecheck = async event => {
    const {name} = this.state;
    this.setState({userLoader: true});
    setTimeout(async () => {
      try {
        const res = await backEndCallObj('/user/check_username', {
          user_name: name,
        });
    
        if (res?.success) {
          this.setState({username: true, userLoader: false, err: ''});
        } else {
          showToast('error', 'Username not valid,check it once');
        }
      } catch (error) {
        showToast('error', 'Username not avaliable');
        this.setState({
          username: false,
          userLoader: false,
          err: 'User name not avaliable',
        });
      }
    }, 1000);
  };
  wsname = async name => {
    if (name.length <= 15) {
      if (name[0] == ' ') {
        showToast('error', "Don't Enter space before Name.");
        await this.setState({name: ''});
      } else {
        await this.setState({name: name});

        let na = name.replace(
          /[`~!@#$₹₱%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢℅؋ƒ₼$៛₡✓•△¶∆\{\}\[\]\\\/]/gi,
          '',
        );
        const reppo = na.replace(' ', '');
        await this.setState({name: reppo});
        if (name?.length >= 6) {
          this.usernamecheck();
        } else {
          await this.setState({username: false});
        }
      }
    } else {
    }
  };
  regpaswd = async password => {
    if (password[0] == ' ') {
      showToast('error', "Don't Enter space in password.");
      await this.setState({password: ''});
    } else {
      this.setState({password: password});
      let regSpace = new RegExp(/\s/);
      if (regSpace.test(password)) {
        const repp = password.replace(' ', '');
        await this.setState({password: repp});
      } else {
        this.setState({password: password});
      }
    }
  };
  passvis = async () => {
    await this.setState({passvisible: !this.state.passvisible});
  };
  confirmpassvis = async () => {
    await this.setState({confirmpassvisible: !this.state.confirmpassvisible});
  };
  namevis = async () => {
    await this.setState({namevisible: !this.state.namevisible});
  };
  _onPressLogin() {
    this.props.navigation.push('login');
  }

  toggleModal = async () => {
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };

  _onPressButton = async () => {
    this.loadingButton.showLoading(true);
    Keyboard.dismiss();
    await this.setState({buttonDisabled: true, buttonshow: false});

    let val = '';
    const validata = Joi.validate(
      {
        name: this.state.name,
        email: this.state.email,
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
      this.loadingButton.showLoading(true);

      await this.setState({buttonDisabled: true, buttonshow: true});
      setTimeout(async () => {
        this.loadingButton.showLoading(false);
        await this.setState({
          errors: null,
          buttonshow: true,
          buttonDisabled: false,
        });
        if (val === 'name') {
          this.setState({name: ''});
        } else if (val === 'email') {
          this.setState({email: ''});
        } else if (val === 'password') {
          this.setState({password: '', confirmpassword: ''});
        } else if (val === 'confirmpassword') {
          this.setState({confirmpassword: ''});
        }
      }, 10);
    }
    // else if (this.state.isChecked === false) {
    //   await this.setState({errors: 'Please Accept Terms&Conditions'});
    //   showToast('error', this.state.errors);
    //   this.loadingButton.showLoading(false);
    //   await this.setState({buttonshow: true});
    // }
    else {
      try {
        if (this.state.referral && this.state.referral.length >= 10) {
          const {name, email, phone, ip, password} = this.state;
          const obj = {
            user_name: name,
            user_email: email,
            password: password,
            last_login_ip: ip,
            fcm_token: this.state.fcmtoken,
            referral_1: this.state.referral,
          };
          console.log(obj, 'new obj');
          const dat = await backEndCallObj('/user/register', obj);
          console.log(dat,'regResponse')
          if (dat) {
            showToast(
              'success',
              'Registration Successfull !! Please Verify your Mobile.',
            );
            //Actions.registerotp({regdata: obj});
            this.props.navigation.navigate('registerotp',{regdata:obj})

            setTimeout(async () => {
              this.loadingButton.showLoading(false);
              await this.setState({
                name: '',
                email: '',
                password: '',
                confirmpassword: '',
                buttonshow: true,
              });
            }, 1000);
          }
        } else if (this.state.referral && !this.state.referral.length <= 4) {
          showToast('error', 'Please Enter Valid Referral Id');
          await this.setState({referral: ''});
          this.loadingButton.showLoading(false);
        } else {
          const {name, email, phone, ip, password} = this.state;
          const obj = {
            user_name: name,
            user_email: email,
            password: password,
            last_login_ip: ip,
            fcm_token: this.state.fcmtoken,
            browser_id: 'abc',
          };
          //console.log(obj, 'new obj');

          const dat = await backEndCallObj('/user/register', obj);
          // console.log(dat, 'reg_respoce');
          if (dat.success) {
            showToast(
              'success',
              dat.success,
              //   'Registration Successfull !! Please Verify your Email.',
            );
            setTimeout(async () => {
              this.loadingButton.showLoading(false);
              //Actions.registerotp({regdata: obj});
              this.props.navigation.navigate('registerotp', {regdata: obj});
              await this.setState({
                name: '',
                email: '',
                password: '',
                confirmpassword: '',
                buttonshow: true,
              });
            }, 600);
          }

          //   showToast(
          //     'success',
          //     'Registration Successfull !! Please Verify your Email.',
          //   );
          //   setTimeout(async () => {
          //     this.loadingButton.showLoading(false);
          //     Actions.registerotp({regdata: obj});
          //     await this.setState({
          //       name: '',
          //       email: '',
          //       password: '',
          //       confirmpassword: '',
          //       buttonshow: true,
          //     });
          //   }, 500);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          this.loadingButton.showLoading(false);
          await this.setState({errors: ex.response.data});
          showToast('error', this.state.errors);
        }
      }
    }
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}>
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
          <View style={styles.FormArea}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'NotoSerif-Black',
                fontSize: 20,
                marginTop:10,
                left: 20,
              }}>
              Register
            </Text>
            <ScrollView style={{width: '100%'}}>
              <View style={styles.Mainform}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 13,
                    fontFamily: 'NotoSerif-Bold',
                 
                  }}>
                  Username
                </Text>
                <View style={styles.sidecont}>
                  <View
                    style={[
                      styles.inputStyle,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: wp('0%'),
                      },
                    ]}>
                    <TextInput
                      style={{color: 'white', width: wp('68%')}}
                      placeholder="Please Enter Username"
                      maxLength={15}
                      placeholderTextColor={'#a6caaf'}
                      returnKeyType="done"
                      onChangeText={name => this.wsname(name)}
                      value={this.state.name}
                      cursorColor={'white'}
                    />

                    {this.state.name && this.state.name.length > 0 ? (
                      this.state?.name?.length >= 6 ? (
                        <TouchableOpacity
                          onPress={() => this.namevis()}
                          style={{
                            borderRadius: 5,
                            marginRight: 5,
                          }}>
                          {!this.state?.userLoader ? (
                            <>
                              {this.state?.username ? (
                                <Image
                                  style={{width: 30, height: 30}}
                                  source={require('../../../assests/images/greentickmark.png')}
                                  resizeMode="contain"
                                />
                              ) : (
                                <Image
                                  style={{width: 25, height: 30}}
                                  source={require('../../../assests/images/x-circle.png')}
                                  resizeMode="contain"
                                />
                              )}
                            </>
                          ) : (
                            <BallIndicator color={'green'} size={20} />
                          )}
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={{
                            width: 25,
                            height: 30,
                            borderRadius: 10,
                            marginRight: 5,
                          }}>
                          <Image
                            style={{width: 25, height: 30}}
                            source={require('../../../assests/images/x-circle.png')}
                            resizeMode="contain"
                          />
                        </View>
                      )
                    ) : null}
                  </View>
                </View>
                <Text
                  style={styles.text}>
                  Email
                </Text>
                <View style={styles.sidecont}>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Please Enter Email"
                    placeholderTextColor={'#a6caaf'}
                    onChangeText={email => this.wsemail(email)}
                    value={this.state.email}
                    returnKeyType="done"
                    cursorColor={'white'}
                  />
                </View>
                <Text
                  style={styles.text}>
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
                      style={[{width: wp('70%'), color: 'white'}]}
                      maxLength={15}
                      returnKeyType="done"
                      onChangeText={password => this.regpaswd(password)}
                      value={this.state.password}
                      placeholder="Please Enter Password"
                      placeholderTextColor={'#a6caaf'}
                      secureTextEntry={this.state.passvisible}
                      cursorColor={'white'}
                    />

                    {this.state.passvisible === true ? (
                      <TouchableOpacity onPress={() => this.passvis()}>
                        <Icon
                          name="visibility-off"
                          type="Entypo"
                          size={20}
                          color="white"
                          style={{}}
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
                  style={styles.text}>
                  Confirm Password
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
                      style={[{paddingHorizontal: wp('0%'), color: 'white'}]}
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
                          color="white"
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
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <Text
                  style={styles.text}>
                  Affiliate Code
                </Text>
                <View style={styles.sidecont}>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Please Enter Affiliate code"
                    placeholderTextColor={'#a6caaf'}
                    returnKeyType="done"
                    onChangeText={referral => this.setState({referral})}
                    value={this.state.referral}
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
                    titleFontFamily="NotoSerif-SemiBold"
                    title="Register"
                    titleFontSize={hp('2.5%')}
                    titleColor="#011708"
                    activityIndicatorColor="red"
                    onPress={this._onPressButton.bind(this)}
                  />
                </LinearGradient>
                <View style={styles.orContainer}>
                  <View style={styles.linebar}></View>
                  <Text
                    style={{
                      color: '#f5fef8',
                      fontFamily:'NotoSerif-Bold',
                    }}>
                    Or
                  </Text>
                  <View style={[styles.linebar, {left: 20}]}></View>
                </View>
                <TouchableOpacity
              onPress={() => this._onPressLogin()}
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
                  fontFamily: 'NotoSerif-SemiBold',
                  fontSize: 17,
                }}>
                Login
              </Text>
            </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default Register;

const styles = StyleSheet.create({
  FormArea: {
    backgroundColor: '#030303b8',
    width: wp('97%'),
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f5fef852',
    height:hp('75%')
  },
  Mainform: {
    alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    marginVertical: hp('2%'),
    marginHorizontal: wp('5%'),
    marginBottom: 250,
    //height:hp('70%')
  },
  sidecont: {
    height: hp('5%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    // marginTop: hp('0.1%'),
  },
  BoxText: {
    color: 'white',
    fontSize: hp('1.8%'),
    fontFamily: 'Montserrat-SemiBold',
  },
  inputStyle: {
    flex: 85,
    height: hp('5.4%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    // backgroundColor: '#EBEBEB',
    paddingHorizontal: wp('3%'),
    color: 'white',
    borderColor: '#63d35a',
    borderWidth: 0.5,
    // borderTopRightRadius: 5,
    // borderBottomRightRadius: 5,
    backgroundColor: '#0000004a',
    borderRadius: 5,
  },
  sideconts: {
    flex: 15,
    backgroundColor: '#000',
    width: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomStartRadius: 5,
    borderTopLeftRadius: 5,
    borderRightColor: '#edc842',
    borderRightWidth: 1.1,
  },
  ButtonWrapper: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    alignSelf: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    width: wp('3.5%'),
    height: hp('3.5%'),
  },
  TitleContainer: {
    backgroundColor: '#353535',
    width: wp('100%'),
    flexDirection: 'row',
    height: hp('8%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'green',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: wp('2%'),
  },
  Title: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2%'),
    lineHeight: hp('8%'),
    color: 'white',
    flexWrap: 'wrap',
  },
  orContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    top:20,
    marginBottom:20
  },
  linebar: {
    backgroundColor: '#c8cbc9',
    height: 0.5,
    width: wp('20%'),
    right: 20,
  },
  text:{
    color: 'white',
    fontSize: 13,
    fontFamily: 'NotoSerif-Bold',
    marginTop: hp('1.5%'),
  }
});
