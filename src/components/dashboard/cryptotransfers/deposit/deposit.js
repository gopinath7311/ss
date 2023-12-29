import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Share,
  Keyboard,
  Dimensions,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import DropDownPicker from 'react-native-dropdown-picker';
import Clipboard from '@react-native-community/clipboard';
import {Header, Icon, Badge, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import {showToast} from '../../../../services/toastService';
import Toast from 'react-native-toast-message';
import {backEndCallObj} from '../../../../services/allService';
import LinearGradient from 'react-native-linear-gradient';

const usdt = require('../../../../assests/images/usdt1.png');
const usdc = require('../../../../assests/images/cicon1.png');
const busd = require('../../../../assests/images/busd.png');

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
  amount: Joi.number()
    .required()
    .error(() => {
      return {
        message: 'Please Enter Amount',
      };
    }),
});

class Deposit extends Component {
  state = {
    cointypes: [],
    coinname: '',
    amount: '',
    errors: '',
    selectcoin: {},
    isModalVisible: false,
    modaldata: {},
    popup: false,
    resp: {},
    accepted_coins:[]
  };

  componentDidMount = async () => {
    this.getAcceptedCoins()    
  };

  wsamount = async amount => {
    if (amount[0] == 0) {
      showToast('error', "Don't Enter space & '0' before Amount.");
      await this.setState({amount: ''});
    } else {
      await this.setState({amount: amount});
      await this.setState({buttonDisabled: false});
      let na = amount.replace(
        /[`~!@#$%^&*()_|+\-=?;:'",<>×÷⋅°π©℗®™√€£¥¢✓N•△¶∆\{\}\[\]\\\/]/gi,
        '',
      );
      const reppo = na.replace(' ', '');
      await this.setState({amount: reppo});
    }
  };

  regionsel = async item => {
    await this.setState({
      coinname: item?.value,
    });
    var mappp = this?.props?.gettaxes?.coins.filter(
      k => k?.ticker === this.state.coinname,
    )[0];
    await this.setState({selectcoin: mappp});
  };

  toggleModal = async () => {
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
      // coinname: '',
      amount: '',
      popup: false,
    });
  };

  _ondeposit = async () => {
    this.loadingButton.showLoading(true);
    const {coinname, amount, selectcoin} = this.state;
    const min = selectcoin?.deposit ? selectcoin?.deposit?.deposit_min : 10;
    const max = selectcoin?.deposit ? selectcoin?.deposit?.deposit_max : 5000;
    Keyboard.dismiss();
    let val = '';
    const validata = Joi.validate(
      {coinname, amount},
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
    } else if (parseFloat(amount) < parseFloat(min)) {
      showToast('error', 'Minimum Deposit Amount Is ' + min);
      this.loadingButton.showLoading(false);
    } else if (parseFloat(amount) > parseFloat(max)) {
      showToast('error', 'Maximum Deposit Amount Is ' + max);
      this.loadingButton.showLoading(false);
    } else {
      try {
        const obj = {
          coinname: coinname,
          amount: amount,
        };
        await this.setState({
          isModalVisible: !this.state.isModalVisible,
          modaldata: obj,
        });
        this.loadingButton.showLoading(false);
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          await this.setState({errors: ex.response.data});
          showToast('error', this.state.errors);
          this.loadingButton.showLoading(false);
        }
      }
    }
  };

  onconfirm = async () => {
    this.loadingButtonn.showLoading(true);
    var coinsid = this?.props?.gettaxes?.coins?.filter(
      k => k?.ticker === this?.state?.coinname,
    )[0];

    try {
      const obj = {
        coin_name: this?.state?.coinname,
        amount: this?.state?.amount,
        coin_id: coinsid?.coin_id,
      };
      const res = await backEndCallObj('/payments/deposit', obj);
      if (res) {
        await this.setState({
          popup: true,
          resp: res,
        });
        this.loadingButtonn.showLoading(false);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        await this.setState({errors: ex.response.data});
        showToast('error', this.state.errors);
        this.loadingButtonn.showLoading(false);
      }
    }
  };

  Copy = async () => {
    await Clipboard.setString(this?.state?.resp?.pay_address);
    showToast('success', 'Address Copied Successfully');
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message: `${this?.state?.coinname} Address: ${this?.state?.resp?.pay_address}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  selectCoin = name => {
    this.setState({
      coinname: name,

    });
  };
  setOpen = () => {
    this.setState({open: !this.state.open});
  };
  
 onSelect=(data)=>{
  this.setState({coinname:data.label,open:false})
 }

 getAcceptedCoins=()=>{
  const coins = this?.props?.gettaxes?.coins;

    var tickers = coins?.map(k => k?.ticker);
    var ticarr = [];
    tickers?.forEach(e => {
      var fr = {
        label: e,
        value: e,
        icon:() => (
          <Image
            source={e=="USDT"?usdt:e=='USDC'?usdc:busd}
            style={styles.image}
          />
        ),
      };

     ticarr.push(fr);
this.setState({accepted_coins:ticarr})

    });
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
     
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#133225', '#0d281c', '#07160f', 'black']}
        style={{flex: 1}}>
        <Toast />
        <View style={{top: hp('10%')}}>
          <View style={{marginHorizontal: wp('5%')}}>
            <Text style={styles.selectCointext}>Select Coin</Text>
            <DropDownPicker
              items={this.state.accepted_coins}
              dropDownContainerStyle={styles.dropDownCont}
              style={styles.maindropDownCon}
              placeholderStyle={{color: '#a9efdb',left:25}}
              value={this.state.coinname}
              setOpen={this.setOpen}
             placeholder={'--select--'}
              open={this.state.open}
              listItemLabelStyle={{color:"#fff",}}
              TickIconComponent={(style)=>(<Icon name='check' type='Entypo' color={'#fff'}/>)}
              showTickIcon={true}
              tickIconStyle={{width:20,height:20,color:"#fff"}}
              onSelectItem={data=>this.onSelect(data)}
             selectedItemContainerStyle={{backgroundColor:"#00271a"}}
           labelStyle={{color:"#a9efdb"}}
             multiple={false}
             ArrowDownIconComponent={()=>(<Icon name='arrow-drop-down' type='FontAwesome' color={'#a9efdb'}/>)}
             ArrowUpIconComponent={()=>(<Icon name='arrow-drop-up' type='FontAwesome' color={'#a9efdb'}/>)}
   
             />
            <View style={styles.ButtonWrapper}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={wp('45%')}
                height={hp('6%')}
                backgroundColor="#00dba6"
                justifyContent="center"
                alignItems="center"
                borderRadius={10}
                titleFontFamily="Montserrat-SemiBold"
                title="DEPOSIT NOW"
                titleFontSize={hp('2.3%')}
                titleColor="black"
                onPress={this._ondeposit.bind(this)}
              />
            </View>
            <View style={{alignSelf: 'center', flexDirection: 'row', top: 20}}>
              <Icon
                name="info-outline"
                type="AntDesign"
                color={'#cacac5'}
                size={17}
              />

              <Text
                style={{
                  color: '#cacac5',
                  fontSize: 13,
                }}>
                Deposit -{' '}
                <Text style={{fontFamily: 'Montserrat-ExtraBold'}}>
                  {this.state.coinname ? this.state.coinname : null}
                </Text>
                - Min -{' '}
                <Text style={{fontFamily: 'Montserrat-ExtraBold'}}>
                  {this?.state?.selectcoin?.deposit
                    ? this?.state?.selectcoin?.deposit?.deposit_min
                    : '0'}
                  ,
                </Text>{' '}
                Max -{' '}
                <Text style={{fontFamily: 'Montserrat-ExtraBold'}}>
                  {this?.state?.selectcoin?.deposit
                    ? this?.state?.selectcoin?.deposit?.deposit_max
                    : '0'}
                  ,
                </Text>{' '}
                Fee -{' '}
                <Text style={{fontFamily: 'Montserrat-ExtraBold'}}>
                  {this?.state?.selectcoin?.deposit
                    ? this?.state?.selectcoin?.deposit?.deposit_fee
                    : '0'}{' '}
                </Text>
                {this?.state?.selectcoin?.deposit
                  ? this?.state?.selectcoin?.deposit?.deposit_fee_type ===
                    'percent'
                    ? '%'
                    : '/-'
                  : '%'}
              </Text>
            </View>
          </View>
        </View>
        <Modal
          transparent={true}
          animationType="fade"
          style={styles.modalcontainer}
          isVisible={this.state.isModalVisible}>
          <View style={{zIndex: 1, top: -100}}>
            <Toast />
          </View>
          <View style={styles.transparentBackground}>
            <View style={styles.MoreDetailsContainer}>
              <View style={styles.TitleContainer}>
                <View style={styles.leftContainer} />
                <Text style={styles.Title}>
                  {this.state.popup
                    ? `${this.state.coinname} Deposit`
                    : 'Confirm Deposit'}
                </Text>
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
                {!this.state.popup ? (
                  <View style={{marginHorizontal: wp('5%')}}>
                    <View style={styles.stakebox}>
                      <Text style={styles.stkhead}>From</Text>
                      <Text style={styles.stkbody}>
                        : {this.state.coinname} Wallet
                      </Text>
                    </View>
                    <View style={styles.stakebox}>
                      <Text style={styles.stkhead}>Transaction Type</Text>
                      <Text style={styles.stkbody}>: New stake</Text>
                    </View>
                    <View style={styles.stakebox}>
                      <Text style={styles.stkhead}>Amount</Text>
                      <Text style={styles.stkbody}>: {this.state.amount}</Text>
                    </View>

                    <LinearGradient
                      start={{x: 0, y: 0}}
                      end={{x: 0, y: 1}}
                      colors={['#133225', '#0d281c', '#07160f', 'black']}
                      style={{
                        width: wp('40%'),
                        height: hp('5.4%'),
                        borderWidth: 3,
                        backgroundColor: '#090932',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <AnimateLoadingButton
                        ref={c => (this.loadingButtonn = c)}
                        borderRadius={10}
                        titleFontFamily="Montserrat-SemiBold"
                        title="CONFIRM"
                        titleFontSize={hp('2.3%')}
                        titleColor="white"
                        onPress={this.onconfirm.bind(this)}
                      />
                    </LinearGradient>
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        alignItems: 'center',
                        marginVertical: hp('2%'),
                        marginHorizontal: wp('5%'),
                      }}>
                      <QRCode
                        size={150}
                        codeStyle="square"
                        outerEyeStyle="square"
                        innerEyeStyle="square"
                        getRef={c => (this.qrcode = c)}
                        value={this?.state?.resp?.pay_address}
                        content={this?.state?.resp?.pay_address}
                        color={'#353535'}
                        linearGradient={['rgb(0,21,99)', 'rgb(0,255,255)']}
                        ecl="H"
                      />

                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          marginVertical: hp('1%'),
                        }}>
                        To Pay Send Exactly&nbsp;
                        <Text
                          style={{
                            color: 'green',
                            fontFamily: 'Montserrat-Bold',
                            textTransform: 'uppercase',
                          }}>
                          {this?.state?.resp?.pay_amount}{' '}
                          {this?.state?.resp?.pay_currency}
                        </Text>{' '}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: 'Montserrat-SemiBold',
                          marginVertical: hp('1%'),
                          borderWidth: 1,
                          borderColor: 'green',
                          borderRadius: 5,
                          color: 'green',
                          paddingHorizontal: wp('1%'),
                          paddingVertical: hp('0.3%'),
                        }}>
                        {this?.state?.resp?.pay_address}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          color: 'gray',
                          marginVertical: hp('1%'),
                        }}>
                        NetWork : {this?.state?.resp?.network}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11.3,
                          fontFamily: 'Montserrat-SemiBold',
                          marginVertical: hp('1%'),
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        Send Only {this?.state?.coinname} To This Deposit
                        Address, We Can't Recover Funds If You Transfer From
                        Cross Chains.
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: wp('8%'),
                        marginBottom: hp('3%'),
                      }}>
                      <TouchableOpacity
                        onPress={() => this.Copy()}
                        style={{
                          width: wp('30%'),
                          height: hp('5%'),
                          backgroundColor: '#090932',
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            color: '#fff',
                            textTransform: 'uppercase',
                          }}>
                          Copy 🔗
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.onShare()}
                        style={{
                          width: wp('30%'),
                          height: hp('5%'),
                          backgroundColor: '#090932',
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            color: '#fff',
                            textTransform: 'uppercase',
                          }}>
                          Share ➤
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
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
export default connect(mapStateToProps)(Deposit);

const styles = StyleSheet.create({
  sidecont: {
    flexDirection: 'row',
    borderRadius: 10,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    width: wp('70%'),
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
    borderColor: '#006622',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  sideconts: {
    flex: 15,
    width: wp('10%'),
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#006622',
  },
  ButtonWrapper: {
    flexDirection: 'row',
    marginTop: hp('5%'),
    alignSelf: 'center',
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
  stakebox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  stkhead: {
    fontFamily: 'Montserrat-SemiBold',
    width: wp('40%'),
  },
  stkbody: {fontFamily: 'Montserrat-SemiBold'},
  selectCointext: {
    alignSelf: 'center',
    color: '#bacbc7',
    fontFamily: 'Poppins-SemiBold',
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
    alignItems: 'center',
    zIndex:500,
    
  },
  image: {
    width: 25,
    height: 25,
  },
});
