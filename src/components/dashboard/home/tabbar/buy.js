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
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import {showToast} from '../../../../services/toastService';
import Toast from 'react-native-toast-message';
import {backEndCallObj} from '../../../../services/allService';
import LinearGradient from 'react-native-linear-gradient';
import CountryCurrencyPicker from 'react-native-country-currency-picker';

class Buy extends Component {
  state = {
    cointypes: [],
    currency: 'PHP',
    amount: '',
    errors: '',
    selectcoin: {},
    demo4: {},
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

  onValuechange = data => {
    this.setState({
      currency: data.currency,
    });
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
            <View style={styles.dropdown}>
              <CountryCurrencyPicker
                containerStyle={styles.containerStyle}
                selectedValue={this.state.currency}
                countries={['PH', 'IN', 'TR', 'AE', 'VN']}
                label={'currency'}
                onValueChange={(value, data) => this.onValuechange(data)}
                iconStyle={{width: 23, height: 23, left: 5}}
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
                  height:'auto'
                }}
           
              />
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
              {/* <View style={styles.sideconts}>
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
              </View> */}
              <TextInput
                style={styles.inputStyle}
                placeholder="0.00"
                placeholderTextColor={'#006622'}
                returnKeyType="done"
                keyboardType="decimal-pad"
                onChangeText={e => console.log(e)}
                value={this.state.amount}
                editable={false}
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
        <View style={{top: 20}}>
          <Text style={{fontFamily: 'Montserrat-SemiBold', color: 'white'}}>
            1 USDT ≈ 57.22 PHP
          </Text>
          <TouchableOpacity style={styles.btn}>
            <Text style={{color: '#b8dcd4', fontFamily: 'Montserrat-SemiBold'}}>
              Comming Soon...
            </Text>
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
export default connect(mapStateToProps)(Buy);

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
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  subContainer: {
    padding: 10,
  },
  header: {
    fontSize: 10,
    marginBottom: 10,
    color: '#fff',
  },
  containerStyle: {
    alignSelf: 'flex-end',
  },
});
