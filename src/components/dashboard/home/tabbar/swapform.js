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
const usdt = require('../../../../assests/images/usdt1.png');
const usdc = require('../../../../assests/images/cicon1.png');
const busd = require('../../../../assests/images/busd.png');

class Swapform extends Component {
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
  };
  componentDidMount = async () => {
    const coins = this?.props?.gettaxes?.coins;
    var tickers = coins?.map(k => k?.ticker);
    var ticarr = [];
    tickers?.forEach(e => {
      var fr = {label: e, value: e};
      ticarr.push(fr);
    });
    console.log(ticarr, 'depost');
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
      <View>
        <View >
        <Text style={{color:"#b8dcd4",fontFamily:'Montserrat-SemiBold',top:5}}>Enter Amount</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            top:10
          }}>
          <View style={styles.sidecont}>
            <View style={styles.sideconts}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                source={clogo}
                resizeMode="contain"
              />
            </View>
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
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            itemTextStyle={styles.itemtext}
            data={this.state.cointypes}
            maxHeight={250}
            labelField="label"
            valueField="value"
            placeholder={'Select'}
            searchPlaceholder="Search..."
            value={this.state.coinname}
            onChange={item => {
              this.regionsel(item);

            }}
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
export default connect(mapStateToProps)(Swapform);

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
    borderLeftWidth:0,
    borderRightWidth:0
    

  },
  dropdown: {
    width: wp('29%'),
    height: hp('7%'),
    borderColor: '#006622',
    borderWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: wp('1%'),
    borderLeftWidth:0
  },
  placeholderStyle: {
    fontSize: hp('2%'),
    fontFamily: 'Montserrat-Medium',
    color:"#006622"
  },
});
