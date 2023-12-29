import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import CountdownCircle from 'react-native-countdown-circle';
import Toast from 'react-native-toast-message';
import {Icon} from 'react-native-elements';
import {showToast} from '../../../../services/toastService';
import {backEndCallObj} from '../../../../services/allService';
import _ from 'lodash';
import authService from '../../../../services/authService';
var Joi = require('joi-browser');

const schema = Joi.object().keys({
  facode: Joi.string()
    .min(6)
    .max(6)
    .required()
    .error(() => {
      return {
        message: 'Please Enter 6 Digit 2FA Code',
      };
    })
    .label('2fa Code'),
});

const dschema = Joi.object().keys({
  dfacode: Joi.string()
    .min(6)
    .max(6)
    .required()
    .error(() => {
      return {
        message: 'Please Enter 6 Digit 2FA Code',
      };
    })
    .label('2fa Code'),
  otp: Joi.string()
    .min(6)
    .max(6)
    .error(() => {
      return {
        message: 'Please Enter Valid OTP',
      };
    })
    .required(),
});

class Factor2FA extends Component {
  state = {
    response: {},
    faqrcode: false,
    uprfil: {},
    twofa: '',
    facode: '',
    errors: '',
    cntnuebtn: false,
    dfacode: '',
    otp: '',
    shownewcode: false,
  };
  async componentDidMount() {
    
    const up = this.props?.getprofil;
    await this.setState({twofa: up?.TWO_FA_status, uprfil: up});
  }

  _onhandle2fa = async () => {
    this.loadingButton.showLoading(true);
    Keyboard.dismiss();
    try {
      const response = await backEndCallObj('/user/enable_2fa');
      if (response) {
        this.setState({faqrcode: true, response});
        this.loadingButton.showLoading(false);
      }
    } catch (error) {
      showToast('error', error?.response?.data);
      this.loadingButton.showLoading(false);
    }
  };

