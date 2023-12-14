import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  PermissionsAndroid,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
//import {Actions} from 'react-native-router-flux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import {BarIndicator} from 'react-native-indicators';
import DocumentPicker from 'react-native-document-picker';
import {connect} from 'react-redux';
import {showToast} from '../../../../services/toastService';
import Toast from 'react-native-toast-message';
import {Icon} from 'react-native-elements';
import {backEndCallObjNEnc} from '../../../services/allService';
import allactions from '../../../redux/actions/allactions';

const logo = require('../../../assests/images/usernb.png');
const {width} = Dimensions.get('window');

class Kyc extends Component {
  state = {
    dtiproof: {},
    secproof: {},
    basedtiproof: '',
    basesecproof: '',
    dtiupload: true,
    secupload: true,
    imgtype: '',
    buttonShow: true,
    loader: false,
    aftrkyc: false,
    newprfil: {},
  };

  async componentDidMount() {
    const prfil = this?.props?.getprofil;
    await this.setState({newprfil: prfil});
  }

  validateImgae = size => {
    if (this.state.imgtype) {
      if (size < 3000000) {
        return true;
      } else if (this.state.imgtype === 'image/jpeg') {
        return true;
      } else if (this.state.imgtype === 'image/png') {
        return true;
      } else if (this.state.imgtype === 'application/pdf') {
        return true;
      } else {
        alert('Please Upload Only JPG/PNG/PDF and Size is Lower than 3mb');
        return false;
      }
    } else {
      alert('Please Upload Only JPG/PNG/PDF and Size is Lower than 3mb');
      return false;
    }
  };
  validsize = size => {
    if (size > 3000000) {
      alert('Please Upload Only JPG/PNG/PDF and Size is Lower than 3mb');
      return false;
    } else {
      return true;
    }
  };
  validatePdf = size => {
    if (size > 5000000) {
      alert('Please Upload Only JPG/PNG/PDF and Size is Lower than 5mb');
      return false;
    } else {
      return true;
    }
  };

