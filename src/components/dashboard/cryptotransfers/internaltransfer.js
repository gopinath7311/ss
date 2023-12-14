import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions,
  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dropdown} from 'react-native-element-dropdown';
import {Header, Icon, Badge, Button} from 'react-native-elements';
import NumberFormat from 'react-number-format';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountdownCircle from 'react-native-countdown-circle';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {showToast} from '../../../services/toastService';
import Toast from 'react-native-toast-message';
import {backEndCallObj} from '../../../services/allService';
import allactions from '../../../redux/actions/allactions';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
const local_data = [
  {
    label: 'USDT',
    value: '1',
    icon: () => (
      <Image
        source={require('../../../assests/images/usdt1.png')}
        style={styles.image}
      />
    ),
  },
  {
    label: 'USDC',
    value: '2',
    icon: () => (
      <Image
        source={require('../../../assests/images/cicon1.png')}
        style={styles.image}
      />
    ),
  },
  {
    label: 'BUSD',
    value: '3',
    icon: () => (
      <Image
        source={require('../../../assests/images/busd.png')}
        style={styles.image}
      />
    ),
  },
];
const usdt = require('../../../assests/images/usdt1.png');
const usdc = require('../../../assests/images/cicon1.png');
const busd = require('../../../assests/images/busd.png');

const Joi = require('joi-browser');
const {width, height} = Dimensions.get('window');

const schema = Joi.object().keys({
  coinname: Joi.string()
    .required()
    .error(() => {
      return {
        message: 'Please Select Coin Type',
      };
    }),
  raddress: Joi.string()
    .min(5)
    .max(25)
    .error(() => {
      return {
        message: 'Please Enter Valid Username/Email',
      };
    })
    .required()
    .trim(true),
  amount: Joi.number()
    // .min(10)
    // .max(1000)
    .required()
    .error(() => {
      return {
        message: 'Please Enter Valid Amount',
      };
    }),
});

const cschema = Joi.object().keys({
  code: Joi.string()
    .min(6)
    .required()
    .error(() => {
      return {
        message: 'Please Enter Valid OTP',
      };
    }),
});

class InternalTransfer extends Component {
  state = {
    cointypes: [],
    coinname: 'USDT',
    raddress: '',
    amount: '',
    errors: '',
    selectcoin: {},
    isModalVisible: false,
    otpbutton: true,
    shownewcodee: false,
    buttonDisabled: true,
    code: '',
    tfacode: '',
    modalVisible: false,
  };

  async componentDidMount() {
    const gettax = this?.props?.gettaxes;
    const coins = this?.props?.gettaxes?.coins;
    var tickers = coins?.map(k => k?.ticker);
    var ticarr = [];
    tickers?.forEach(e => {
      var fr = {label: e, value: e};
      ticarr?.push(fr);
    });
    await this.setState({cointypes: ticarr});
  }

  async _finishCountt() {
    await this.setState({shownewcodee: true});
  }

