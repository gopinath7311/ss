import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header, Icon, Badge, Button} from 'react-native-elements';
import NumberFormat from 'react-number-format';

const menu = require('../../../assests/images/menu.png');
const rlogo = require('../../../assests/images/favicon.png');
const user = require('../../../assests/images/user.png');

class ExchangeChat extends Component {
  state = {};
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#212627'}}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: wp('5%'),
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity>
              <Image
                style={{width: 40, height: 40}}
                source={user}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={{width: 40, height: 40}}
                source={menu}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Image
            style={{
              width: 35,
              height: 35,
              marginTop: hp('2%'),
              alignSelf: 'center',
            }}
            source={rlogo}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              top: hp('5%'),
            }}>
            <View
              style={{
                width: wp('18%'),
                height: hp('7%'),
                backgroundColor: '#1d1d1b',
                borderColor: '#090a0a',
                borderWidth: 2,
                borderTopRightRadius: 30,
                borderBottomRightRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                }}
                source={require('../../../assests/images/btc.png')}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                width: wp('18%'),
                height: hp('7%'),
                backgroundColor: '#1d1d1b',
                borderColor: '#090a0a',
                borderWidth: 2,
                borderTopLeftRadius: 30,
                borderBottomLeftRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: 30, height: 30}}
                source={require('../../../assests/images/ccimg.png')}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={{top: 15, left: 130}}>
            <Image
              style={{width: 45, height: 45, left: 25}}
              source={require('../../../assests/images/eth_logo.png')}
              resizeMode="contain"
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                fontFamily: 'Montserrat-Bold',
              }}>
              $ 1,735.27
            </Text>
          </View>
          <View style={styles.triangle}></View>
          <View
            style={{
              marginHorizontal: wp('8%'),
              backgroundColor: '#121212',
              borderColor: '#1d1d1b',
              borderTopWidth: 0,
              borderWidth: 3,
              height: hp('20%'),
            }}>
            <Image
              style={{width: 300, height: 160, left: -3}}
              source={require('../../../assests/images/chart.png')}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              marginHorizontal: wp('8%'),
              marginTop: hp('3%'),
              backgroundColor: '#121212',
              borderColor: '#1d1d1b',
              borderWidth: 5,
              borderRadius: 20,
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: '#ffab00',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: '#ffab00',
                    borderColor: '#fff',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: 23,
                      top: -4,
                    }}>
                    ₱
                  </Text>
                </View>
              </View>
              <View style={{marginLeft: wp('3%')}}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Montserrat-Bold',
                    textTransform: 'uppercase',
                  }}>
                  tpeso
                </Text>
                <Text
                  style={{
                    color: '#787878',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 11,
                    textTransform: 'uppercase',
                  }}>
                  PHP
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp('30%'),
                }}>
                <Text
                  style={{
                    color: '#787878',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 12,
                  }}>
                  Balance{'  '}
                </Text>
                <NumberFormat
                  value={54943}
                  displayType={'text'}
                  thousandSeparator={true}
                  thousandsGroupStyle={'thousand'}
                  decimalScale={0}
                  fixedDecimalScale={true}
                  renderText={value => (
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {value}
                    </Text>
                  )}
                />
              </View>
              <NumberFormat
                value={5000}
                displayType={'text'}
                thousandSeparator={true}
                thousandsGroupStyle={'thousand'}
                decimalScale={0}
                fixedDecimalScale={true}
                renderText={value => (
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#fff',
                      fontFamily: 'Montserrat-SemiBold',
                      textAlign: 'center',
                    }}>
                    {value}
                  </Text>
                )}
              />
            </View>
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#eaba11',
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 60,
                left: wp('35%'),
              }}>
              <Icon
                name="chevron-down"
                type="entypo"
                size={30}
                color={'#7537f5'}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginHorizontal: wp('8%'),
              marginTop: hp('2%'),
              backgroundColor: '#121212',
              borderColor: '#1d1d1b',
              borderWidth: 5,
              borderRadius: 20,
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              zIndex: -1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 35, height: 35}}
                source={require('../../../assests/images/eth_logo.png')}
                resizeMode="contain"
              />
              <View style={{marginLeft: wp('3%')}}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Montserrat-Bold',
                    textTransform: 'uppercase',
                  }}>
                  ETH
                </Text>
                <Text
                  style={{
                    color: '#787878',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 11,
                    textTransform: 'uppercase',
                  }}>
                  Ethereum
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp('30%'),
                }}>
                <Text
                  style={{
                    color: '#787878',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 12,
                  }}>
                  Balance{'  '}
                </Text>
                <NumberFormat
                  value={0}
                  displayType={'text'}
                  thousandSeparator={true}
                  thousandsGroupStyle={'thousand'}
                  decimalScale={0}
                  fixedDecimalScale={true}
                  renderText={value => (
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {value}
                    </Text>
                  )}
                />
              </View>
              <NumberFormat
                value={0.0645}
                displayType={'text'}
                thousandSeparator={true}
                thousandsGroupStyle={'thousand'}
                decimalScale={4}
                fixedDecimalScale={true}
                renderText={value => (
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#fff',
                      fontFamily: 'Montserrat-SemiBold',
                      textAlign: 'center',
                    }}>
                    {value}
                  </Text>
                )}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#eaba11',
              width: wp('35%'),
              height: hp('6%'),
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              borderColor: '#1d1d1b',
              borderWidth: 5,
              borderRadius: 15,
              marginTop: hp('3%'),
            }}>
            <Text
              style={{
                color: '#1d1d1b',
                fontSize: 18,
                fontFamily: 'Montserrat-Bold',
                textTransform: 'uppercase',
              }}>
              Swap
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

export default ExchangeChat;

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 151,
    borderRightWidth: 151,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#121212',
    transform: [{rotate: '0deg'}],
    marginLeft: wp('8%'),
    zIndex: -1,
    marginTop: hp('-10%'),
  },
});
