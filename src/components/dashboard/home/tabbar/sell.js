import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import {NumericFormat} from 'react-number-format';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import {showToast} from '../../../../services/toastService';
import Toast from 'react-native-toast-message';
import {backEndCallObj} from '../../../../services/allService';
import LinearGradient from 'react-native-linear-gradient';
import CountryCurrencyPicker from 'react-native-country-currency-picker';
import AnimateLoadingButton from 'react-native-animate-loading-button';
const Joi = require('joi-browser');
const schema = Joi.object().keys({
  phpAmount: Joi.number()
    .min(100)

    .error(() => {
      return {
        message: 'Minumum amount is 100 PHP',
      };
    })
    .required(),
});

class Sell extends Component {
  state = {
    cointypes: [],
    currency: 'PHP',
    amount: '',
    errors: '',
    selectcoin: {},
    phpAmount:'',
 
  };
  componentDidMount = async () => {
    const coins = this?.props?.gettaxes?.coins;
    var tickers = coins?.map(k => k?.ticker);
    var ticarr = [];
    tickers?.forEach(e => {
      var fr = {label: e, value: e};
      ticarr.push(fr);
    });
    //console.log(ticarr, 'depost');
    await this.setState({cointypes: ticarr});
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
      if(reppo !== ''){
      phpToUsdtConversionRate=57.1
      const convertedValue = parseFloat(reppo) * phpToUsdtConversionRate;
      this.setState({phpAmount:convertedValue.toFixed(3)});
      }else{
        this.setState({phpAmount:''})
      }
    }
  };
phpamount=async(amount)=>{
  if (amount[0] == 0) {
    showToast('error', "Don't Enter space & '0' before Amount.");
    await this.setState({phpAmount: ''});
  } else {
    await this.setState({phpAmount: amount});
    await this.setState({buttonDisabled: false});
    let na = amount.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",<>×÷⋅°π©℗®™√€£¥¢✓N•△¶∆\{\}\[\]\\\/]/gi,
      '',
    );
    const reppo = na.replace(' ', '');
    await this.setState({phpAmount: reppo});
    if(reppo !== ''){
    const phpToUsdtConversionRate=57.100
    const convertedValue = parseFloat(reppo) / phpToUsdtConversionRate;
    this.setState({amount:convertedValue.toFixed(3)});
    }else{
      this.setState({amount:''})
    }
  }
}
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
  selectCoinModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };
  selectCoin = name => {
    this.setState({
      currency: name,
      modalVisible: !this.state.modalVisible,
    });
  };
  onValuechange = data => {
    this.setState({
      currency: data.currency,
    });
  };
  _onProceed = async () => {
    this.loadingButton.showLoading(true);
    await this.setState({buttonDisabled: true, buttonshow: false});
    const {phpAmount} = this.state;

    let val = '';
    const validata = Joi.validate({phpAmount}, schema, function (err, value) {
      if (!err) return null;
      const reter = err.details[0].message;
      val = err.details[0].context.key;
      return reter;
    });
    if (validata) {
      await this.setState({errors: validata});
      showToast('error', this.state.errors);
      this.loadingButton.showLoading(false);
      await this.setState({buttonDisabled: true, buttonshow: true});
      setTimeout(async () => {
        this.loadingButton.showLoading(false);
        await this.setState({errors: null});
      }, 2000);
    } else {
      try {
        if (false) {
          console.log('kyc done');
        } else {
          showToast(
            'error',
            'Kindly Complete your KYC first to use OTC services!',
          );
          setTimeout(() => {
            this.props?.props?.props?.navigation?.navigate('Profile');
            this.loadingButton.showLoading(false);
          }, 1000);
        }

        
        // console.log('excuted');
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

    return (
      <View>
        <View style={{marginTop: 10}}>
          <Text style={{color: '#b8dcd4', fontFamily: 'Montserrat-SemiBold'}}>
            Enter Amount
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              top: 10,
            }}>
            <View style={styles.sidecont}>
              <TextInput
                style={styles.inputStyle}
                placeholder="10 to 1000"
                placeholderTextColor={'#006622'}
                returnKeyType="done"
                keyboardType="decimal-pad"
                onChangeText={amount => this.wsamount(amount)}
                value={this.state.amount}
              />
            </View>
            <View
              style={[
                styles.dropdown,
                {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Image
                source={require('../../../../assests/images/usdt1.png')}
                style={{resizeMode: 'contain', width: 20, height: 20, left: 10}}
              />
              <Text style={{color: '#9ddec7', left: 15}}>USDT</Text>
            </View>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{color: '#b8dcd4', fontFamily: 'Montserrat-SemiBold'}}>
            You Will Recieve
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              top: 10,
            }}>
            <View style={styles.sidecont}>
              <TextInput
                style={styles.inputStyle}
                placeholder="0.00"
                placeholderTextColor={'#006622'}
                returnKeyType="done"
                keyboardType="decimal-pad"
                onChangeText={e => this.phpamount(e)}
                value={this.state.phpAmount}
              />
            </View>
            <View style={styles.dropdown}>
              <CountryCurrencyPicker
                containerStyle={styles.containerStyle}
                selectedValue={this.state.currency}
                countries={['PH', 'IN', 'TR', 'AE', 'VN']}
                label={'currency'}
                onValueChange={(value, data) => this.onValuechange(data)}
                iconStyle={{width: 20, height: 20, left: 5}}
                rowLabelStyle={{
                  color: '#91efdb',
                  left: 7,
                  fontFamily: 'Montserrat-SemiBold',
                  height: 25,
                  top: 3,
                }}
                rowStyle={{}}
                dropdownStyle={{
                  backgroundColor: '#00311d',
                  width: 100,
                  marginTop: 14,
                  borderWidth: 0,
                  height: 125,
                }}
              />
            </View>
          </View>
        </View>
        <View style={{top: 20}}>
          <Text style={{fontFamily: 'Montserrat-SemiBold', color: 'white'}}>
            1 USDT ≈ 57.22 PHP
          </Text>
          <View style={styles.ButtonWrapper}>
            <AnimateLoadingButton
              ref={c => (this.loadingButton = c)}
              width={wp('45%')}
              height={hp('6%')}
              backgroundColor={this.state.currency == 'PHP'?"#63d35a":"#003624"}              justifyContent="center"
              alignItems="center"
              borderRadius={10}
              titleFontFamily="Montserrat-SemiBold"
              title={this.state.currency == 'PHP' ? 'Proceed' : 'Comming Soon...'}
              titleFontSize={hp('2.3%')}
              titleColor={this.state.currency == 'PHP' ? 'black':'#fff'}
              onPress={this._onProceed.bind(this)}
              disabled={this.state.currency == 'PHP' ? false : true}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    getprfithis: state.getprfithis,
  };
};
export default connect(mapStateToProps)(Sell);

