import React, {Component} from 'react';
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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Input, Button, Icon, CheckBox} from 'react-native-elements';
import {NumericFormat} from 'react-number-format';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {Dropdown} from 'react-native-element-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import Toast from 'react-native-toast-message';
import {showToast} from '../../../services/toastService';
import allactions from '../../../redux/actions/allactions';
import {backEndCallObj} from '../../../services/allService';
import Crypotswap from './tabbar';
const usdt = require('../../../assests/images/usdt1.png');
const usdc = require('../../../assests/images/cicon1.png');
const busd = require('../../../assests/images/busd_white.png');
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
    // .min(10)
    // .max(1000)
    .required()
    .error(() => {
      return {
        message: 'Please Enter Valid Amount',
      };
    }),
});

class HomeScreen extends Component {
  state = {
    refreshing: false,
    openstacke: false,
    selectedCardIndex: 0,
    animatedValue: new Animated.Value(0),
    contracts: [],
    tickr: [],
    isModalVisible: false,
    modaldata: {},
    cointypes: [],
    coinname: '',
    amount: '',
    errors: '',
    popup: false,
    stkbtn: false,
  };

  async componentDidMount() {
    // if (this.props?.gettaxes) {
    // } else {
    //   await allactions();
    // }
    // await allactions();
    setTimeout(async () => {
      const ticker = this.props?.gettaxes?.coins;
      const coins = this.props?.gettaxes?.contracts;
      await this.setState({contracts: coins, tickr: ticker});
      // const coinss = this.props?.gettaxes?.coins;
      // var tickers = coinss.map(k => k?.ticker);
      // var ticarr = [];
      // tickers.forEach(e => {
      //   var fr = {label: e, value: e};
      //   ticarr.push(fr);
      // });
      // await this.setState({cointypes: ticarr});
      this.setState({selectedCardIndex: 3});
    }, 2000);
  }
  _refresh = async () => {
    await this.setState({refreshing: true});
    setTimeout(async () => {
      allactions();
      await this.setState({refreshing: false});
    }, 1000);
  };

  clickstake = () => {
    this.setState({openstacke: !this.state.openstacke});
  };
  // _onPresslogin = async () => {
  //   this.loadingButton.showLoading(true);
  //   const {coinname, amount} = this.state;
  //   Keyboard.dismiss();
  //   let val = '';
  //   const validata = Joi.validate(
  //     {coinname, amount},
  //     schema,
  //     function (err, value) {
  //       if (!err) return null;
  //       const reter = err.details[0].message;
  //       val = err.details[0].context.key;
  //       return reter;
  //     },
  //   );
  //   if (!!validata) {
  //     await this.setState({errors: validata});
  //     showToast('error', this.state.errors);
  //     this.loadingButton.showLoading(false);
  //   } else {
  //     try {
  //       const obj = {
  //         coinname: coinname,
  //         amount: amount,
  //       };
  //       console.log(obj, 'stake-obj');
  //       this.loadingButton.showLoading(false);
  //     } catch (ex) {
  //       if (ex.response && ex.response.status === 400) {
  //         await this.setState({errors: ex.response.data});
  //         showToast('error', this.state.errors);
  //         this.loadingButton.showLoading(false);
  //       }
  //     }
  //   }
  // };

