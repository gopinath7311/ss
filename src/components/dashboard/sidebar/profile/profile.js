import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
// import {
//   regions,
//   provinces,
//   cities,
//   barangays,
// } from 'select-philippines-address';
const {width} = Dimensions.get('window');

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
var Joi = require('joi-browser');
 import {launchImageLibrary} from 'react-native-image-picker';
import auth from '../../../../services/authService';
//import DropDownPicker from 'react-native-dropdown-picker';
// import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-neat-date-picker';
import moment from 'moment';
import {connect} from 'react-redux';
import CountryPicker, {
  getAllCountries,
  getCallingCode,
} from 'react-native-country-picker-modal';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {backEndCall, backEndCallObj} from '../../../../services/allService';
import {Alert} from 'react-native';
import {showToast} from '../../../../services/toastService';
import Toast from 'react-native-toast-message';
import {Icon} from 'react-native-elements';
import allactions from '../../../../redux/actions/allactions';
import get_profile from '../../../../redux/actions/profileAction';
// var RNFS = require('react-native-fs');

const schema = Joi.object().keys({
  firstname: Joi.string().min(5).max(15).required(),
  dob: Joi.string().min(6).required(),
  nationality: Joi.string().min(5).required().label('Country'),
  zipcode: Joi.string().min(6).required().label('Zip Code'),
  address: Joi.string().min(10).max(200).required(),
  //   placeofbirth: Joi.string()
  //     .min(4)
  //     .max(200)
  //     .required()
  //     .error(() => {
  //       return {
  //         message: 'Please Enter PlaceOfBirth with minimum length 4 ',
  //       };
  //     }),
});

class Profile extends Component {
  state = {
    firstname: '',
    phone: '',
    placeofbirth: '',
    address: '',
    nationality: '',
    ccode: '',
    placeholder: '+63',
    zipcode: '',
    showDatePicker: false,
    loader: false,
    date: '',
    avatarSource: '',
    prof: '',
    enablebutton: true,
    editform: false,
    errors: '',
    individualerrors: '',
  };

  async componentDidMount() {
    await get_profile();
    const imdata = await auth.getPic();
    if (imdata === 'Nodata') {
      await this.setState({prof: ''});
    } else {
      const respo = await RNFS.stat(imdata)
        .then(res => {
          return true;
        })
        .catch(err => {
          return false;
        });
      if (!respo) {
        await this.setState({prof: ''});
      } else {
        await this.setState({prof: imdata});
      }
    }
    setTimeout(async () => {
      if (
        this.props?.getprofilevar &&
        this.props?.getprofilevar?.address &&
        this.props?.getprofilevar?.address?.dob
      ) {
        this.setState({date: this.props?.getprofilevar?.address?.dob});
      }
    }, 2000);
  }