const styles = StyleSheet.create({
  sidecont: {
    height: hp('7%'),
    flexDirection: 'row',
    borderRadius: 7,
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    width: wp('40%'),
  },
  sideconts: {
    flex: 15,
    width: wp('10%'),
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#006622',
  },
  inputStyle: {
    flex: 85,
    height: hp('7%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: wp('5%'),
    color: 'white',
    borderColor: '#006622',
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderRightWidth: 0,
  },
  dropdown: {
    width: wp('33%'),
    height: hp('7%'),
    borderColor: '#006622',
    borderWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: wp('1%'),
    borderLeftWidth: 0,
    justifyContent: 'center',
  },
  placeholderStyle: {
    fontSize: hp('2%'),
    fontFamily: 'Montserrat-Medium',
    color: '#9ddec7',
  },
  btn: {
    alignSelf: 'center',
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#006622',
    borderRadius: 15,
    top: 10,
    backgroundColor: '#63d35a',
  },
  ModalPopUp: {
    backgroundColor: '#00311d',
    width: wp('30%'),
    borderRadius: 3,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    alignSelf: 'flex-end',
    top: Dimensions.get('screen').height > 720 ? 170 : 160,
    right: 25,
  },

  iconStyle: {
    width: 20,
    height: 20,
    left: 4,
  },
  itemtext: {
    fontSize: 13.5,
    left: 5,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  containerStyle: {
    alignSelf: 'flex-end',
  },
  ButtonWrapper: {
    flexDirection: 'row',
    marginTop: hp('5%'),
    alignSelf: 'center',
  },
});
