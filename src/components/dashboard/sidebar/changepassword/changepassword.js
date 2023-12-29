import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Avatar, Button, Image, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import CountdownCircle from 'react-native-countdown-circle';
import {showToast} from '../../../../services/toastService';
import Toast from 'react-native-toast-message';
import allactions from '../../../../redux/actions/allactions';
import { backEndCallObj } from '../../../../services/allService';

const Joi = require('joi-browser');
const {width, height} = Dimensions.get('window');

const schema = Joi.object().keys({
  opassword: Joi.string()
    .min(8)
    .max(15)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})/)
    .error(() => {
      return {
        message: 'Please Enter Valid Old Password',
      };
    })
    .required(),
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

class ChangePAssword extends Component {
  state = {
    rcvotp: false,
    rcvotpbtn: false,
    code: '',
    opassword: '',
    password: '',
    confirmpassword: '',
    errors: '',
    buttonDisabled: true,
    buttonshow: true,
    opassvisible: true,
    passvisible: true,
    confirmpassvisible: true,
    otpbutton: true,
    shownewcode: false,
  };

  rcvotp = async () => {
this.newcode()
    await this.setState({rcvotp: true, rcvotpbtn: true});
  };

  async _finishCount() {
    await this.setState({shownewcode: true});
  }

  newcode = async () => {
    try {
      const data = await backEndCallObj('/user/send_otp', {
        user_email: this?.props?.getprofil?.user_email,
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

  _opassonChange = async opassword => {
    await this.setState({opassword: opassword});
    await this.setState({buttonDisabled: false});
    let regSpace = new RegExp(/\s/);
    if (regSpace.test(opassword)) {
      const repp = opassword.replace(' ', '');
      await this.setState({opassword: repp});
    } else {
      this.setState({opassword: opassword});
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

  oldpassvis = async () => {
    await this.setState({opassvisible: !this.state.opassvisible});
  };
  passvis = async () => {
    await this.setState({passvisible: !this.state.passvisible});
  };
  confirmpassvis = async () => {
    await this.setState({confirmpassvisible: !this.state.confirmpassvisible});
  };

  _onPresscngpswd = async () => {
    this.loadingButton.showLoading(true);
    await this.setState({otpbutton: !this.state.otpbutton});
    await this.setState({buttonDisabled: true, buttonshow: false});
    Keyboard.dismiss();

    let val = '';
    const validata = Joi.validate(
      {
        opassword: this.state.opassword,
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
        if (val === 'opassword') {
          this.setState({opassword: ''});
        } else if (val === 'code') {
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
          otp: this.state.code,
          two_fa_code: this?.props?.getprofil?.TWO_FA_status,
          old_password: this.state.opassword,
          new_password: this.state.password,
        };
        console.log(obj, 'reset pass obj');
        const dat = await backEndCallObj('/user/change_password', obj);
        if (dat.success) {
          showToast('success', dat.success);
          await allactions();
          setTimeout(() => {
            this.props.navigation.navigate('home');
            this.loadingButton.showLoading(false);
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

  render() {
    // console.log(this?.props?.auth, '-----auth-----', this?.props?.getprofil);
    return (
      <SafeAreaView>
        <View
          style={{
            width: wp('100%'),
            height: hp('100%'),
            backgroundColor: '#0d0d0d',
          }}>
          <View style={styles.headerCont}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('home')}>
              <Icon name="arrow-back" type="ionicons" size={35} color="#fff" />
            </TouchableOpacity>
            <View style={{width: wp('80%')}}>
              <Image
                style={{
                  width: 205,
                  height: 60,
                  left: 52,
                }}
                source={require('../../../../assests/images/logoname-bg.png')}
                resizeMode="contain"
              />
            </View>
          </View>
          <Toast />
          {!this.state.rcvotp ? (
            <View style={{marginHorizontal: wp('5%'), marginTop: hp('5%')}}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#fff',
                  textAlign: 'center',
                }}>
                To Update Your Password Please Click Button To Receive An OTP To
                Registered Email.
              </Text>
              <TouchableOpacity
                onPress={() => this.rcvotp()}
                style={{
                  width: wp('45%'),
                  height: hp('7%'),
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: hp('5%'),
                  borderWidth: 1,
                  borderColor: '#00f9f1',
                }}>
                <Text
                  style={{color: '#00f9f1', fontFamily: 'Montserrat-SemiBold'}}>
                  Request OTP
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
            <View style={styles.FormArea}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 20,
                  
                  marginVertical: hp('3%'),
                }}>
                Update Password
              </Text>

              <View>
                <ScrollView style={{marginBottom:70}}>
                  <View style={styles.Mainform}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        fontFamily: 'Montserrat-SemiBold',
                      }}>
                      Old Password
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
                          style={{color: '#fff'}}
                          onChangeText={opassword =>
                            this._opassonChange(opassword)
                          }
                          maxLength={15}
                          value={this.state.opassword}
                          placeholder="Please Enter Old Password"
                          placeholderTextColor="#548773"
                          secureTextEntry={this.state.opassvisible}
                        />

                        {this.state.opassvisible === true ? (
                          <TouchableOpacity onPress={() => this.oldpassvis()}>
                            <Icon
                              name="visibility-off"
                              type="Entypo"
                              size={20}
                              color="#10e549"
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => this.oldpassvis()}>
                            <Icon
                              name="remove-red-eye"
                              type="Entypo"
                              size={20}
                              color="#10e549"
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
                          returnKeyType="done"
                          onChangeText={code =>
                            this.setState({
                              code,
                              buttonDisabled: false,
                            })
                          }
                          maxLength={6}
                          value={this.state.code}
                          placeholder="Please Enter OTP"
                          keyboardType="number-pad"
                          placeholderTextColor={'#548773'}
                          style={{color: '#fff'}}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        fontFamily: 'Montserrat-SemiBold',
                        marginTop: hp('1.5%'),
                      }}>
                      New Password
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
                          style={{color: '#fff'}}
                          onChangeText={password =>
                            this._passonChange(password)
                          }
                          maxLength={15}
                          value={this.state.password}
                          placeholder="Please Enter New Password"
                          placeholderTextColor="#548773"
                          secureTextEntry={this.state.passvisible}
                        />

                        {this.state.passvisible === true ? (
                          <TouchableOpacity onPress={() => this.passvis()}>
                            <Icon
                              name="visibility-off"
                              type="Entypo"
                              size={20}
                              color="#10e549"
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => this.passvis()}>
                            <Icon
                              name="remove-red-eye"
                              type="Entypo"
                              size={20}
                              color="#10e549"
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
                          style={{color: '#fff'}}
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
                          placeholderTextColor={'#548773'}
                          secureTextEntry={this.state.confirmpassvisible}
                        />

                        {this.state.confirmpassvisible === true ? (
                          <TouchableOpacity
                            onPress={() => this.confirmpassvis()}>
                            <Icon
                              name="visibility-off"
                              type="Entypo"
                              size={20}
                              color="#10e549"
                              style={{}}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => this.confirmpassvis()}>
                            <Icon
                              name="remove-red-eye"
                              type="Entypo"
                              size={20}
                              color="#10e549"
                              style={{}}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </ScrollView>

              </View>
            </View>
            <View>
                {this.state.shownewcode ? (
                  <TouchableOpacity
                    onPress={()=>this.newcode()}
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
                          color: '#00f8f0',
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
                <View style={styles.ButtonWrapper}>
                  <AnimateLoadingButton
                    ref={c => (this.loadingButton = c)}
                    width={wp('45%')}
                    height={hp('7%')}
                    borderWidth={3}
                    backgroundColor="#00f8f0"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={10}
                    titleFontFamily="Montserrat-SemiBold"
                    title="Reset"
                    titleFontSize={hp('2.3%')}
                    titleColor="black"
                    onPress={this._onPresscngpswd.bind(this)}
                  />
                </View>
            </View>
          )}

        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    getprofil: state.getprofil,
  };
};

export default connect(mapStateToProps)(ChangePAssword);

const styles = StyleSheet.create({
  headerCont: {
    height: hp('8%'),
    backgroundColor: '#00291e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  FormArea: {
    width: wp('95%'),
    height: hp('55%'),
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 50,
    backgroundColor: '#0f2d24',
  },
  Mainform: {
    alignItems: 'flex-start',
    marginVertical: hp('1%'),
    marginHorizontal: wp('5%'),
    width: wp('80%'),
    marginBottom:100
  },
  sidecont: {
    height: hp('5%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: hp('2%'),
  },
  inputStyle: {
    flex: 85,
    height: hp('7.4%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: wp('3%'),
    color: '#353535',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#10e549',
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
    marginTop: 25,
    alignSelf: 'center',
  },
  newcoderight: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