  newcodee = async () => {
    const prfil = this?.props?.getprofil;
    try {
      const data = await backEndCallObj('/user/send_otp', {
        user_email: prfil?.user_email,
        otp_type: 'internal_transfer',
      });
      showToast('success', data.success);
      if (data.success) {
        await this.setState({shownewcodee: false});
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

  _updatestetfa = async tfacode => {
    await this.setState({tfacode});
    if (this.state.tfacode.length > 3) {
      await this.setState({buttonDisabled: false});
    }
  };

  wsraddress = async raddress => {
    if (raddress.length <= 25) {
      if (raddress[0] == ' ') {
        showToast('error', "Don't Enter space before name/Email.");
        await this.setState({raddress: ''});
      } else {
        await this.setState({raddress: raddress});

        let na = raddress.replace(
          /[`~!#$₹₱%^&*()_|+\-=?;:'",<>×÷⋅°π©℗®™√€£¥¢℅؋ƒ₼$៛¿¡ ¦¬§₡✓•△¶∆\{\}\[\]\\\/]/gi,
          '',
        );
        const reppo = na.replace(' ', '');
        await this.setState({raddress: reppo});
      }
    } else {
    }
  };

  wsamount = async amount => {
    if (amount[0] == ' ') {
      showToast('error', "Don't Enter space & '0' before Amount.");
      await this.setState({amount: ''});
    } else {
      await this.setState({amount: amount});
      let na = amount.replace(
        /[`~!@#$%^&*()_|+\-=?;:'",<>×÷⋅°π©℗®™√€£¥¢✓N•△¶∆\{\}\[\]\\\/]/gi,
        '',
      );
      const reppo = na.replace(' ', '');
      await this.setState({amount: reppo});
    }
  };

  coinsel = async item => {
    await this.setState({
      coinname: item?.value,
    });
    var mappp = this?.props?.gettaxes?.coins?.filter(
      k => k?.ticker === this?.state?.coinname,
    )[0];
    await this.setState({selectcoin: mappp});
  };

  _onPresslogin = async () => {
    this.loadingButton.showLoading(true);
    const {coinname, raddress, amount, selectcoin} = this.state;
    const min = this?.props?.gettaxes?.internal_transfer
      ? this?.props?.gettaxes?.internal_transfer?.internal_transfer_min
      : 0.01;
    const max = this?.props?.gettaxes?.internal_transfer
      ? this?.props?.gettaxes?.internal_transfer?.internal_transfer_max
      : 10000;
    Keyboard.dismiss();
    let val = '';
    const validata = Joi.validate(
      {coinname, raddress, amount},
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
    } else if (
      this?.state?.raddress.toLowerCase() === this?.props?.getprofil?.user_name
    ) {
      showToast('error', "You Can't Transfer To Own Account");
      this.loadingButton.showLoading(false);
    } else if (
      this?.state?.raddress.toLowerCase() === this?.props?.getprofil?.user_email
    ) {
      showToast('error', "You Can't Transfer To Own Account");
      this.loadingButton.showLoading(false);
    } else if (parseFloat(amount) < parseFloat(min)) {
      showToast('error', 'Minimum Internal_transfer Amount Is ' + min);
      this.loadingButton.showLoading(false);
    } else if (parseFloat(amount) > parseFloat(max)) {
      showToast('error', 'Maximum Internal_transfer Amount Is ' + max);
      this.loadingButton.showLoading(false);
    } else {
      try {
        const kk = {
          user: this.state.raddress,
        };
        const res = await backEndCallObj('/payments/check_user', kk);
        if (res?.success) {
          const obj = {
            user_email: this.props?.getprofil?.user_email,
            otp_type: 'internal_transfer',
          };
          const data = await backEndCallObj('/user/send_otp', obj);
          if (data.success) {
            this.loadingButton.showLoading(false);
            await this.setState({isModalVisible: true});
            showToast('success', data.success);
          }
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          await this.setState({errors: ex.response.data});
          showToast('error', this.state.errors);
          this.loadingButton.showLoading(false);
        }
      }
    }
  };

  toggleModal = async () => {
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
      amount: '',
      raddress: '',
      code: '',
      tfacode: '',
    });
  };

  onsubmit = async () => {
    this.loadingButtonn.showLoading(true);
    // await this.setState({otpbutton: !this.state.otpbutton});
    await this.setState({buttonDisabled: !this.state.buttonDisabled});
    const {code, tfacode, selectcoin, coinname, amount, raddress} = this.state;
    const validata = Joi.validate(
      {code: this.state.code},
      cschema,
      function (err, value) {
        if (!err) return null;
        const reter = err.details[0].message;
        return reter;
      },
    );
    if (!!validata) {
      this.loadingButtonn.showLoading(false);
      await this.setState({errors: validata});
      showToast('error', this.state.errors);
      setTimeout(async () => {
        await this.setState({errors: null});
        await this.setState({
          otpbutton: !this.state.otpbutton,
          buttonDisabled: !this.state.buttonDisabled,
        });
      }, 2000);
    } else if (
      this?.props?.getprofil &&
      this?.props?.getprofil?.TWO_FA_status === 'Enable' &&
      !this.state.tfacode
    ) {
      showToast('error', 'Please Enter Valid 2FA Code');
      this.loadingButtonn.showLoading(false);
    } else {
      try {
        const obj = {
          coin_id: selectcoin?.coin_id,
          coin_name: coinname,
          to_userid: raddress,
          amount: amount,
          otp: code,
          two_fa_code:
            this?.props?.getprofil?.TWO_FA_status === 'Disable'
              ? '333'
              : tfacode,
        };
        console.log(obj, 'cnobjm');
        const res = await backEndCallObj('/payments/internal_transfer', obj);
        if (res?.success) {
          showToast('success', res?.success);
          await allactions();
          setTimeout(async () => {
            await this.setState({
              isModalVisible: false,
              amount: '',
              raddress: '',
              code: '',
              tfacode: '',
            });
            this.loadingButtonn.showLoading(false);
          }, 2000);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          this.loadingButtonn.showLoading(false);
          await this.setState({errors: ex.response.data});
          showToast('error', this.state.errors);
          setTimeout(async () => {
            await this.setState({errors: null});
            await this.setState({
              otpbutton: !this.state.otpbutton,
              buttonDisabled: !this.state.buttonDisabled,
            });
          }, 2000);
        }
      }
    }
  };
  selectCoinModal =  () => {
     this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };
  selectCoin =  name => {
     this.setState({
      coinname: name,
      modalVisible: !this.state.modalVisible,
    });
  };
  setOpen = () => {
    this.setState({open: !this.state.open});
  };
  setItems = e => {
    console.log(e, 'setItems');
    this.setState({singleValue: e});
  };
 onSelect=(data)=>{
  this.setState({coinname:data.label,open:false})
 }
 setCoin=(item)=>{
console.log(item,"item")
 }
  render() {
    const clogo =
      this.state.coinname && this.state.coinname.length > 0
        ? this.state.coinname === 'USDT'
          ? usdt
          : this.state.coinname === 'USDC'
          ? usdc
          : busd
        : null;

    const intrnltaxs = this?.props?.gettaxes?.internal_transfer;

    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#133225', '#0d281c', '#07160f', 'black']}
        style={{flex: 1}}>
       
          <View style={styles.toastCont}>
            <Toast />
          </View>
          <View style={{marginHorizontal: wp('5%'), marginVertical: hp('4%')}}>
            <View>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: '#bacbc1',
                marginVertical: hp('1%'),
              }}>
              Select Coin
            </Text>
            <View style={styles.maindropDownCon}>
<Image source={clogo} style={[styles.image,{marginLeft:3}]}/>
            <DropDownPicker
              items={local_data}
              //placeholder={this.state.coinname?this.state.coinname:"Please select coin"}
              dropDownContainerStyle={styles.dropDownCont}
              style={styles.dropdown}
              placeholderStyle={{color: '#a9efdb',}}
              value={this.state.coinname}
              setOpen={this.setOpen}
              activeLabelStyle={{color: 'red'}}
              selectedItemLabelStyle={{color: 'red'}}
             placeholder={this.state.coinname?this.state.coinname:"select"}
              //setValue={value=>console.log(value.value)}
              open={this.state.open}
              listItemLabelStyle={{color:"#fff",}}
              TickIconComponent={()=>(<Icon name='check' type='Entypo' color={'#fff'}/>)}
              showTickIcon={true}
              tickIconStyle={{width:20,height:20,color:"#fff"}}
              onSelectItem={data=>this.onSelect(data)}
             selectedItemContainerStyle={{backgroundColor:"green"}}
           labelStyle={{color:"#a9efdb"}}
             multiple={false}
             ArrowDownIconComponent={()=>(<Icon name='arrow-drop-down' type='FontAwesome' color={'#fff'}/>)}
             ArrowUpIconComponent={()=>(<Icon name='arrow-drop-up' type='FontAwesome' color={'#fff'}/>)}
          
             />

            </View>
            
            </View>
           
           

            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: '#bacbc7',
                marginVertical: hp('1%'),
                fontSize: 13.5,
              }}>
              Username / Email
            </Text>
            {/* ${this.state.coinname} */}
            <View style={styles.sidecont}>
              <TextInput
                style={styles.inputStyle}
                placeholder={`Receiver Username / Email`}
                maxLength={25}
                placeholderTextColor={'#50826e'}
                returnKeyType="done"
                onChangeText={raddress => this.wsraddress(raddress)}
                value={this.state.raddress}
              />
              <View style={styles.sideconts}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  source={clogo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: '#bacbc7',
                marginVertical: hp('1%'),
              }}>
              {this.state.coinname} Amount
            </Text>
            <View style={styles.sidecont}>
              <TextInput
                style={styles.inputStyle}
                placeholder={`Enter ${this.state.coinname} Amount`}
                // maxLength={15}
                placeholderTextColor={'#50826e'}
                returnKeyType="done"
                keyboardType="decimal-pad"
                onChangeText={amount => this.wsamount(amount)}
                value={this.state.amount}
              />
              <View style={styles.sideconts}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  source={clogo}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', alignSelf: 'center', top: 10}}>
              <Icon
                name="info-outline"
                type="AntDesign"
                color={'white'}
                size={17}
              />
              <Text
                style={{
                  color: '#c2f0c2',
                  fontSize: 13,
                }}>
                Deposit -{' '}
                <Text style={{fontFamily: 'Montserrat-ExtraBold'}}>
                  {this?.state?.selectcoin?.ticker
                    ? this?.state?.selectcoin?.ticker
                    : null}
                </Text>
                {this.state.coinname} - Min -{' '}
                <Text style={{fontFamily: 'Montserrat-ExtraBold'}}>
                  {intrnltaxs ? intrnltaxs?.internal_transfer_min : '25'},
                </Text>{' '}
                Max -{' '}
                <Text style={{fontFamily: 'Montserrat-ExtraBold'}}>
                  {intrnltaxs ? intrnltaxs?.internal_transfer_max : '10000'},
                </Text>{' '}
                Fee-
                <Text style={{fontFamily: 'Montserrat-ExtraBold'}}>
                  {intrnltaxs ? intrnltaxs?.internal_transfer_fee : '0.5'}
                </Text>
                {intrnltaxs
                  ? intrnltaxs?.internal_transfer_fee_type === 'percent'
                    ? '%'
                    : '/-'
                  : '%'}
              </Text>
            </View>
            <View style={styles.ButtonWrapper}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={wp('40%')}
                height={hp('7%')}
                backgroundColor="#63d35a"
                justifyContent="center"
                alignItems="center"
                borderRadius={10}
                titleFontFamily="Montserrat-SemiBold"
                title="SUBMIT"
                titleFontSize={hp('2.3%')}
                titleColor="white"
                onPress={this._onPresslogin.bind(this)}
              />
            </View>
          </View>
       
        <Modal
          transparent={true}
          animationType="fade"
          style={styles.modalcontainer}
          isVisible={this.state.isModalVisible}>
          <View style={{zIndex: 1, top: -130}}>
            <Toast />
          </View>
          <View style={styles.transparentBackground}>
            <View style={styles.MoreDetailsContainer}>
              <View style={styles.TitleContainer}>
                <View style={styles.leftContainer} />
                <Text style={styles.Title}>Confirm OTP</Text>
                <View style={styles.rightContainer}>
                  <Icon
                    name="close"
                    size={hp('4%')}
                    color="white"
                    onPress={() => this.toggleModal()}
                  />
                </View>
              </View>

              <View style={styles.Details}>
                <View
                  style={{
                    marginHorizontal: wp('5%'),
                  }}>
                  <Text style={[styles.text, {color: 'gray'}]}>
                    A one time 6-digit code has been send to your Email &nbsp;
                    {'   '}
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Montserrat-SemiBold',
                        color: '#090932',
                      }}>
                      {this.props?.getprofil?.user_email}
                    </Text>
                  </Text>
                  <Text style={styles.title}>Enter 6 digit OTP</Text>

                  <OTPInputView
                    style={{width: '100%', height: 50, color: '#fff'}}
                    pinCount={6}
                    autoFocusOnLoad={false}
                    codeInputFieldStyle={{color: '#090932'}}
                    codeInputHighlightStyle={{borderColor: '#090932'}}
                    selectionColor={'#090932'}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    onCodeChanged={code => {
                      this._updateste(code);
                    }}
                  />

                  {this.state.shownewcodee ? (
                    <TouchableOpacity onPress={() => this.newcodee()}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: hp('1.8%'),
                          marginTop: hp('1.3%'),
                          color: '#353535',
                          alignSelf: 'center',
                        }}>
                        Didn't receive the otpdfg?{'  '}
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
                          marginRight: 8,
                          color: '#353535',
                        }}>
                        Code Expires in
                      </Text>
                      <CountdownCircle
                        seconds={120}
                        radius={14}
                        borderWidth={3}
                        color="#090932"
                        bgColor="#fff"
                        textStyle={{fontSize: 11, color: '#090932'}}
                        onTimeElapsed={() => this._finishCountt()}
                      />
                    </View>
                  )}

                  {this?.props?.getprofil &&
                  this?.props?.getprofil?.TWO_FA_status === 'Disable' ? null : (
                    <View>
                      <Text style={[styles.text, {color: 'gray'}]}>
                        Enter 6-digit 2FA Code Genarated In Google Authenticator
                      </Text>
                      <Text style={styles.title}>Enter 2FA</Text>
                      <OTPInputView
                        style={{width: '100%', height: 50, color: '#fff'}}
                        pinCount={6}
                        autoFocusOnLoad={false}
                        codeInputFieldStyle={{color: '#090932'}}
                        codeInputHighlightStyle={{borderColor: '#090932'}}
                        selectionColor={'#090932'}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        onCodeChanged={tfacode => {
                          this._updatestetfa(tfacode);
                        }}
                      />
                    </View>
                  )}
                </View>

                <View
                  style={[styles.buttoncontainer, {marginVertical: hp('2%')}]}>
                  <AnimateLoadingButton
                    ref={c => (this.loadingButtonn = c)}
                    width={wp('40%')}
                    height={hp('5.4%')}
                    backgroundColor="#090932"
                    justifyContent="center"
                    alignItems="center"
                    buttonDisabled={this.state.buttonDisabled}
                    borderRadius={10}
                    titleFontFamily="Montserrat-SemiBold"
                    title="Confirm"
                    titleFontSize={hp('2%')}
                    titleColor="white"
                    onPress={this.onsubmit.bind(this)}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => {
  return {
    theme: state.theme,
    getprofil: state.getprofil,
    gettaxes: state.gettaxes,
  };
};