    handleClick = async () => {
      const options = {};
      launchImageLibrary(options, async response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          await this.setState({
            prof: response.assets[0].uri,
            enablebutton: false,
          });
        }
      });
    };

    handleUpload = async () => {
      try {
        await auth.uploadPic('Profile', this.state.prof);
        await get_profile();
        await get_profilepic();
        const imdata = await auth.getPic();
        if (imdata === 'Nodata') {
          await this.setState({prof: ''});
        } else {
          await this.setState({prof: imdata});
        }
      } catch (error) {
        return error;
      }
      await this.setState({enablebutton: true});
    };

  _onPressAction = () => {
   // Actions.home();
   this.props.navigation.navigate("fluidbottom")
  };

  _onPressEdit = async () => {
    if (this.props?.auth?.account_type === 'Un-verified') {
      Alert.alert(
        'Alert',
        'Please Complete Your KYC Verification Process',
        [{text: 'OK', onPress: () => Actions.kycverification()}],
        {
          cancelable: false,
        },
      );
    } else {
      await this.setState({editform: true});
    }
  };
  _updtlctn = async () => {
    this.loadingButton.showLoading(true);
    // this.loadingButton.showLoading(false);
    setTimeout(() => {
      Actions.corpmaps();
    }, 200);
  };

  wshsnum = async houseno => {
    if (houseno[0] == 0) {
      showToast('error', "Don't Enter space & '0' before house / unit number.");
      await this.setState({houseno: ''});
    } else {
      await this.setState({houseno: houseno});
    }
  };
  wsplcb = async placeofbirth => {
    if (placeofbirth[0] == 0) {
      showToast('error', "Don't Enter space & '0' before placeofbirth.");
      await this.setState({placeofbirth: ''});
    } else {
      await this.setState({placeofbirth: placeofbirth});
    }
  };

  wsname = async firstname => {
    if (firstname.length <= 15) {
      if (firstname[0] == 0) {
        showToast('error', "Don't Enter space and '0' before firstname.");
        await this.setState({firstname: ''});
      } else {
        await this.setState({firstname: firstname});

        let na = firstname.replace(
          /[`~!@#$₹₱%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢℅؋ƒ₼$៛₡✓•△¶∆\{\}\[\]\\\/]/gi,
          '',
        );
        const reppo = na.replace(' ', '');
        await this.setState({firstname: reppo});
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
  _savedetails = async () => {
    this.loadingButton.showLoading(true);
    const {firstname, address, date, nationality, placeofbirth, zipcode} =
      this.state;

    const validata = Joi.validate(
      {
        firstname: firstname,
        address: address,
        // placeofbirth: placeofbirth,
        dob: date,
        nationality: nationality,
        zipcode: zipcode,
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
    } else if (!this.state.date) {
      showToast('error', 'Please Enter D.O.B');
      this.loadingButton.showLoading(false);
    } else {
      const code = this.state.ccode ? this.state.ccode : 63;
      try {
        const obj = {
          full_name: this.state.firstname,
          phone_number: code + this.state.phone,
          dob: this.state.date,
          country: this.state.nationality,
          zip_code: this.state.zipcode,
          address: this.state.address,
          //   member_email: email,
          //   placeofbirth: placeofbirth,
        };
        console.log(obj, 'new obj');
        const dat = await backEndCallObj('/user/profile', obj);
        //  auth.updateprofile(obj);
        if (dat.success) {
          showToast('success', dat.success);
          await allactions();
          setTimeout(async () => {
            // await get_profile();
            this.loadingButton.showLoading(false);
            Actions.home();
          }, 1000);
          this.setState({editform: false});
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          this.loadingButton.showLoading(false);
          showToast('error', ex.response.data);
        }
      }
    }
  };

  onConfirm = async date => {
    await this.setState({showDatePicker: false, date: date.dateString});
  };
  opendatepicker = async () => {
    // if (!this.props?.getprofilevar?.address?.dob) {
    //   await this.setState({showDatePicker: true});
    // } else if (
    //   this.props?.getprofilevar?.address?.dob &&
    //   this.props?.getprofilevar?.address?.dob === '0'
    // ) {
    //   await this.setState({showDatePicker: true});
    // } else {
    //   await this.setState({showDatePicker: false});
    // }
    await this.setState({showDatePicker: true});
  };
  onCancel = async () => {
    await this.setState({showDatePicker: false});
  };
  render() {
    const det = moment().subtract(18, 'years');
    const profiledata = this.props?.getprofil?.kyc_details;
    const {prof}=this.state
    // console.log(profiledata, 'new pefl');
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#212627'}}>
        <View style={styles.container}>
          <View style={{marginTop: hp('2%'), alignItems: 'flex-start'}}>
            <TouchableOpacity
              style={styles.backArrow}
              onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="arrow-back"
                type="ionicons"
                size={35}
                color={'#fff'}
              />
            </TouchableOpacity>
            {/* <Text style={styles.titles}>
              {this.state.editform ? 'EDIT PROFILE' : 'PROFILE'}
              -{' '}{this.props.auth.user_type}
            </Text> */}
          </View>
          <View style={{zIndex: 1, top: -5}}>
            <Toast />
          </View>
          <View style={styles.Body}>
            <View style={styles.Panel}>
              {this.state.enablebutton ? (
                <TouchableOpacity onPress={this.handleClick}>
                  {!!prof ? (
                    <View style={styles.markinfo}>
                      <ImageBackground
                        source={{uri: prof}}
                        imageStyle={{borderRadius: 100, opacity: 0.6}}
                        style={styles.mark}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={this.handleClick}
                        style={styles.DPedit}>
                        <Image
                          style={{height: 30}}
                          source={require('../../../../assests/images/edit_button.png')}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      {/* <Image
                        style={styles.DP}
                        source={
                          this.props?.getprofil?.images &&
                          this.props?.getprofil?.images?.selfie
                            ? {
                                uri: this.props?.getprofil?.images?.selfie,
                              }
                            : require('../../../../assets/images/img/profile.png')
                        }
                      /> */}
                      <TouchableOpacity
                        onPress={this.handleClick}
                        style={styles.DPedit}>
                        <Image
                          style={{height: 30}}
                          source={require('../../../../assests/images//edit_button.png')}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ) : (
                <View>
                  <TouchableOpacity onPress={this.handleUpload}>
                    <ImageBackground
                      source={{uri: prof}}
                      style={styles.mark}
                      imageStyle={{borderRadius: 100, opacity: 0.6}}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  {this.state.enablebutton === false ? (
                    <TouchableOpacity
                      style={styles.uploadbuttoncontainer}
                      onPress={this.handleUpload}>
                      <Text style={{fontSize: 12, color: '#353535'}}>
                        Upload
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
              <View
                style={{
                  borderColor: '#fff',
                  borderWidth: 1,
                  borderRadius: 80,
                  alignSelf: 'center',
                }}>
                <Image
                  style={{width: 150, height: 150, borderRadius: 80}}
                  source={require('../../../../assests/images/profile1.png')}
                  resizeMode="contain"
                />
              </View>
              <ScrollView>
                {profiledata ? (
                  <View
                    style={{
                      marginHorizontal: wp('5%'),
                      marginVertical: hp('3%'),
                    }}>
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
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          color: '#edc842',
                          textTransform: 'uppercase',
                        }}>
                        : {'  '} {profiledata?.full_name}
                      </Text>
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
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          color: '#edc842',
                          textTransform: 'uppercase',
                        }}>
                        : {'  '}+{' '}
                        {profiledata?.phone_number &&
                        profiledata?.phone_number.length > 10
                          ? profiledata?.phone_number.slice(0, -10) +
                            ' ' +
                            profiledata?.phone_number.slice(-10)
                          : profiledata?.phone_number}
                      </Text>
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
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          color: '#edc842',
                          textTransform: 'uppercase',
                        }}>
                        : {'  '} {profiledata?.dob}
                      </Text>
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
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          color: '#edc842',
                          textTransform: 'uppercase',
                        }}>
                        : {'  '} {profiledata?.country}
                      </Text>
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
                          Zip code
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          color: '#edc842',
                          textTransform: 'uppercase',
                        }}>
                        : {'  '} {profiledata?.zip_code}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
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

                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          color: '#edc842',
                          textTransform: 'capitalize',
                          width: wp('60%'),
                        }}>
                        : {'  '} {profiledata?.address}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      marginHorizontal: wp('5%'),
                      marginVertical: hp('3%'),
                    }}>
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
                        style={editstyles.inputStyle}
                        placeholder="Please Enter Fullname"
                        maxLength={15}
                        placeholderTextColor={'grey'}
                        returnKeyType="done"
                        //   onChangeText={firstname =>
                        //     this.setState({firstname: firstname})
                        //   }
                        onChangeText={firstname => this.wsname(firstname)}
                        value={this.state.firstname}
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
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                          style={{
                            width: wp('15%'),
                            backgroundColor: 'gray',
                            height: hp('5.4%'),
                            alignItems: 'center',
                            justifyContent: 'center',
                            left: 6,
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                          }}>
                          <CountryPicker
                            withAlphaFilter={false}
                            withFilter={true}
                            withCallingCode
                            withFlagButton
                            withFlag
                            getAllCountries
                            value={this.state.ccode}
                            translation="eng"
                            placeholder={
                              this.state.ccode
                                ? '+' + this.state.ccode
                                : this.state.placeholder
                            }
                            onSelect={country => {
                              console.log(country, 'cntry');
                              this.setState({
                                ccode: country.callingCode[0],

                                placeholder: '',
                              });
                            }}
                            theme={{
                              onBackgroundTextColor: 'white',
                              backgroundColor: 'grey',
                            }}
                          />
                        </View>
                        <View style={{width: wp('45%')}}>
                          <TextInput
                            style={[
                              editstyles.inputStyle,
                              {
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                paddingHorizontal: wp('0.5%'),
                              },
                            ]}
                            maxLength={10}
                            placeholder="Enter phonenumber"
                            placeholderTextColor={'grey'}
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
                            editstyles.inputStyle,
                            {
                              justifyContent: 'center',
                              height: hp('5.1%'),
                              color: '#353535',
                              alignItems: 'flex-start',
                              alignSelf: 'flex-start',
                              width: wp('58%'),
                            },
                          ]}
                          onPress={() => this.opendatepicker()}>
                          <Text style={{color: '#353535', fontSize: 12}}>
                            {this.state.date
                              ? this.state.date
                              : 'Please Select Date Of Birth'}
                          </Text>
                        </TouchableOpacity>
                        <DatePicker
                          isVisible={this.state.showDatePicker}
                          dateStringFormat={'dd/MM/yyyy'}
                          mode={'single'}
                          placeholder="Select Date of Birth"
                          placeholderTextColor={'gray'}
                          initialDate={new Date(det)}
                          maxDate={new Date(det)}
                          onCancel={this.onCancel}
                          onConfirm={this.onConfirm}
                          
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
                          width: wp('58%'),
                          backgroundColor: '#EBEBEB',
                          height: hp('5.4%'),
                          //   alignItems: 'center',
                          justifyContent: 'center',
                          left: 6,
                          borderRadius: 5,
                          paddingLeft: 10,
                        }}>
                        <CountryPicker
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
                              : 'Please Select Country'
                          }
                          onSelect={country => {
                            console.log(country, 'cntry');
                            this.setState({
                              nationality: country.name,
                            });
                          }}
                          theme={{
                            onBackgroundTextColor: '#353535',
                            backgroundColor: 'lightgray',
                          }}
                        />
                      </View>
                      {/* <TextInput
                        style={editstyles.inputStyle}
                        placeholder="Please Enter Country"
                        placeholderTextColor={'grey'}
                        returnKeyType="done"
                        onChangeText={nationality =>
                          this.setState({nationality})
                        }
                        value={this.state.nationality}
                      /> */}
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
                          Zip code
                        </Text>
                      </View>
                      <TextInput
                        style={editstyles.inputStyle}
                        placeholder="Please Enter Zipcode"
                        placeholderTextColor={'gray'}
                        maxLength={6}
                        returnKeyType="done"
                        onChangeText={zipcode => this.setState({zipcode})}
                        value={this.state.zipcode}
                        keyboardType="decimal-pad"
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
                          ADDRESS
                        </Text>
                      </View>
                      {/* <TextInput
                      style={editstyles.inputStyle}
                      placeholder="Please Enter Fullname"
                      placeholderTextColor={'#353535'}
                      returnKeyType="done"
                      editable={false}
                      // onChangeText={firstname => this.setState({firstname})}
                      //   value={'name'}
                    /> */}
                      <View style={{width: wp('60%')}}>
                        <TextInput
                          style={[
                            editstyles.inputStyle,
                            {
                              height: 'auto',
                              color: '#353535',
                              fontSize: 9,
                              paddingLeft: 5,
                              paddingRight: 0,
                              paddingVertical: 5,
                              fontFamily: 'Montserrat-Medium',
                              textTransform: 'capitalize',
                            },
                          ]}
                          placeholder="Please Enter Address"
                          placeholderTextColor={'gray'}
                          returnKeyType="done"
                          multiline={true}
                          onChangeText={address => this.setState({address})}
                        />
                      </View>
                    </View>
                    <View style={{marginTop: hp('3%')}}>
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
                        title="SUBMIT"
                        titleFontSize={hp('2%')}
                        titleColor="white"
                        onPress={this._savedetails.bind(this)}
                      />
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    theme: state.theme,
    getprofil: state.getprofil,
  };
};

export default connect(mapStateToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  Body: {
    // paddingHorizontal: wp('4%'),
    // backgroundColor: '#FFFCFC',
    // flexDirection: 'row',
    flex: 1,
    marginTop: hp('3%'),
  },
  Panel: {
    flex: 1,
    // alignItems: 'center',
    // backgroundColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2,
    // elevation: 10,
    // paddingVertical: hp('5%'),
    // paddingHorizontal: wp('7%'),
  },
  DP: {
    width: 100,
    height: 100,
    marginTop: hp('-2.8%'),
    borderRadius: 50,
  },
  DPedit: {
    position: 'absolute',
    bottom: 0,
    right: -5,
  },
  ProfileText: {
    flexDirection: 'row',
  },
  PText: {
    flex: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: hp('2%'),
  },
  LeftText: {
    height: hp('4%'),
    marginVertical: hp('0.4%'),
    color: '#3B99D4',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
  },
  RightText: {
    height: hp('4%'),
    marginVertical: hp('0.4%'),
    alignSelf: 'stretch',
    textAlign: 'right',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    color: '#353535',
  },
  EditProfile: {
    backgroundColor: '#353535',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: hp('1.5%'),
    borderRadius: 40,
    position: 'absolute',
    bottom: 50,
    width: wp('70%'),
  },
  EditText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: hp('2%'),
    color: 'white',
  },
  markinfo: {
    width: 100,
    height: 100,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: 'black',
    marginTop: hp('-2.8%'),
  },
  mark: {
    width: 100,
    height: 100,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: 'black',
  },
  uploadbuttoncontainer: {
    alignSelf: 'center',
    marginTop: hp('2%'),
    backgroundColor: 'transparent',
    borderColor: '#011563',
    borderWidth: 1,
    width: 80,
    height: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  // -----New DropDown-------
  dropdown: {
    width: wp('50%'),
    height: 36,
    borderColor: '#EBEBEB',
    borderWidth: 0.5,
    // borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#EBEBEB',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: hp('1.5%'),
    fontFamily: 'Montserrat-Medium',
  },
  selectedTextStyle: {
    fontSize: hp('1.8%'),
    fontFamily: 'Montserrat-Medium',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

const editstyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ProfileText: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  Label: {
    fontFamily: 'Montserrat-Medium',
    fontSize: hp('1.3%'),
    marginVertical: hp('0.1%'),
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
    marginLeft: wp('2%'),
  },
  sideconts: {
    backgroundColor: '#353535',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomStartRadius: 5,
    borderTopLeftRadius: 5,
    flexGrow: wp('20%'),
    height: hp('5.4%'),
    color: 'white',
    fontSize: hp('1.3%'),
    fontFamily: 'Montserrat-SemiBold',
  },
  sidecont: {
    height: hp('5%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: hp('1.5%'),
  },
  BoxText: {
    color: 'white',
    fontSize: hp('1.8%'),
    fontFamily: 'Montserrat-SemiBold',
  },
  formcont: {
    // marginBottom: hp('1.5%'),
  },
  // -----New DropDown-------
  dropdown: {
    width: wp('50%'),
    height: 36,
    borderColor: '#dedcdc',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#dedcdc',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: hp('1.5%'),
    fontFamily: 'Montserrat-Medium',
  },
  selectedTextStyle: {
    fontSize: hp('1.8%'),
    fontFamily: 'Montserrat-Medium',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
