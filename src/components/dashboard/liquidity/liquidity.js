import React, {Component} from 'react';
const arr = [
  {
    term: 'Short',
    percentage: '0.1%',
    aprPer: '36.50',
  },
  {
    term: 'Short',
    percentage: '0.1%',
    aprPer: '36.50',
  },
  {
    term: 'Short',
    percentage: '0.1%',
    aprPer: '36.50',
  },
];

import {
  SafeAreaView,
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import CheckBox from 'react-native-check-box';

import CountDown from 'react-native-countdown-component';
import Toast from 'react-native-toast-message';
import {showToast} from '../../../services/toastService';
const Joi = require('joi-browser');
const usdt = require('../../../assests/images/usdt1.png');
const usdc = require('../../../assests/images/cicon1.png');
const busd = require('../../../assests/images/busd_white.png');
const schema = Joi.object().keys({
  selectedCoin: Joi.string()
    .error(() => {
      return {
        message: 'Please Select Coin',
      };
    })
    .required(),
  amount: Joi.number()
    .min(50)
    .error(() => {
      return {
        message: 'Please Enter Valid Amount',
      };
    })
    .required(),
  isChecked: Joi.boolean()
    .valid(true)
    .error(() => {
      return {
        message: 'Please Accept Terms & Conditions',
      };
    })
    .required(),
  funds: Joi.number()
    .min(50)
    .error(() => {
      return {
        message: 'Insufficient funds...!',
      };
    })
    .required(),
});
class Liquidity extends Component {
  state = {
    isModalVisible: false,
    selectedCoin: null,
    amount: '',
    buttonDisabled: false,
    er: '',
    amountErr: '',
    isChecked: false,
    accepted_coins: [],
    provideLiqbtn: false,
    confirmBtn: false,
    confirmPurModal: false,
    funds: 100,
    selectedTerm:[]
  };

  async componentDidMount() {
    this.getAcceptedCoins();
  }
  toggleModal = async (data) => {
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
      selectedCoin: null,
      selectedTerm:data,
      provideLiqbtn: !this.state.provideLiqbtn,
    });
  };
  onConfirm = async () => {
    const {selectedCoin, amount, isChecked, funds} = this.state;
    this.setState({confirmBtn: true});
    Keyboard.dismiss();

    const validata = Joi.validate(
      {selectedCoin, amount, isChecked, funds},
      schema,
      function (err, value) {
        if (!err) return null;
        const reter = err.details[0];
        val = err.details[0].context.key;
        return reter;
      },
    );
    if (!!validata) {
      await this.setState({errors: validata.message, er: validata.path});
      // showToast('error', this.state.errors);
      if (validata.path == 'isChecked') {
        showToast('error', 'Please Accept The Terms and Conditions');
      } else if (validata.path == 'funds') {
        showToast('error', 'Insufficient Funds...!');
      }
      await this.setState({buttonDisabled: true, confirmBtn: false});
    } else {
      await this.setState({errors: '', er: ''});
      this.setState({isModalVisible: false, confirmPurModal: true});
    }
  };
  selectCoin = coin => {
    this.setState({selectedCoin: coin});
  };
  amount = async amount => {
    if (amount[0] == 0) {
      await this.setState({amount: ''});
      await this.setState({amountErr: 'please enter valid amount'});
    } else if (amount.includes(' ')) {
      this.setState({amountErr: 'spaces are not allowed'});
    } else {
      await this.setState({amount: amount});

      let na = amount.replace(
        /[`~!@#$₹₱%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢℅؋ƒ₼¿¡ ¦¬§$៛₡✓•△¶∆\{\}\[\]\\\/]/gi,
        '',
      );
      const reppo = na.replace(' ', '');
      await this.setState({amount: reppo, amountErr: ''});
    }
  };
  getAcceptedCoins = async () => {
    const coins = this?.props?.gettaxes?.coins;
    const getprofile = this?.props?.getprofil;

    var tickers = coins?.map(k => k?.ticker);
    var ticarr = [];
    tickers?.forEach(e => {
      var fr = {
        lable: e,
        value: e,
        balance:
          e == 'USDT'
            ? getprofile?.balances?.USDT
            : e == 'USDC'
            ? getprofile.balances?.USDC
            : getprofile.balances?.BUSD,
      };

      ticarr.push(fr);
      this.setState({accepted_coins: ticarr});
    });
  };
  onConfirmPurchase = () => [alert('success')];
  render() {
    const {accepted_coins} = this.state;
    //console.log(this.props.gettaxes.contracts,'gettwx')
    return (
      <View style={styles.container}>
        <View
          style={{
            height: hp('8%'),
            backgroundColor: '#00291e',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: wp('2%'),
          }}>
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
          <View style={{marginBottom: 100}}>
            <LinearGradient
              colors={['#101a10', '#40b16bbe']}
              start={{x: 0.2, y: 0.2}}
              end={{x: 1, y: 0.2}}
              // locations={[0, 0.33, 0.64, 1]}
              // locations={[0.10, 0.50, 0.67, 1]}
              style={{
                flex: 1,
                width: wp('90%'),
                alignSelf: 'center',
                marginTop: 10,
                borderRadius: hp('2%'),
              }}>
              {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.promoText}>Early Bird Promo Ends In:</Text>
                <CountDown
                  //size={26}
                  until={2000} 
                  onFinish={() => alert('Finished')}
                  digitStyle={{
                    backgroundColor: '#122113',
                    borderWidth: 1,
                    borderColor: '#a5b712',
                    borderRadius: 10,
                    width: 65,
                    height: 65,
                  }}
                  digitTxtStyle={{color: '#fff', bottom: 10, fontSize: 20}}
                  timeLabelStyle={{
                    color: '#fff',
                    fontFamily: 'Poppins-Medium',
                    top: -30,
                    width: 60,
                    left: 12,
                    fontSize: 14,
                  }}
                  separatorStyle={{color: '#fff', top: -16}}
                  timeToShow={['D', 'H', 'M', 'S']}
                  timeLabels={{d: 'Days', h: 'Hours', m: 'Mins', s: 'Secs'}}
                  showSeparator
                  style={styles.timer}
                />
                <Text style={styles.prelaunchText}>
                  PRE-LAUNCH{' '}
                  <Text style={[styles.prelaunchText, {color: '#fdff00'}]}>
                    SPECIAL
                  </Text>
                </Text>
                <Text style={styles.text}>
                  Get{' '}
                  <Text style={[styles.text, {color: '#fdff00'}]}>
                    1.5X Boost
                  </Text>
                  <Text> On APR For A Limited Time Only. </Text>
                </Text>
              </View> */}
              {/* <Text
                style={[
                  styles.prelaunchText,
                  {fontSize: 30, alignSelf: 'center', top: 10},
                ]}>
                LIQUIDITY {''}
                <Text
                  style={[
                    styles.prelaunchText,
                    {color: '#fdff00', fontSize: 30},
                  ]}>
                  POOLS
                </Text>
              </Text>
             
              <LinearGradient
                colors={['#007600', '#000f00']}
                start={{x: 0.15, y: 0.68}}
                end={{x: 1, y: 0.79}}
                style={styles.gradientShort}>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Text style={styles.prelaunchText}>Short</Text>
                  <Text style={[styles.prelaunchText, {color: '#fdff00'}]}>
                    {' '}
                    Term
                  </Text>
                </View>

                <Text style={[styles.prelaunchText, {color: '#fff'}]}>
                  60 Days
                </Text>
                <View style={styles.boxflex}>
                  <View>
                    <Text style={styles.rewardText}>Daily Rewards</Text>

                    <Text style={styles.rewardPer}>0.15%</Text>
                  </View>
                  <View>
                    <Text style={styles.rewardText}>Generated Apr</Text>

                    <Text style={styles.rewardPer}>54.75%</Text>
                  </View>
                </View>
                <TouchableOpacity
                disabled={this.state.provideLiqbtn}
                  style={styles.btn}
                  onPress={() => this.toggleModal()}>
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 15,
                    }}>
                    Provide Liquidity
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={['#007600', '#000f00']}
                start={{x: 0.15, y: 0.68}}
                end={{x: 1, y: 0.79}}
                style={[
                  styles.gradientShort,
                  {width: wp('90%'), height: hp('40%')},
                ]}>
                <Text style={[styles.prelaunchText, {fontSize: 30}]}>
                  Long {''}
                  <Text
                    style={[
                      styles.prelaunchText,
                      {color: '#fdff00', fontSize: 30},
                    ]}>
                    Term
                  </Text>
                </Text>
                <Text
                  style={[styles.prelaunchText, {color: '#fff', fontSize: 30}]}>
                  300 Days
                </Text>
                <View style={styles.boxflex}>
                  <View>
                    <Text
                      style={[
                        styles.rewardText,
                        {textAlign: 'center', fontSize: 20},
                      ]}>
                      Daily
                    </Text>
                    <Text
                      style={[
                        styles.rewardText,
                        {textAlign: 'center', fontSize: 20, top: -10},
                      ]}>
                      Rewards
                    </Text>

                    <Text style={[styles.rewardPer, {fontSize: 20}]}>
                      0.53%
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.rewardText,
                        {textAlign: 'center', fontSize: 20},
                      ]}>
                      Generated
                    </Text>
                    <Text
                      style={[
                        styles.rewardText,
                        {textAlign: 'center', fontSize: 20, top: -10},
                      ]}>
                      Apr
                    </Text>

                    <Text style={[styles.rewardPer, {fontSize: 20}]}>
                      193.45%
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.btn}>
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 15,
                    }}>
                    Provide Liquidity
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={['#007600', '#000f00']}
                start={{x: 0.15, y: 0.68}}
                end={{x: 1, y: 0.79}}
                style={styles.gradientShort}>
                <Text style={styles.prelaunchText}>
                  Medium {''}
                  <Text style={[styles.prelaunchText, {color: '#fdff00'}]}>
                    Term
                  </Text>
                </Text>
                <Text style={[styles.prelaunchText, {color: '#fff'}]}>
                  120 Days
                </Text>
                <View style={styles.boxflex}>
                  <View>
                    <Text style={styles.rewardText}>Daily Rewards</Text>

                    <Text style={styles.rewardPer}>0.3%</Text>
                  </View>
                  <View>
                    <Text style={styles.rewardText}>Generated Apr</Text>

                    <Text style={styles.rewardPer}>109.50%</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.btnText}>Provide Liquidity</Text>
                </TouchableOpacity>
              </LinearGradient> */}
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  // marginTop: 100,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.text2}>LIQUIDITY</Text>
                  <Text style={[styles.text2, {color: '#fff', left: 5}]}>
                    POOLS
                  </Text>
                </View>
                {this.props?.gettaxes?.contracts.map((data, index) => (
                  <View style={styles.poolBox} key={index}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <View>
                        <View style={{flexDirection: 'row', top: 10}}>
                          <Text
                            style={{
                              color: '#fff',
                              fontFamily: 'Poppins-SemiBold',
                              fontSize: 24,
                              left: 10,
                            }}>
                            {data?.name == 'Short Term'
                              ? 'Short'
                              : data?.name == 'Long Term'
                              ? 'Long'
                              : 'Medium'}
                          </Text>
                          <Text
                            style={{
                              color: '#fdff00',
                              fontFamily: 'Poppins-SemiBold',
                              fontSize: 24,
                              left: 20,
                            }}>
                            Term
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: '#fdff00',
                            textAlign: 'center',
                            top: 5,
                          }}>
                          Daily Rewards
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontFamily: 'Poppins-SemiBold',
                          }}>
                          {data?.interest}
                        </Text>
                      </View>
                      <View style={{top: 20}}>
                        <Text
                          style={{
                            color: '#fdff00',
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 15,
                            left: 25,
                          }}>
                          {data?.days} days
                        </Text>
                        <Text style={{color: '#fdff00'}}>Generated APR</Text>
                        <Text
                          style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontFamily: 'Poppins-SemiBold',
                          }}>
                          {(data?.interest * 365).toFixed(2)} %
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      disabled={this.state.provideLiqbtn}
                      style={[styles.btn, {alignSelf: 'center'}]}
                      onPress={() => this.toggleModal(data)}>
                      <Text style={styles.btnText}>Provide Liquidity</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
        <Modal
          visible={this.state.isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={this.toggleModal}>
          <View style={styles.bottomPopUp}>
            <LinearGradient
              colors={['#1d8659', '#3f777d', '#5c6b9e']}
              start={{x: 0.2, y: 0.2}}
              end={{x: 1, y: 0.2}}
              style={styles.popGradient}>
              <Text style={styles.selctcoint}>Select Coin</Text>
              <ScrollView>
                <View style={{marginBottom: 50}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      marginTop: 30,
                      flexWrap: 'wrap',
                    }}>
                    {accepted_coins.map(data => (
                      <TouchableOpacity
                        style={styles.coinBox}
                        onPress={() => this.selectCoin(data.lable)}>
                        <Image
                          source={
                            data?.lable == 'USDT'
                              ? usdt
                              : data?.lable == 'USDC'
                              ? usdc
                              : busd
                          }
                          style={styles.img}
                        />
                        <Text style={styles.coinText}>{data.lable}</Text>
                        <Text style={styles.BalText}>
                          Balance {data.balance}
                        </Text>
                        {data.lable == this.state.selectedCoin ? (
                          <View
                            style={{position: 'absolute', right: -5, top: -10}}>
                            <Icon
                              name="check-circle"
                              type="AntDesign"
                              color={'white'}
                              size={30}
                            />
                          </View>
                        ) : null}
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Toast />
                  <Text style={styles.errText}>
                    {this.state.er == 'selectedCoin' ? this.state.errors : ''}
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}>
                    Amount
                  </Text>
                  <TextInput
                    style={styles.inputStyle}
                    placeholderTextColor={'#a6caaf'}
                    placeholder="Min 50 to 50000"
                    returnKeyType="done"
                    keyboardType="number-pad"
                    onChangeText={e => this.amount(e)}
                    value={this.state.amount}
                    cursorColor={'white'}
                  />
                  <Text style={styles.errText}>
                    {this.state.er == 'amount'
                      ? this.state.errors
                      : this.state.amountErr
                      ? this.state.amountErr
                      : ''}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <CheckBox
                      onClick={() => {
                        this.setState({
                          isChecked: !this.state.isChecked,
                        });
                      }}
                      isChecked={this.state.isChecked}
                      checkBoxColor={'#fff'}
                      style={{marginLeft: wp('2%')}}
                    />
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        //textAlign: 'center',
                        color: '#fff',
                        width: wp('85%'),
                        textAlignVertical: 'center',
                      }}>
                      Upon creating, interacting, and transacting with an
                      account under this Platform (“Stable Swap”) I hereby and
                      voluntarily agree to be bound by the Terms and Conditions
                      set forth by TopJuan Tech Corporation, a virtual asset
                      custodian entity, supervised by the Bangko Sentral ng
                      Pilipinas (“BSP”) to engage in Virtual Asset Service
                      Provider activities in the Philippines.
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginTop: 10,
                    }}>
                    <TouchableOpacity
                      style={[styles.confirmBx, {right: 30}]}
                      onPress={() => this.onConfirm()}
                      disabled={this.state.confirmBtn}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: '#000',
                          fontSize: 15,
                        }}>
                        Confirm
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.toggleModal()}
                      style={[
                        styles.confirmBx,
                        {width: wp('20%'), right: 20, backgroundColor: '#000'},
                      ]}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: '#fff',
                          fontSize: 15,
                        }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </LinearGradient>
          </View>
        </Modal>
        <Modal
          visible={this.state.confirmPurModal}
          animationType="slide"
          transparent={true}
          onRequestClose={this.toggleModal}>
          <View style={[styles.bottomPopUp]}>
            <LinearGradient
              colors={['#1d8659', '#3f777d', '#5c6b9e']}
              start={{x: 0.2, y: 0.2}}
              end={{x: 1, y: 0.2}}
              style={styles.popGradient}>
              <Text style={styles.selctcoint}>Confirm Purchase</Text>
              <ScrollView>
                <View style={styles.purchaseBox}>
                  <View>
                    <Text style={styles.PurchaseBoxText}>From</Text>
                    <Text style={styles.PurchaseBoxText}>Transaction Type</Text>
                    <Text style={styles.PurchaseBoxText}>Almount</Text>
                    <Text style={styles.PurchaseBoxText}>Daily Rewards</Text>
                  </View>
                  <View>
                    <Text style={[styles.PurchaseBoxText, {color: '#10e549'}]}>
                      USDT Wallet
                    </Text>
                    <Text style={[styles.PurchaseBoxText, {color: '#10e549'}]}>
                      New Liquidity
                    </Text>
                    <Text style={[styles.PurchaseBoxText, {color: '#10e549'}]}>
                      {this.state.amount}
                    </Text>
                    <Text style={[styles.PurchaseBoxText, {color: '#10e549'}]}>
                      0.15%
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    margin: 10,
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.confirmBx,
                      {right: 30, width: wp('40%'), height: hp('5%')},
                    ]}
                    onPress={() => this.onConfirmPurchase()}
                    // disabled={this.state.confirmBtn}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: '#000',
                        fontSize: 15,
                      }}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        confirmPurModal: false,
                        provideLiqbtn: false,
                        confirmBtn:false
                      })
                    }
                    style={[
                      styles.confirmBx,
                      {
                        width: wp('20%'),
                        height: hp('5%'),
                        right: 20,
                        backgroundColor: '#000',
                      },
                    ]}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: '#fff',
                        fontSize: 15,
                      }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </LinearGradient>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    gettaxes: state.gettaxes,
    getprofil: state.getprofil,
  };
};

export default connect(mapStateToProps)(Liquidity);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  timer: {},
  promoText: {
    fontFamily: 'Poppins-Medium',
    color: '#fffff2',
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 20,
  },
  prelaunchText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 23,
    //top:-15,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  gradientShort: {
    width: wp('70%'),
    height: 'auto',
    alignSelf: 'center',
    top: 10,
    borderWidth: 1,
    borderColor: '#fdff00',
    borderRadius: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxflex: {
    width: wp('60%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardText: {
    color: '#fdff00',
    fontFamily: 'Poppins-Medium',
  },
  rewardPer: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  btn: {
    width: wp('50%'),
    height: hp('7%'),
    backgroundColor: '#fdff00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
    borderRadius: hp('4%'),
  },
  text2: {
    fontFamily: 'Poppins-SemiBold',
    color: '#63d35a',
    fontSize: 20,
  },
  poolBox: {
    width: wp('75%'),
    height: hp('22%'),
    backgroundColor: '#011a0f',
    borderColor: '#73b486',
    borderWidth: 0.5,
    borderRadius: hp('2%'),
    marginBottom: 20,
  },
  btnText: {
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  bottomPopUp: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    //borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('100%'),
  },
  popGradient: {
    width: wp('95%'),
    // height: hp('90%'),
    borderRadius: hp('1.5%'),
    borderWidth: 0.5,
    borderLeftColor: '#5c6b9e',
    borderRightColor: '#1d8659',
  },
  selctcoint: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    left: 10,
    top: 10,
  },
  coinBox: {
    width: wp('35%'),
    height: 130,
    backgroundColor: '#112e2b',
    borderRadius: hp('2%'),
    alignItems: 'center',
    marginTop: 10,
  },
  inputStyle: {
    alignSelf: 'center',
    width: wp('80%'),
    height: hp('8%'),
    backgroundColor: '#00311d',
    borderWidth: 1,
    borderColor: '#63d35a',
    borderRadius: hp('2%'),
    color: '#fff',
  },
  confirmBx: {
    width: wp('30%'),
    height: hp('6%'),
    backgroundColor: '#acc736',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp('1%'),
  },
  img: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
    marginTop: 20,
  },
  coinText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 18,
    top: 5,
  },
  BalText: {
    color: '#02f4ed',
    marginTop: 20,
  },
  errText: {
    color: '#fd7e14',
    textAlign: 'center',
    top: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  purchaseBox: {
    width: wp('80%'),
    borderWidth: 0.5,
    borderColor: '#fff',
    alignSelf: 'center',
    margin: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  PurchaseBoxText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    margin: 10,
  },
});