  _onsubmit2fa = async () => {
    this.loadingButton.showLoading(true);
    let val = '';
    const validata = Joi.validate(
      {
        facode: this.state.facode,
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
      setTimeout(async () => {
        this.loadingButton.showLoading(false);
        await this.setState({
          errors: null,
          facode: '',
        });
      }, 10);
    } else {
      try {
        const obj = {
          two_fa_code: this.state.facode,
        };
        const res = await backEndCallObj('/user/activate_2fa', obj);

        if (res) {
          showToast('success', res?.success);
          setTimeout(async () => {
            await authService.logout(this.props);
            this.props.navigation.navigate('login');
          }, 1000);
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

  continue = async () => {
    const user = this?.props?.auth;
    try {
      var obj = {
        user_email: user?.user_email,
        otp_type: '2FA',
      };

      const res = await backEndCallObj('/user/send_otp', obj);
      if (res) {
        showToast('success', res?.success);
        await this.setState({cntnuebtn: true});
      }
    } catch (error) {
      showToast('error', error);
    }
  };

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

  async _finishCount() {
    await this.setState({shownewcode: true});
  }

  _ondisable2fa = async () => {
    this.loadingButton.showLoading(true);
    let val = '';
    const validata = Joi.validate(
      {
        dfacode: this.state.dfacode,
        otp: this.state.otp,
      },
      dschema,
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
      setTimeout(async () => {
        this.loadingButton.showLoading(false);
        await this.setState({
          errors: null,
        });
      }, 10);
    } else {
      try {
        const obj = {
          two_fa_code: this.state.dfacode,
          otp: this.state.otp,
        };
        const res = await backEndCallObj('/user/disable_2fa', obj);

        if (res) {
          showToast('success', res?.success);
          setTimeout(async () => {
            await authService.logout(this.props);
            Actions.login();
            this.props.navigation.navigate('login');
          }, 1000);
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
          backgroundColor: '#000000',
        }}>
        <View>
          <View style={styles.headerCont}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" type="ionicons" size={35} color="#fff" />
            </TouchableOpacity>

            <Image
              style={{
                width: 205,
                height: 60,
                left: 53,
              }}
              source={require('../../../../assests/images/logoname-bg.png')}
              resizeMode="contain"
            />
          </View>
          <View style={{zIndex: 1, top: -5}}>
            <Toast />
          </View>
          {this.state?.twofa == 'Disable' ? (
            !this.state?.faqrcode ? (
              <View style={styles.twoFaAuthCont}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#edc842',
                    fontSize: 20,
                    textAlign: 'center',
                    top: 10,
                  }}>
                  Two-factor Authentication
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Monrserrat-SemiBold',
                    marginVertical: hp('3%'),
                    fontSize: 15,
                    lineHeight: hp('3%'),
                    textAlign: 'center',
                  }}>
                  Configure two factor authentication. Two factor authentication
                  adds an extra layer of security to your account. Once enabled,
                  each time you login you will also be prompted to enter a code
                  which is generated by your smartphone.
                </Text>
                <View style={styles.ButtonWrapper}>
                  <AnimateLoadingButton
                    ref={c => (this.loadingButton = c)}
                    width={wp('45%')}
                    height={hp('6%')}
                    backgroundColor="#00f9f1"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={10}
                    titleFontFamily="Montserrat-SemiBold"
                    title={
                      this?.state?.twofa === 'Enable' ? 'Disable' : 'Enable'
                    }
                    titleFontSize={hp('2%')}
                    titleColor="black"
                    onPress={this._onhandle2fa.bind(this)}
                  />
                </View>
              </View>
            ) : (
              <ScrollView>
                <View style={styles.googleSetupCont}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      color: '#edc842',
                      fontSize: 18,
                      marginTop: 10,
                      textAlign: 'center',
                    }}>
                    Set up the Google Authenticator app
                  </Text>
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: '#fff',
                      alignSelf: 'center',
                      marginTop: 10,
                    }}
                    source={{uri: this?.state?.response?.QR}}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Montserrat-Medium',
                      marginTop: hp('3%'),
                      marginVertical: hp('1.5%'),
                      textAlign: 'center',
                    }}>
                    Go to App Store / Play Store in your device and install the
                    Google Authenticator app.
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Montserrat-Medium',
                      textAlign: 'center',
                      marginVertical: hp('1.5%'),
                    }}>
                    After adding Google Authenticator, provide the 6-digit code
                    generated by the Google Authenticator app to verify that
                    your authentication is working properly.
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Montserrat-Medium',
                      textAlign: 'center',
                      marginVertical: hp('1.5%'),
                    }}>
                    If the Qr is not recognised , enter the below key manually .
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 17,
                      marginTop: hp('2.5%'),
                      left: 15,
                    }}>
                    security key :
                  </Text>
                  {this?.state?.faqrcode && this?.state?.response ? (
                    <Text
                      style={{
                        color: '#edc842',
                        fontFamily: 'Montserrat-Bold',
                        fontSize: 17,
                        marginTop: hp('0.5%'),
                        left: 15,
                        width:wp('85%')
                      }}>
                      {this?.state?.response?.secret}
                  
                    </Text>
                  ) : null}
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Montserrat-Medium',
                      left: 10,
                      marginVertical: hp('1%'),
                    }}>
                    Authentication code(2fa)
                  </Text>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Please Enter Google 2fa code"
                    placeholderTextColor={'gray'}
                    maxLength={6}
                    returnKeyType="done"
                    onChangeText={facode => this.setState({facode})}
                    value={this.state.facode}
                    keyboardType="decimal-pad"
                  />

                  <View style={styles.ButtonWrapper}>
                    <AnimateLoadingButton
                      ref={c => (this.loadingButton = c)}
                      width={wp('45%')}
                      height={hp('6%')}
                      backgroundColor="#00f9f1"
                      justifyContent="center"
                      alignItems="center"
                      borderRadius={10}
                      titleFontFamily="Montserrat-SemiBold"
                      title="Activate"
                      titleFontSize={hp('2%')}
                      titleColor="black"
                      onPress={this._onsubmit2fa.bind(this)}
                    />
                  </View>
                </View>
              </ScrollView>
            )
          ) : (
            <View style={styles.disable2faCont}>
              <Text
                style={{
                  color: '#edc842',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 20,
                  marginTop: hp('2%'),
                  alignSelf: 'center',
                }}>
                Disable 2fa
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Montserrat-SemiBold',
                  marginTop: hp('5%'),
                  textAlign: 'center',
                }}>
                You need to enter your One-Time Code to Continue.
              </Text>
              {!this.state.cntnuebtn ? (
                <TouchableOpacity
                  onPress={() => this.continue()}
                  disabled={this.state.cntnuebtn}
                  style={styles.conBtn}>
                  <Text
                    style={{
                      color: '#01f2ea',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Continue
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{marginTop: hp('5%')}}>
                  <View>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Montserrat-SemiBold',
                        marginBottom: hp('1%'),
                      }}>
                      Authentication code(2fa)
                    </Text>
                    <TextInput
                      style={styles.inputStyle}
                      placeholder="Please Enter Google 2fa code"
                      placeholderTextColor={'gray'}
                      maxLength={6}
                      returnKeyType="done"
                      onChangeText={dfacode => this.setState({dfacode})}
                      value={this.state.dfacode}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Montserrat-SemiBold',
                        marginVertical: hp('1%'),
                      }}>
                      OTP
                    </Text>
                    <TextInput
                      style={styles.inputStyle}
                      placeholder="Please Enter OTP"
                      placeholderTextColor={'gray'}
                      maxLength={6}
                      returnKeyType="done"
                      onChangeText={otp => this.setState({otp})}
                      value={this.state.otp}
                      keyboardType="decimal-pad"
                    />
                  </View>

                  {this.state.shownewcode ? (
                    <TouchableOpacity
                      onPress={this.continue}
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
                        color="#edc842"
                        bgColor="#fff"
                        textStyle={{fontSize: 11, color: '#edc842'}}
                        onTimeElapsed={() => this._finishCount()}
                      />
                    </View>
                  )}

                  <View style={styles.ButtonWrapper}>
                    <AnimateLoadingButton
                      ref={c => (this.loadingButton = c)}
                      width={wp('45%')}
                      height={hp('6%')}
                      borderWidth={3}
                      backgroundColor="#121212"
                      justifyContent="center"
                      alignItems="center"
                      borderRadius={10}
                      titleFontFamily="Montserrat-SemiBold"
                      title="De-Activate"
                      titleFontSize={hp('2%')}
                      titleColor="white"
                      onPress={this._ondisable2fa.bind(this)}
                    />
                  </View>
                </View>
              )}
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