  handleupload = async type => {
    var type = type;
    Alert.alert(
      'Upload',
      'Type Of Upload ?',
      [
        {text: 'Camera ', onPress: () => this.oncamera(type)},
        {text: 'Gallery', onPress: () => this.handleClick(type)},
      ],

      {
        cancelable: false,
      },
    );
  };
  oncamera = async type => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Camera permission given');
    } else {
      console.log('Camera permission denied');
    }
    const options = {
      maxWidth: 900,
      maxHeight: 900,
      quality: 0.9,
    };
    launchCamera(options, async response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        await this.setState({
          imgtype: response.assets[0].type,
        });
        const valid = this.validateImgae(response.assets[0].fileSize);
        const validsize = this.validsize(response.assets[0].fileSize);

        if (valid && validsize) {
          if (type === 'dti') {
            RNFS.readFile(response.assets[0].uri, 'base64').then(async res => {
              await this.setState({basedtiproof: res});
            });
            await this.setState({
              dtiproof: response.assets[0],
              dtiupload: false,
            });
          } else if (type === 'sec') {
            RNFS.readFile(response.assets[0].uri, 'base64').then(async res => {
              await this.setState({basesecproof: res});
            });
            await this.setState({
              secproof: response.assets[0],
              secupload: false,
            });
          }
        } else {
        }
      }
    });
  };

  handleClick = async type => {
    Alert.alert(
      'Upload',
      'You would like to Upload ?',
      [
        {
          text: 'Image',
          onPress: () => {
            const options = {
              maxWidth: 900,
              maxHeight: 900,
              quality: 0.9,
            };
            launchImageLibrary(options, async response => {
              if (response.didCancel) {
              } else if (response.error) {
              } else if (response.customButton) {
              } else {
                await this.setState({imgtype: response.assets[0].type});
                const valid = this.validateImgae(response.assets[0].fileSize);
                const validsize = this.validsize(response.assets[0].fileSize);
                if (valid && validsize) {
                  if (type === 'dti') {
                    RNFS.readFile(response.assets[0].uri, 'base64').then(
                      async res => {
                        await this.setState({basedtiproof: res});
                      },
                    );
                    await this.setState({
                      dtiproof: response.assets[0],
                      dtiupload: false,
                    });
                  } else if (type === 'sec') {
                    RNFS.readFile(response.assets[0].uri, 'base64').then(
                      async res => {
                        await this.setState({basesecproof: res});
                      },
                    );
                    await this.setState({
                      secproof: response.assets[0],
                      secupload: false,
                    });
                  }
                } else {
                }
              }
            });
          },
        },
        {
          text: 'Pdf',
          onPress: async () => {
            try {
              const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
              });
              await this.setState({imgtype: res[0].type});
              const valid = this.validateImgae(res[0].size);
              const validsize = this.validatePdf(res[0].size);
              if (valid && validsize) {
                if (type === 'dti') {
                  RNFS.readFile(res[0].uri, 'base64').then(async respo => {
                    await this.setState({basedtiproof: respo});
                  });
                  await this.setState({dtiproof: res[0], dtiupload: false});
                } else if (type === 'sec') {
                  RNFS.readFile(res[0].uri, 'base64').then(async respo => {
                    await this.setState({basesecproof: respo});
                  });
                  await this.setState({secproof: res[0], secupload: false});
                }
              }
            } catch (err) {
              if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
              } else {
                throw err;
              }
            }
          },
        },
      ],
      {cancelable: false},
    );
  };
  handleDelete = async type => {
    if (type === 'dti') {
      await this.setState({dtiproof: {}, basedtiproof: '', dtiupload: true});
    } else if (type === 'sec') {
      await this.setState({secproof: {}, basesecproof: '', secupload: true});
    }
  };
  handleSubmit = async () => {
    const {dtiproof, secproof, newprfil} = this?.state;
    if (newprfil && newprfil?.kyc_details) {
      if (!dtiproof.uri && !secproof.uri) {
        alert('Must Upload All Documents');
      } else if (!secproof.uri) {
        alert('Must Upload All Documents');
      } else {
        try {
          await this.setState({buttonShow: false});
          let pdfarr = [];
          let imgarr = [];
          if (dtiproof.type === 'application/pdf') {
            pdfarr.push(this.state.basedtiproof);
          } else {
            imgarr.push(this.state.basedtiproof);
          }
          if (secproof.type === 'application/pdf') {
            pdfarr.push(this.state.basesecproof);
          } else {
            imgarr.push(this.state.basesecproof);
          }

          const obj = {
            pdf: pdfarr,
            image: imgarr,
          };
          console.log(obj, 'kyc obj');
          const res = await backEndCallObjNEnc('/user/Kyc', obj);
          console.log(res, 'kyc respncs');
          if (res.success) {
            Alert.alert(
              'KYC Verification',
              'Your Verification Request is under process. Please wait for Admin Approval!',
            );
            await this.setState({buttonShow: true});
            await allactions();
              //await get_profile();
            setTimeout(() => {
              //Actions.home();
              this.props.navigation.navigate("home")
            }, 1000);
          }
        } catch (ex) {
          if (ex.response && ex.response.status === 400) {
            Alert.alert('Error', ex.response.data, [
              {
                text: 'OK',
                onPress: () => {
                 // Actions.home();
                 this.props.navigation.navigate("fluidbottom")
                },
              },
            ]);
          } else if (ex.response && ex.response === 500) {
            Alert.alert('Error', ex.response.data, [
              {
                text: 'OK',
                onPress: () => {
                  //Actions.home();
                  this.props.navigation.navigate("fluidbottom")
                },
              },
            ]);
          }
        }
      }
    } else {
      Alert.alert('Alert', 'Please Update Your Profile', [
        {
          text: 'OK',
          onPress: () => {
            //Actions.profile();
            this.props.navigation.navigate("profile")
          },
        },
      ]);
    }
  };

  render() {
    const {dtiproof, secproof} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#212627'}}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeiconinfo}
              activeOpacity={0.5}
              onPress={() => 
              //Actions.home()
              this.props.navigation.goBack()
            }>
              <Icon
                name="arrow-back"
                type="ionicons"
                size={35}
                color={'#fff'}
              />
            </TouchableOpacity>
            {/* <View style={styles.markinfo}>
              <Image source={logo} style={styles.mark} resizeMode="contain" />
            </View> */}
          </View>

          {!this.state.aftrkyc ? (
            !this.state.loader ? (
              <ScrollView>
                <View style={{marginTop: hp('5%')}}>
                  <Text style={styles.requirement}>KYC Details</Text>
                </View>
                {this.state.buttonShow ? (
                  <View>
                    <View>
                      <View style={styles.textcontainer}>
                        <Text style={styles.text}>
                          1. Supporting documents evidencing
                        </Text>
                      </View>
                      <View style={styles.boxcontainer}>
                        {this.state.dtiupload ? (
                          <TouchableOpacity
                            style={styles.uploadbuttoncontainer}
                            onPress={() => this.handleupload('dti')}>
                            <View>
                              <Text style={{color: 'white', fontSize: 14}}>
                                Upload
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <View>
                            <View style={styles.uploadimagecontainer}>
                              {dtiproof.type === 'application/pdf' ? (
                                <Pdf
                                  source={{uri: `${dtiproof.uri}`}}
                                  style={styles.uploadimage}
                                />
                              ) : (
                                <Image
                                  source={
                                    !!dtiproof
                                      ? {
                                          uri: dtiproof.uri,
                                        }
                                      : ''
                                  }
                                  style={styles.uploadimage}
                                />
                              )}
                            </View>

                            <TouchableOpacity
                              style={styles.deletebuttoncontainer}
                              onPress={() => this.handleDelete('dti')}>
                              <View>
                                <View>
                                  <Text style={{color: 'white', fontSize: 14}}>
                                    Delete
                                  </Text>
                                  {/* <Icon
                                    name="delete"
                                    type="ionicons"
                                    size={35}
                                    color={'#fff'}
                                  /> */}
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      <View style={styles.textcontainer}>
                        <Text style={styles.text}>
                          2. Articles of Incorporation/Partnership
                        </Text>
                      </View>

                      <View style={styles.boxcontainer}>
                        {this.state.secupload ? (
                          <TouchableOpacity
                            style={styles.uploadbuttoncontainer}
                            onPress={() => this.handleupload('sec')}>
                            <View>
                              <Text style={{color: 'white', fontSize: 14}}>
                                Upload
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <View>
                            <View style={styles.uploadimagecontainer}>
                              {secproof.type === 'application/pdf' ? (
                                <Pdf
                                  source={{uri: `${secproof.uri}`}}
                                  style={styles.uploadimage}
                                />
                              ) : (
                                <Image
                                  source={
                                    !!secproof
                                      ? {
                                          uri: secproof.uri,
                                        }
                                      : ''
                                  }
                                  style={styles.uploadimage}
                                />
                              )}
                            </View>

                            <TouchableOpacity
                              style={styles.deletebuttoncontainer}
                              onPress={() => this.handleDelete('sec')}>
                              <View>
                                <View>
                                  <Text style={{color: 'white', fontSize: 14}}>
                                    Delete
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.submitcontainer}
                      onPress={this.handleSubmit}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 18,
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      height: hp('40%'),
                    }}>
                    <BarIndicator color="#edc842" count={6} />

                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: 'Montserrat-SemiBold',
                        textAlign: 'center',
                        width: wp('90%'),
                      }}>
                      Please Wait While we upload your Images , Please Dont
                      click Back , It will take a Moment !
                    </Text>
                  </View>
                )}
              </ScrollView>
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: hp('70%'),
                }}>
                <BarIndicator
                  style={{
                    marginBottom: hp('1%'),
                    alignSelf: 'center',
                  }}
                  color="#edc842"
                  count={6}
                />
              </View>
            )
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: hp('70%'),
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                  width: wp('90%'),
                }}>
                Please Wait for the Admin Approval !
              </Text>
            </View>
          )}
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