export default connect(mapStateToProps)(InternalTransfer);

const styles = StyleSheet.create({
  sidecont: {
    height: hp('5%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: hp('3%'),
  },
  inputStyle: {
    flex: 85,
    height: hp('7%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: wp('3%'),
    color: 'white',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 1,
    borderColor: '#00e859',
    borderRightWidth: 0,
    backgroundColor: '#00311d',
  },
  sideconts: {
    width: wp('10%'),
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#00e859',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#00311d',
  },
  ButtonWrapper: {
    marginTop: hp('5%'),
    alignSelf: 'center',
  },

  dropdown: {
    width: wp('90%'),
    height: hp('7%'),
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: wp('1%'),
    borderColor: '#00e859',
    backgroundColor: '#00311d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholderStyle: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#50826e',
    left: 20,
  },
  selectedTextStyle: {
    fontSize: hp('1.8%'),
    fontFamily: 'Montserrat-Medium',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
    // left:10
  },
  itemtext: {
    fontSize: 13.5,
  },

  modalcontainer: {
    justifyContent: 'center',
  },
  transparentBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    // backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  MoreDetailsContainer: {
    marginTop: hp('3%'),
    width: wp('95%'),
    borderRadius: wp('2.5%'),
    borderColor: '#090932',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  TitleContainer: {
    backgroundColor: '#090932',
    width: wp('95%'),
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
  Title: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2%'),
    color: 'white',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: wp('2%'),
  },
  Details: {
    backgroundColor: 'white',
  },
  Row: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
  },
  greyText: {
    width: wp('40%'),
    fontFamily: 'Montserrat-Medium',
    fontSize: hp('1.2%'),
    color: '#8D8D8D',
  },
  blackText: {
    width: wp('36%'),
    fontFamily: 'Montserrat-Medium',
    fontSize: hp('1.2%'),
    color: 'black',
  },
  title: {
    marginTop: hp('1%'),
    fontSize: hp('2%'),
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: '#090932',
  },
  newcoderight: {
    marginTop: hp('1%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    marginVertical: hp('1.5%'),
  },

  maindropDownCon:{
    width: wp('90%'),
    height: hp('8%'),
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: wp('1%'),
    borderColor: '#00e859',
    backgroundColor: '#00311d',
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    zIndex:500,
    
  },
  dropDownCont: {
    backgroundColor: '#02311d',
    borderWidth: 0,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    right:30
  },
  dropdown: {
    width: wp('75%'),
    height: hp('3%'),
    borderWidth: 0,

    borderColor: '#00e859',
    backgroundColor: '#00311d',
    flexDirection: 'row',
   
  },
  image: {
    width: 25,
    height: 25,
  },
  toastCont:{
    zIndex:6000
  }
});

