import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TextInput,
} from 'react-native';
import moment from 'moment';
import AnimateLoadingButton from 'react-native-animate-loading-button';
var Joi = require('joi-browser');
import Toast from 'react-native-toast-message';
import DatePicker from 'react-native-neat-date-picker';
import CountryPicker, {
  getAllCountries,
  getCallingCode,
} from 'react-native-country-picker-modal';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {backEndCall} from '../../../services/allService';
import {launchImageLibrary} from 'react-native-image-picker';
import {showToast} from '../../../services/toastService';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
const schema = Joi.object().keys({
  name: Joi.string().min(5).max(15).required(),
  dob: Joi.string().min(6).required(),
  address: Joi.string().min(10).max(200).required(),
  nationality: Joi.string().min(5).required().label('Country'),
});
class Profile extends Component {
  state = {
    image: '',
    updateDetails: false,
    showDatePicker: false,
    placeholder: '+63',
    name: '',
    phone: '',
    dob: '',
    address: '',
    country: '',
    nationality: '',
    profileDetails: '',
    code: '',
  };
  handleClick = async () => {
    const options = {};
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        await this.setState({
          image: response.assets[0].uri,
          enablebutton: false,
        });
      }
    });
  };
  _savedetails = async () => {
    this.loadingButton.showLoading(true);
    const {name, dob, address, nationality} = this.state;

    const validata = Joi.validate(
      {
        name: name,
        dob: dob,
        address: address,
        nationality: nationality,
      },
      schema,
      function (inderr, value) {
        if (!inderr) return null;
        const reter = inderr.details[0].message;
        return reter;
      },
    );
    if (!!validata) {
      this.loadingButton.showLoading(false);

      showToast('error', validata);
    } else if (this.state.phone.length !== 10) {
      await this.setState({buttonDisabled: true, buttonshow: true});
      showToast('error', 'Phone Number Must Be 10-Digits');
      this.loadingButton.showLoading(false);
      this.setState({phone: ''});
    } else if (!this.state.dob) {
      showToast('error', 'Please Enter D.O.B');
      this.loadingButton.showLoading(false);
    } else {
      const code = this.state.ccode ? this.state.ccode : 63;
      try {
        const obj = {
          full_name: this.state.name,
          phone_number: code + this.state.phone,
          dob: this.state.dob,
          country: this.state.nationality,
          address: this.state.address,
        };
        console.log(obj, 'new obj');
        this.setState({profileDetails: obj});
        this.setState({updateDetails: true});
        // if (dat.success) {
        //   showToast('success', dat.success);
        //   await allactions();
        //   setTimeout(async () => {
        //     // await get_profile();
        //     this.loadingButton.showLoading(false);
        //     Actions.home();
        //   }, 1000);
        //   this.setState({editform: false});
        // }
      } catch (ex) {
        // if (ex.response && ex.response.status === 400) {
        //   this.loadingButton.showLoading(false);
        //   showToast('error', ex.response.data);
        // }
      }
    }
  };
  onConfirm = async date => {
    await this.setState({showDatePicker: false, dob: date.dateString});
  };
  opendatepicker = async () => {
    await this.setState({showDatePicker: true});
  };
  onCancel = async () => {
    await this.setState({showDatePicker: false});
  };
  wsname = async firstname => {
    if (firstname.length <= 15) {
      if (firstname[0] == 0) {
        showToast('error', "Don't Enter space and '0' before firstname.");
        await this.setState({name: ''});
      } else {
        await this.setState({name: firstname});

        let na = firstname.replace(
          /[`~!@#$₹₱%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢℅؋ƒ₼$៛₡✓•△¶∆\{\}\[\]\\\/]/gi,
          '',
        );
        const reppo = na.replace(' ', '');
        await this.setState({name: reppo});
      }
    } else {
    }
  };
  _onChange = async phone => {
    if (phone.length <= 10) {
      if (phone[0] == 0) {
        showToast(
          'error',
          'Dont Enter space & "0" before Business phonenumber.',
        );
        await this.setState({phone: ''});
      } else {
        await this.setState({phone: phone});
        let na = phone.replace(
          /[`~!@#$%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢✓•△¶N∆\{\}\[\]\\\/]/gi,
          '',
        );
        const reppo = na.replace(' ', '');
        await this.setState({phone: reppo});
      }
    } else {
    }
  };
  render() {
    const user = this.props?.getprofil;

    const det = moment().subtract(18, 'years');

    return (
      <View style={{flex: 1, backgroundColor: '#000000'}}>
        <View style={styles.headerCont}>
          <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
            <Icon name="menu" type="ionicons" size={35} color="#fff" />
          </TouchableOpacity>
          <Image
            style={{
              width: 205,
              height: 60,
              left: 53,
            }}
            source={require('../../../assests/images/logoname-bg.png')}
            resizeMode="contain"
          />
        </View>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.markinfo}>
              {this.state.image ? (
                <Image source={{uri: this.state.image}} style={styles.mark} />
              ) : (
                <ImageBackground
                  source={require('../../../assests/images/person.png')}
                  style={styles.mark}
                />
              )}
              <TouchableOpacity style={styles.DPedit}>
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => this.handleClick()}>
                  <Icon name="edit" type="Entypo" color={'#3ee510'} size={17} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>{user?.user_name}</Text>
            <Text style={styles.text}>{user?.userid}</Text>
            <Text style={[styles.text, {color: '#dc3545'}]}>Un-Verfied</Text>

            <View style={styles.line}></View>
            <Toast />
            {user.profile ? (
              <View>
                <View style={styles.profDetails}>
                  <Icon type="Ionicons" name="person" color={'white'} />
                  <Text style={styles.profText}>{user.profile?.full_name}</Text>
                </View>
                <View style={styles.profDetails}>
                  <Icon type="Ionicons" name="call" color={'white'} />
                  <Text style={styles.profText}>{user.profile?.phone}</Text>
                </View>
                <View style={styles.profDetails}>
                  <Icon type="Ionicons" name="calendar-month" color={'white'} />
                  <Text style={styles.profText}>
                    {user.profile?.date_of_birth}
                  </Text>
                </View>
                <View style={styles.profDetails}>
                  <Icon type="FontAwesome" name="contacts" color={'white'} />
                  <Text style={styles.profText}>{user.profile?.address}</Text>
                </View>
                <View style={[styles.profDetails]}>
                  <Icon type="FontAwesome" name="place" color={'white'} />
                  <Text style={styles.profText}>
                    {user.profile?.nationality}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  marginHorizontal: wp('5%'),
                  marginVertical: hp('3%'),
                }}>
                <DatePicker
                  isVisible={this.state.showDatePicker}
                  dateStringFormat={'dd/mm/yyyy'}
                  mode={'single'}
                  placeholder="Select Date of Birth"
                  placeholderTextColor={'#b3b3b3'}
                  initialDate={new Date(det)}
                  maxDate={new Date(det)}
                  onCancel={this.onCancel}
                  onConfirm={this.onConfirm}
                />
                <Text
                  style={{
                    color: '#fff',
                    alignSelf: 'center',
                    fontSize: 20,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Update Profile
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: hp('1%'),
                  }}>
                  <View style={{width: wp('30%')}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}>
                      FULL NAME
                    </Text>
                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Please Enter Fullname"
                    maxLength={15}
                    placeholderTextColor={'#b3b3b3'}
                    returnKeyType="done"
                    //   onChangeText={firstname =>
                    //     this.setState({firstname: firstname})
                    //   }
                    onChangeText={firstname => this.wsname(firstname)}
                    value={this.state.name}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: hp('1%'),
                  }}>
                  <View style={{width: wp('30%')}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}>
                      PHONE NUMBER
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderColor: '#10e549',
                      borderWidth: 1,
                      width: wp('55%'),
                      borderRadius: hp('1.5%'),
                    }}>
                    <View
                      style={{
                        width: wp('15%'),
                        height: hp('5.4%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                      }}>
                      <CountryPicker
                        countryCodes={['PH', 'IN', 'TR', 'AE', 'VN']}
                        withAlphaFilter={false}
                        withFilter={true}
                        withCallingCode
                        withFlagButton
                        withFlag
                        getAllCountries
                        value={this.state.phone}
                        translation="eng"
                        placeholder={
                          this.state.code
                            ? +this.state.code
                            : this.state.placeholder
                        }
                        onSelect={country => {
                          console.log(country, 'cntry');
                          this.setState({
                            code: country.callingCode[0],

                            placeholder: '',
                          });
                        }}
                        theme={{
                          onBackgroundTextColor: 'white',
                          backgroundColor: 'black',
                        }}
                      />
                    </View>

                    <View style={{width: wp('45%')}}>
                      <TextInput
                        style={[
                          {
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            paddingHorizontal: wp('0.5%'),
                            color: '#fff',
                          },
                        ]}
                        maxLength={10}
                        placeholder="Enter phonenumber"
                        placeholderTextColor={'#b3b3b3'}
                        returnKeyType="done"
                        onChangeText={phone => this._onChange(phone)}
                        value={this.state.phone}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: hp('1%'),
                  }}>
                  <View style={{width: wp('30%')}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}>
                      DATE OF BIRTH
                    </Text>
                  </View>
                  <View style={{}}>
                    <TouchableOpacity
                      style={[
                        styles.inputStyle,
                        {
                          justifyContent: 'center',
                          height: hp('5.1%'),
                          color: '#353535',
                          alignItems: 'flex-start',
                          alignSelf: 'flex-start',
                          width: wp('55%'),
                        },
                      ]}
                      onPress={() => this.opendatepicker()}>
                      <Text style={{color: '#b3b3b3', fontSize: 12, left: 20}}>
                        {this.state.dob
                          ? this.state.dob
                          : '--Please Select Date Of Birth--'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: hp('1%'),
                  }}>
                  <View style={{width: wp('30%')}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}>
                      ADDRESS
                    </Text>
                  </View>

                  <View style={{width: wp('60%')}}>
                    <TextInput
                      style={[
                        styles.inputStyle,
                        {
                          height: 'auto',
                          color: '#fff',
                          fontSize: 12,
                          paddingLeft: 5,
                          paddingRight: 0,
                          paddingVertical: 10,
                          fontFamily: 'Montserrat-Medium',
                          textTransform: 'capitalize',
                        },
                      ]}
                      placeholder="Please Enter Address"
                      placeholderTextColor={'#b3b3b3'}
                      returnKeyType="done"
                      multiline={true}
                      value={this.state.address}
                      onChangeText={address => this.setState({address})}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: hp('1%'),
                  }}>
                  <View style={{width: wp('30%')}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}>
                      Country
                    </Text>
                  </View>
                  <View
                    style={{
                      width: wp('55%'),
                      height: hp('5.4%'),
                      justifyContent: 'center',
                      borderRadius: hp('1.5%'),
                      borderWidth: 1,
                      borderColor: '#10e549',
                    }}>
                    <CountryPicker
                      countryCodes={['PH', 'IN', 'TR', 'AE', 'VN']}
                      withAlphaFilter={false}
                      withFilter={true}
                      withCallingCode
                      withFlagButton
                      withFlag
                      getAllCountries
                      value={this.state.nationality}
                      translation="eng"
                      placeholder={
                        this.state.nationality
                          ? this.state.nationality
                          : '  - Please Select Country -'
                      }
                      onSelect={country => {
                        console.log(country, 'cntry');
                        this.setState({
                          nationality: country.name,
                        });
                      }}
                      theme={{
                        onBackgroundTextColor: '#b3b3b3',
                        backgroundColor: 'black',
                      }}
                    />
                  </View>
                </View>

                <View style={{marginTop: hp('3%')}}>
                  <AnimateLoadingButton
                    ref={c => (this.loadingButton = c)}
                    width={wp('45%')}
                    height={hp('6%')}
                    borderWidth={1}
                    backgroundColor={'#01e4dc'}
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={10}
                    titleFontFamily="Montserrat-SemiBold"
                    title="Sumbit"
                    titleFontSize={hp('2%')}
                    titleColor="black"
                    onPress={this._savedetails.bind(this)}
                  />
                </View>
              </View>
            )}
            <View style={[styles.line, {height: 1}]}></View>
            <View style={{flexDirection: 'row', left: 10, top: 10}}>
              <Icon
                name="add-shopping-cart"
                type="Ionicons"
                color={'#e2fde9'}
                size={18}
                style={{top: 5}}
              />
              <Text style={styles.text2}>Active Liquidity</Text>
            </View>
            <Text style={styles.numText}>{user?.stats?.active_staked}</Text>
            <View style={{flexDirection: 'row', left: 10, top: 10}}>
              <Icon
                name="money"
                type="AntDesign"
                color={'#e2fde9'}
                size={18}
                style={{top: 5}}
              />
              <Text style={styles.text2}>Total Liquidity</Text>
            </View>
            <Text style={[styles.numText, {marginBottom: 20}]}>
              {user?.stats?.total_staked}
            </Text>
          </View>
          <View style={styles.box}>
            <Icon
              name="fingerprint"
              type="Entypo"
              color={'#63d35a'}
              size={70}
              style={{marginTop: 20}}
            />
            <Text style={{color: '#04b049', fontSize: 25}}>Take a Selfie</Text>
            <Text style={styles.kycText}>
              Please upload a selfie for KYC verfication
            </Text>
            <Text style={{color: '#fff'}}>
              Make sure face is clearly visible without any blur
            </Text>

            <Image
              source={require('../../../assests/images/kyc.png')}
              style={styles.hintImg}
            />
            <TouchableOpacity
              style={styles.selfieCamCont}
              onPress={() => this.props.navigation.navigate('camera')}>
              <Text style={{color: '#00f9f1'}}>Selfie Camera</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.box, {marginBottom: 100}]}>
            <Icon
              name="fingerprint"
              type="Entypo"
              color={'#63d35a'}
              size={70}
              style={{marginTop: 20}}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 19,
                fontFamily: 'Poppins-SemiBold',
                textAlign: 'center',
              }}>
              {user?.TWO_FA_status == 'Disable'
                ? 'Two Factor Authenctication'
                : 'Disable Two-Factor Authentication? If you disable Two-Factor Authentication, your Account will be protected with only your password and Email OTP.'}
            </Text>
            <Text
              style={{
                color: '#b3b3b3',
                textAlign: 'center',
                fontSize: 17,
                width: wp('85%'),
              }}>
              {user?.TWO_FA_status == 'Disable'
                ? 'Two Factor Authentication adds an extra layer of security to your Account. Once Enabled, each time you will also be prompted to enter a code which is generated by your smartphone.'
                : 'To Disable/Deactivate 2fa you will Recieve an OTP to your Registered Email.'}
            </Text>
            <TouchableOpacity
              style={styles.fa2}
              onPress={() => this.props.navigation.navigate('2fa')}>
              <Text style={{color: '#00f9f1', fontSize: 18}}>{user?.TWO_FA_status =='Disable'?'Enable 2FA':'Receive OTP'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    getprofil: state.getprofil,
  };
};