export default connect(mapStateToProps)(Kyc);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mark: {
    width: 80,
    height: 80,
  },
  markinfo: {
    alignItems: 'center',
    marginTop: hp('2%'),
    flex: 0.86,
    top: hp('5%'),
  },
  closeicon: {
    width: 25,
    height: 25,
  },
  closeiconinfo: {
    width: 30,
    height: 30,
    marginLeft: wp('4%'),
    marginTop: hp('4%'),
    alignSelf: 'flex-start',
    zIndex: 9999,
  },
  requirement: {
    textAlign: 'center',
    fontSize: 20,
    color: '#edc842',
    fontFamily: 'Montserrat-SemiBold',
  },
  tutorial: {
    alignSelf: 'center',
    width: wp('80%'),
    height: hp('18%'),
    backgroundColor: 'white',
    opacity: 0.95,
    borderRadius: 12,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.12,

    elevation: 5,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: hp('8%'),
  },
  tutorial1: {
    alignSelf: 'center',
    width: wp('80%'),
    height: hp('18%'),
    backgroundColor: 'white',
    opacity: 0.95,
    borderRadius: 12,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.12,

    elevation: 5,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: hp('4%'),
  },

  textcontainer: {
    marginTop: hp('3%'),
    marginHorizontal: wp('6%'),
  },
  notecontainer: {
    marginTop: hp('2%'),
    marginHorizontal: wp('10%'),
  },
  textcontainer1: {
    marginTop: hp('1.6%'),
    marginHorizontal: wp('10%'),
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
  },
  poptext: {
    color: '#353535',
    fontSize: 20,
    top: 5,
    fontFamily: 'Montserrat-Medium',
  },
  texttitle: {
    color: '#AA0000',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    marginBottom: hp('1%'),
  },
  boxcontainer: {
    backgroundColor: '#F2F2F2',
    width: wp('87%'),
    height: hp('16%'),
    marginHorizontal: wp('6%'),
    marginTop: hp('1%'),
    borderRadius: 10,
  },
  uploadbuttoncontainer: {
    backgroundColor: '#353535',
    width: wp('18%'),
    height: hp('5%'),
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
  },
  deletebuttoncontainer: {
    backgroundColor: '#353535',
    width: wp('18%'),
    height: hp('5%'),
    alignSelf: 'flex-end',
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
  },
  submitcontainer: {
    backgroundColor: '#121212',
    width: wp('45%'),
    height: hp('6%'),
    borderWidth: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('5%'),
    alignSelf: 'center',
  },
  uploadimagecontainer: {
    flex: 1,
    top: hp('7%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1%'),
  },
  uploadimage: {
    width: 110,
    height: 110,
    alignContent: 'center',
    justifyContent: 'center',
  },
  modalcontainer: {
    justifyContent: 'center',
    marginVertical: hp('0%'),
    marginHorizontal: wp('0%'),
  },
  modalcontainerinfo: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.12,

    elevation: 5,
  },
  modalheader: {
    height: 80,
    top: 0,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    justifyContent: 'center',
    backgroundColor: '#353535',
  },
  circleContainer: {
    width: 35,
    height: 35,
    borderRadius: 50,

    color: '#fff',
    backgroundColor: '#FFA700',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginRight: wp('4%'),
  },
  redcircleContainer: {
    width: 13,
    height: 13,
    borderRadius: 50,
    fontSize: 20,
    color: '#fff',
    backgroundColor: '#AA0000',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginRight: wp('2%'),
  },
  bluecircleContainer: {
    width: 13,
    height: 13,
    borderRadius: 50,
    fontSize: 20,
    color: '#fff',
    backgroundColor: '#353535',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginRight: wp('2%'),
  },
  featurestextcontainer: {
    marginHorizontal: wp('4%'),
    flexDirection: 'row',
    marginTop: hp('3.2%'),
  },
  subfeaturestextcontainer: {
    marginHorizontal: wp('10%'),
    flexDirection: 'row',
    marginTop: hp('1.8%'),
  },
  subfeaturestextcontainer1: {
    marginHorizontal: wp('16%'),
    flexDirection: 'row',
    marginTop: hp('1.8%'),
  },
  modalbody: {
    marginTop: hp('4%'),
  },
});