  handleCardPress = index => {
    const {selectedCardIndex, animatedValue} = this.state;

    if (selectedCardIndex !== index) {
      this.setState({selectedCardIndex: index}, () => {
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Reset the animated value after the animation is complete
          animatedValue.setValue(0);
        });
      });
    }
  };

  onstake = async item => {
    const coinss = item?.accepted_coins;
    var tickers = coinss.map(k => k);
    var ticarr = [];
    tickers.forEach(e => {
      var fr = {label: e, value: e};
      ticarr.push(fr);
    });
    await this.setState({cointypes: ticarr});
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
      modaldata: item,
    });
  };
  toggleModal = async () => {
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
      coinname: '',
      amount: '',
      popup: false,
    });
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

  coinsel = async item => {
    await this.setState({
      coinname: item?.value,
    });
  };
  onstakesubmit = async () => {
    this.loadingButton.showLoading(true);
    const {coinname, amount, modaldata} = this.state;
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
    } else if (parseFloat(amount) < parseFloat(modaldata?.min)) {
      showToast('error', 'Minimum Stake Amount Is ' + modaldata?.min);
      this.loadingButton.showLoading(false);
    } else if (parseFloat(amount) > parseFloat(modaldata?.max)) {
      showToast('error', 'Maximum Stake Amount Is ' + modaldata?.max);
      this.loadingButton.showLoading(false);
    } else {
      try {
        const obj = {
          coinname: coinname,
          amount: amount,
        };
        await this.setState({popup: true});
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
    await this.setState({stkbtn: true});
    // console.log('stake cnfm', this.state.tickr);
    var coinsid = this.state?.tickr?.filter(
      k => k?.ticker === this?.state?.coinname,
    )[0];

    try {
      const obj = {
        coin_name: this?.state?.coinname,
        amount: this?.state?.amount,
        contract_id: this?.state?.modaldata?.contract_id,
        coin_id: coinsid?.coin_id,
      };
      console.log(obj, 'cnfm_obj');
      const res = await backEndCallObj('/payments/buy_contract', obj);
      console.log(res, 'resss');
      if (res?.success) {
        showToast('success', res.success);
        setTimeout(async () => {
          await allactions();
          await this.setState({
            isModalVisible: !this.state.isModalVisible,
            coinname: '',
            amount: '',
            popup: false,
            stkbtn: false,
            openstacke: false,
          });
          this.props.navigation.navigate('home');
        }, 2000);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        await this.setState({errors: ex.response.data});
        showToast('error', this.state.errors);
        await this.setState({stkbtn: false});
      }
    }
  };

  render() {
    const {selectedCardIndex, animatedValue, contracts} = this.state;
    const ticker = this.props?.gettaxes?.coins;
    const getprfil = this?.props?.getprofil;
    // console.log(getprfil, 'jhgfdghjk');
    // const entries = Object.entries(getprfil?.balances);

    // var result = Object.keys(getprfil?.balances).map(() => {});
    // console.log('getprofil', Object.keys(getprfil?.balances));
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
        colors={['#101a10', '#40b16bbe', '#101a10', '#40b16bbe']}

      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.33, 0.67, 1]}
      // locations={[0.10, 0.50, 0.67, 1]}
        style={{flex: 1}}>
        <View
          style={styles.headerCont}>
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
        <Toast />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp('4%'),
            marginHorizontal: wp('1%'),
          }}>
          <View style={styles.box}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../../assests/images/usdt1.png')}
                style={{
                  resizeMode: 'contain',
                  width: 20,
                  height: 20,
                  bottom: 2,
                  right: 3,
                }}
              />
              <Text style={{fontFamily: 'Montserrat-SemiBold', color: 'white'}}>
                USDT
              </Text>
            </View>
            <Text style={{fontFamily: 'Montserrat-Bold', color: 'white'}}>
              {this?.props?.getprofil?.balances
                ? this?.props?.getprofil?.balances?.USDT
                : '0.00'}
            </Text>
          </View>

          <View style={styles.box}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../../assests/images/cicon1.png')}
                style={{
                  resizeMode: 'contain',
                  width: 20,
                  height: 20,
                  bottom: 2,
                  right: 3,
                }}
              />
              <Text style={{fontFamily: 'Montserrat-SemiBold', color: 'white'}}>
                USDC
              </Text>
            </View>
            <Text style={{fontFamily: 'Montserrat-Bold', color: 'white'}}>
              {this?.props?.getprofil?.balances
                ? this?.props?.getprofil?.balances?.USDC
                : '0.00'}
            </Text>
          </View>
          <View style={styles.box}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../../assests/images/busd.png')}
                style={{
                  resizeMode: 'contain',
                  width: 20,
                  height: 20,
                  bottom: 2,
                  right: 3,
                }}
              />
              <Text style={{fontFamily: 'Montserrat-SemiBold', color: 'white'}}>
                BUSD
              </Text>
            </View>
            <Text style={{fontFamily: 'Montserrat-Bold', color: 'white'}}>
              {this?.props?.getprofil?.balances
                ? this?.props?.getprofil?.balances?.BUSD
                : '0.00'}
            </Text>
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refresh.bind(this)}
              title="Loading..."
            />
          }>
          <View style={{marginBottom: 100}}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              colors={['#133225', '#07160f', '#07160f', '#133225']}
              style={styles.swapContainer}>
              <View style={{flexDirection: 'row', top: 20}}>
                <Text style={styles.swapContText}>Crypto</Text>
                <Text
                  style={[styles.swapContText, {color: '#5cd766', left: 5}]}>
                  Swap
                </Text>
              </View>
              <Crypotswap />
            </LinearGradient>

            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              colors={['#07160f', '#133225', '#133225', '#133225']}
              style={styles.swapContainer}>
              <View style={{flexDirection: 'row',marginTop:10}}>
                <Text style={styles.swapContText}>Total</Text>
                <Text
                  style={[styles.swapContText, {color: '#5cd766', left: 5}]}>
                  Rewards
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'white',
                  fontSize: 25,
                }}>
                0.00
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: wp('80%'),
                }}>
                <View>
                  <Text style={[styles.text,{fontSize:15}]}>Current Value</Text>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    0.000
                  </Text>
                </View>
                <View>
                  <Text
                    style={[styles.text,{fontSize:15}]}>
                    Total Contribution
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    0.000
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.liquidityBtn} onPress={()=>this.props.navigation.navigate('Liquidity')}>
                <Text style={[styles.text,{color:"white",fontSize:15}]}>Provide Liquidity</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    theme: state.theme,
    getprofil: state.getprofil,
    gettaxes: state.gettaxes,
  };
};

export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
  headerCont:{
    height: hp('8%'),
    backgroundColor: '#00291e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  Title: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2%'),
    color: 'white',
  },
  Details: {
    backgroundColor: 'white',
  },
  Row: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
  },

  sidecont: {
    height: hp('5%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: hp('1.5%'),
  },
  dropdown: {
    width: wp('78%'),
    height: hp('5.4%'),
    borderColor: 'lightgray',
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingHorizontal: wp('1%'),
    backgroundColor: '#EBEBEB',
  },

  box: {
    backgroundColor: '#183b31',
    borderRadius: 10,
    width: 110,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOpacity: 0.8,
    shadowOffset: {width: 1, height: 13},
    elevation: 6,
    marginHorizontal: wp('1%'),
    borderWidth: 1,
    borderColor: '#63d35a',
  },
  swapContainer: {
    width: wp('90%'),
    height: 'auto',
    borderWidth: 0.5,
    borderColor: '#63d35a',
    alignSelf: 'center',
    top: hp('2%'),
    alignItems: 'center',
    borderRadius: hp('1%'),
    marginBottom: 30,
  },
  swapContText: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: 23,
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#92bbad',
    textAlign: 'center',
  },
  liquidityBtn:{
    width:wp('50%'),
    height:hp('7%'),
    backgroundColor:"#0fd744",
    alignSelf:"center",
    borderRadius:hp('3'),
    justifyContent:"center",
    alignItems:"center",
   marginTop:30,
   marginBottom:20
  }
});
