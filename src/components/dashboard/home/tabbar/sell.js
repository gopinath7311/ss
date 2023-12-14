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

const local_data = [
  {
    value: '1',
    label: 'PHP',
  },
  {
    value: '2',
    label: 'INR',
  },
  {
    value: '3',
    label: 'TRY',
  },
  {
    value: '3',
    label: 'AED',
  },
  {
    value: '3',
    label: 'VND',
  },
];
const php = require('../../../../assests/images/php.png');
const inr = require('../../../../assests/images/inr.png');
const tryy = require('../../../../assests/images/try.png');
const aed = require('../../../../assests/images/aed.png');
const vnd = require('../../../../assests/images/vnd.png');
class Sell extends Component {
  state = {
    cointypes: [],
    currency: 'PHP',
    amount: '',
    errors: '',
    selectcoin: {},
    isModalVisible: false,
    modaldata: {},
    popup: false,
    resp: {},
    modalVisible:false
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
  selectCoinModal =  () => {

    this.setState({
     modalVisible: !this.state.modalVisible,
   });
 };
 selectCoin =  name => {
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
  render() {
    const clogo =
    this.state.currency && this.state.currency.length > 0
      ? this.state.currency === 'PHP'
        ? php
        : this.state.currency === 'INR'
        ? inr
        : this.state.currency ==='TRY'
        ?tryy
        :this.state.currency ==="AED"
        ?aed:vnd
      : null;
      const{currency}=this.state
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
                style={{resizeMode: 'contain', width: 20, height: 20, left:10}}
              />
              <Text style={{color: '#9ddec7',left:15}}>USDT</Text>
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
                onChangeText={e => console.log(e)}
                value={this.state.amount}
              />
            </View>
            <View style={styles.dropdown}>
            <CountryCurrencyPicker
                containerStyle={styles.containerStyle}
                selectedValue={this.state.currency}
                countries={['PH', 'IN', 'TR', 'AE', 'VN']}
                label={'currency'}
                onValueChange={(value, data) => this.onValuechange(data)}
                iconStyle={{width: 25, height: 25, left: 5,}}
                rowLabelStyle={{
                  color: '#91efdb',
                  left: 5,
                  fontFamily: 'Montserrat-SemiBold',
                
                }}
                //rowStyle={{backgroundColor:"green"}}
                dropdownStyle={{
                  backgroundColor: '#00311d',
                  width: 100,
                  marginTop: 10,
                  borderWidth: 0,
                  height:130
                }}
              />
            </View>
          </View>
          
        </View>
       <View style={{top:20}}>
       <Text style={{fontFamily: 'Montserrat-SemiBold', color: 'white'}}>
            1 USDT ≈ 57.22 PHP
          </Text>
          <TouchableOpacity style={styles.btn}>
            <Text style={{color:"#b8dcd4",fontFamily:"Montserrat-SemiBold"}}>Comming Soon...</Text>
          </TouchableOpacity>
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
borderTopLeftRadius:5,
borderBottomLeftRadius:5,
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
  btn:{
    alignSelf:"center",
    height:50,
    width:150,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor:"#006622",
    borderRadius:15,
    top:10
   
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
    alignSelf:'flex-end',
    top:Dimensions.get('screen').height>720?170:160,
    right:25,
  },

  iconStyle: {
    width: 20,
    height: 20,
    left:4,
  
  },
  itemtext: {
    fontSize: 13.5,
    left: 5, 
    color: '#fff',
    fontFamily:"Montserrat-SemiBold"
  },
  containerStyle: {
    alignSelf: 'flex-end',
  },
});
