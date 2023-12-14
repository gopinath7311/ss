import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Avatar, Button, Image, Icon} from 'react-native-elements';
import get_referalsumry from '../../../../redux/actions/getafiliatesummaryAction';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import LinearGradient from 'react-native-linear-gradient';
class AffiliateSummary extends Component {
  state = {
    refreshing: false,
  };
  _refresh = async () => {
    await this.setState({refreshing: true});
    setTimeout(async () => {
      get_referalsumry();
      await this.setState({refreshing: false});
    }, 1000);
  };
  render() {
    const refrlsumry = this?.props?.getrefsumry?.Affiliate_Summary;
    return (
      <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={[  '#07160f', 'black','#133225','#0d281c',]}
      style={{flex: 1}}>
        
        <View
          style={{
            height: hp('8%'),
            backgroundColor: '#00291e',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: wp('2%'),
          }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" type="ionicons" size={35} color="#fff" />
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                color: '#10e549',
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 19,
                textTransform: 'uppercase',
              }}>
              Affiliate Summary
            </Text>
          </View>
          <TouchableOpacity />
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
            {refrlsumry && refrlsumry?.length > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp('1%'),
                  paddingVertical: hp('1.7%'),
                  backgroundColor: 'lightgray',
                }}>
                <View
                  style={{
                    width: wp('29%'),
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      textTransform: 'capitalize',
                    }}>
                    Name
                  </Text>
                </View>
                <View style={{width: wp('20%')}}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      textTransform: 'capitalize',
                      textAlign: 'center',
                    }}>
                    Date of Join
                  </Text>
                </View>
                <View style={{width: wp('23%')}}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      textTransform: 'capitalize',
                      textAlign: 'center',
                    }}>
                    Total Stakes
                  </Text>
                </View>
                <View style={{width: wp('23%')}}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      textTransform: 'capitalize',
                      textAlign: 'center',
                    }}>
                    Active Stakes
                  </Text>
                </View>
              </View>
            ) : null}
            {refrlsumry && refrlsumry?.length > 0 ? (
              refrlsumry?.map((k, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: wp('1%'),
                      paddingVertical: hp('1.5%'),
                      borderBottomColor: 'lightgray',
                      borderBottomWidth: 1,
                    }}>
                    <View
                      style={{
                        width: wp('29%'),
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          textTransform: 'capitalize',
                        }}>
                        {k?.user_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: wp('21%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          textAlign: 'center',
                          fontSize: 13,
                        }}>
                        <Moment format="DD/MM/YYYY " element={Text} fromNow>
                          {k?.date_of_join}
                        </Moment>
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          textAlign: 'center',
                          fontSize: 13,
                        }}>
                        <Moment format="hh:mm A" element={Text} fromNow>
                          {k?.date_of_join}
                        </Moment>
                      </Text>
                    </View>
                    <View
                      style={{
                        width: wp('23%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          textAlign: 'center',
                        }}>
                        {k?.total_staked}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: wp('23%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          textTransform: 'capitalize',
                          textAlign: 'center',
                        }}>
                        {k?.active_staked}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  height: hp('70%'),
                  justifyContent: 'center',
                }}>
                <Text style={{fontFamily: 'Montserrat-SemiBold', color: 'white'}}>
                  No Data Found
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => {
  return {
    getrefsumry: state.getrefsumry,
  };
};

export default connect(mapStateToProps)(AffiliateSummary);
