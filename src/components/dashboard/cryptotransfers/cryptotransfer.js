import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Header, Icon, Badge, Button} from 'react-native-elements';
import { NumericFormat } from 'react-number-format';

import {connect} from 'react-redux';
import Deposit from './deposit/deposit';
import CryptoWithdraw from './cryptowithdraw';
import InternalTransfer from './internaltransfer';


class CryptoTransfer extends Component {
  state = {
    popup: false,
    index: 0,
    routes: [
      {key: 'first', title: 'Deposit'},
      {key: 'second', title: 'Withdrawal'},
      {key: 'third', title: 'Internal transfer'},
    ],
    active: false,
  };

  _renderItem = ({item, index}) => {
    if (item.empty) return <View style={{}} />;
    return (
      <View>
        <TouchableOpacity
          style={{marginHorizontal: wp('1%'), marginVertical: hp('1%')}}
          activeOpacity={0.5}>
          <Image
            source={item.logo}
            style={{
              width: 33,
              height: 33,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  onshow = async () => {
    await this.setState({popup: !this.state.popup});
  };

  render() {
    
    const themecolor =
      this.props.theme && this.props.theme.length > 0
        ? JSON.parse(this.props.theme)
        : '';
    const coins = [
      {
        key: 1,
        logo: require('../../../assests/images/eth_logo.png'),
      },
      {
        key: 2,
        logo: require('../../../assests/images/jap_yen.png'),
      },
      {
        key: 3,
        logo: require('../../../assests/images/euro.png'),
      },
      {
        key: 4,
        logo: require('../../../assests/images/usd.png'),
      },
      {
        key: 5,
        logo: require('../../../assests/images/yen.png'),
      },
      {
        key: 6,
        logo: require('../../../assests/images/f_yen.png'),
      },
      {
        key: 7,
        logo: require('../../../assests/images/peso.png'),
      },
      {
        key: 8,
        logo: require('../../../assests/images/btc.png'),
      },
      {
        key: 9,
        logo: require('../../../assests/images/usdt.png'),
      },
      {
        key: 10,
        logo: require('../../../assests/images/cicon1.png'),
      },
      {
        key: 11,
        logo: require('../../../assests/images/cicon2.png'),
      },
      {
        key: 12,
        logo: require('../../../assests/images/cicon3.png'),
      },
      {
        key: 13,
        logo: require('../../../assests/images/cicon4.png'),
      },
      {
        key: 14,
        logo: require('../../../assests/images/cicon5.png'),
      },
      {
        key: 15,
        logo: require('../../../assests/images/cicon6.png'),
      },
      {
        key: 16,
        logo: require('../../../assests/images/doge.png'),
      },
      {
        key: 17,
        logo: require('../../../assests/images/cicon7.png'),
      },
      {
        key: 18,
        logo: require('../../../assests/images/cicon8.png'),
      },
      {
        key: 19,
        logo: require('../../../assests/images/cicon9.png'),
      },
      {
        key: 20,
        logo: require('../../../assests/images/cicon10.png'),
      },
      {
        key: 21,
        logo: require('../../../assests/images/cicon11.png'),
      },
      {
        key: 22,
        logo: require('../../../assests/images/cicon17.png'),
      },
      {
        key: 23,
        logo: require('../../../assests/images/cicon12.png'),
      },
      {
        key: 24,
        logo: require('../../../assests/images/cicon13.png'),
      },
      {
        key: 25,
        logo: require('../../../assests/images/cicon14.png'),
      },
      {
        key: 26,
        logo: require('../../../assests/images/sand.png'),
      },
      {
        key: 27,
        logo: require('../../../assests/images/cicon15.png'),
      },
      {
        key: 28,
        logo: require('../../../assests/images/cicon16.png'),
      },
    ];
    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            height: hp('8%'),
            backgroundColor: '#00291e',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: wp('2%'),
          }}>
          <TouchableOpacity 
          onPress={() => this.props.navigation.openDrawer()}
          >
            <Icon name="menu" type="ionicons" size={35} color="#fff" />
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <Image
              style={{
                width: 205,
                height: 60,
              }}
              source={require('../../../assests/images/logoname-bg.png')}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity />
        </View>
        <TabView
          style={styles.conts}
          navigationState={this.state}
          renderScene={SceneMap({
            first: Deposit,
            second: CryptoWithdraw,
            third: InternalTransfer,
          })}
          renderTabBar={props => (
            <TabBar
              {...props}
              activeColor={'#78e85b'}
              style={{
                backgroundColor: '#133225',
                height: hp('7%'),
              }}
              indicatorStyle={{
                backgroundColor: '#78e85b',
                height: 3,
              }}
              
              inactiveColor={'white'}
              labelStyle={{
                fontSize: hp('1.6%'),
                fontFamily: 'Montserrat-SemiBold',
                alignSelf: 'center',
                marginTop: hp('1%'),
                textAlign: 'center',
                textTransform:'none'
              }}
            />
          )}
          onIndexChange={index => this.setState({index})}
          initialLayout={{width: Dimensions.get('window').width}}
        />

        
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    theme: state.theme,
  };
};

export default connect(mapStateToProps)(CryptoTransfer);

const styles = StyleSheet.create({
  conts: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: 'white',
  },
});