export default connect(mapStateToProps)(Factor2FA);

const styles = StyleSheet.create({
  ButtonWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerCont: {
    height: hp('8%'),
    backgroundColor: '#00291e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  inputStyle: {
    height: hp('5.4%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: hp('1.6%'),
    fontFamily: 'Montserrat-Regular',
    backgroundColor: '#EBEBEB',
    paddingHorizontal: wp('3%'),
    flexGrow: wp('80%'),
    letterSpacing: wp('0.2%'),
    borderRadius: 5,
    width: wp('80%'),
    left: 10,
  },
  sidecont: {
    height: hp('5%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: hp('1.5%'),
  },
  inputStylee: {
    flex: 85,
    height: hp('5.4%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    backgroundColor: '#EBEBEB',
    paddingHorizontal: wp('2%'),
    color: '#353535',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
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
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  newcoderight: {
    marginTop: hp('4%'),
    flexDirection: 'row',
    alignSelf: 'center',
  },
  disable2faCont: {
    marginHorizontal: wp('5%'),
    marginTop: hp('3%'),
    backgroundColor: '#0f2d24',
    borderWidth: 0.5,
    borderColor: '#10e549',
    borderRadius: 10,
  },
  conBtn: {
    width: wp('40%'),
    height: hp('6%'),
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: hp('5%'),
    alignSelf: 'center',
    marginBottom: 20,
    borderColor: '#01f2ea',
  },
  twoFaAuthCont: {
    marginHorizontal: wp('4%'),
    marginTop: hp('10%'),
    backgroundColor: '#0f2d24',
    borderColor: '#63d35a',
    borderWidth: 0.5,
    borderRadius: 10,
  },
  googleSetupCont: {
    marginTop: hp('5%'),
    marginHorizontal: wp('4%'),
    backgroundColor: '#0f2d24',
    borderColor: '#00e458',
    borderWidth: 0.5,
    borderRadius: 10,
  },
});