export default connect(mapStateToProps)(Profile);
const styles = StyleSheet.create({
  headerCont: {
    height: hp('8%'),
    backgroundColor: '#00291e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  container: {
    width: wp('95%'),
    backgroundColor: '#0d0d0d',
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: hp('2.5%'),
    marginBottom: 30,
  },
  markinfo: {
    width: 150,
    height: 150,
    borderColor: '#10e549',
    borderWidth: 1,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: '#17352d',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mark: {
    width: 140,
    height: 140,
    borderRadius: 100,
    alignSelf: 'center',
  },
  DPedit: {
    position: 'absolute',
    bottom: 6,
    left: 35,
  },
  editIcon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#10e549',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 10,
    fontFamily: 'NotoSerifBalinese-Regular',
    fontSize: 20,
  },
  line: {
    width: wp('85%'),
    height: 0.3,
    backgroundColor: '#b3b3b3',
    marginTop: 20,
    alignSelf: 'center',
  },
  profDetails: {
    flexDirection: 'row',
    marginTop: 20,
    left: 10,
  },
  profText: {
    color: '#fff',
    top: 2,
    left: 5,
    fontSize: 15,
  },
  text2: {
    fontFamily: 'YoungSerif-Regular',
    color: '#e2fde9',
    fontSize: 18,
  },
  numText: {
    fontFamily: 'NotoSerifBalinese-Regular',
    color: 'white',
    left: 25,
    top: 10,
    fontSize: 16,
  },
  box: {
    width: wp('93%'),
    //height: hp('70%'),
    backgroundColor: '#0f2d24',
    borderRadius: hp('2%'),
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  kycText: {
    color: '#b3b3b3',
    textAlign: 'center',
    fontSize: 20,
    top: 10,
    fontFamily: 'NotoSerifBalinese-Regular',
  },
  hintImg: {
    resizeMode: 'contain',
    width: 150,
    height: 150,
    top: 10,
  },
  selfieCamCont: {
    width: wp('55%'),
    height: hp('5%'),
    backgroundColor: '#06130f',
    marginTop: 20,
    borderRadius: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  fa2: {
    width: wp('70%'),
    height: 50,
    borderWidth: 1,
    borderColor: '#00f9f1',
    borderRadius: 5,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputStyle: {
    borderColor: '#10e549',
    borderWidth: 1,
    width: wp('55%'),
    borderRadius: hp('1.5%'),
    color: '#fff',
  },
});
