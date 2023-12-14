import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  RefreshControl,
  Image,
} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import Joi from 'joi-browser';
import Toast from 'react-native-tiny-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Moment from 'react-moment';
import {connect} from 'react-redux';
import get_tickets from '../../../../redux/actions/getticketsAction';
import LinearGradient from 'react-native-linear-gradient';
import { ContinousBaseGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

class Support extends Component {
  state = {
    refreshing: false,
    risebtndis: false,
    ticbtndis: false,
  };

  _refresh = async () => {
    await this.setState({refreshing: true});
    setTimeout(async () => {
      get_tickets();

      await this.setState({refreshing: false});
    }, 1000);
  };

  risetic = async () => {
    await this.setState({risebtndis: true});
    this.props.navigation.navigate('raiseticket');
    setTimeout(async () => {
      await this.setState({risebtndis: false});
    }, 2000);
  };

  ticdetails = async k => {
    await this.setState({ticbtndis: true});
    this.props.navigation.navigatie('ticketdetails', {k});
    setTimeout(async () => {
      await this.setState({ticbtndis: false});
    }, 2000);
  };

  render() {
    const gettickets = this.props.gettickets;
    let ot = [];
    let pt = [];
    const tics = gettickets.map((l, index) => {
      if (l.status === 'Open') {
        pt.push(l);
      } else {
        ot.push(l);
      }
    });
    return (
      <SafeAreaView>
        <View
          style={{
            width: wp('100%'),
            height: hp('100%'),
            backgroundColor: '#0d0d0d',
          }}>
          <View style={styles.headerCont}>
            <TouchableOpacity
           
              onPress={() => this.props.navigation.navigate('home')}>
              <Icon name="arrow-back" type="ionicons" size={30} color="#fff" />
            </TouchableOpacity>

            <Image
              style={{
                width: 205,
                height: 60,
                left: 53,
              }}
              source={require('../../../../assests/images/logoname-bg.png')}
              resizeMode="contain"
            />
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._refresh.bind(this)}
                title="Loading..."
              />
            }>
            <View style={{marginBottom: 50}}>
              <View
                // style={{marginHorizontal: wp('5%')}}
                style={styles.txtview}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: wp('2%'),
                    marginVertical: hp('2%'),
                  }}>
                  <TouchableOpacity
                    disabled={this.state.risebtndis}
                    onPress={() => this.risetic()}
                    //style={styles.raiseTicketBtn}
                    >
                      <LinearGradient
                          colors={['#1d8659', '#3f777d', '#5c6b9e']}
                          start={{x: 0.2, y: 0.2}}
                          end={{x: 1, y: 0.2}}
                          style={styles.raiseTicketBtn}
                      >
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Montserrat-Bold',
                      }}>
                      Raise Ticket
                    </Text>
                   </LinearGradient>
                  </TouchableOpacity>
                  <View>
                    <View
                      style={styles.openCloseCont}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'Montserrat-Medium',
                          right: 15,
                        }}>
                        Open
                      </Text>
                      <Text
                        style={{
                          color: '#4caf4f',
                          fontFamily: 'Montserrat-Bold',
                          fontSize: 16,
                        }}>
                        {pt.length}
                      </Text>
                    </View>

                    <View
                      style={styles.openCloseCont}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'Montserrat-Medium',
                          right: 15,
                        }}>
                        Closed
                      </Text>
                      <Text
                        style={{
                          color: '#f34336',
                          fontFamily: 'Montserrat-Bold',
                          fontSize: 16,
                        }}>
                        {ot.length}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {gettickets && gettickets.length > 0 ? (
                gettickets.map((k, index) => {
                  return (
                    <View key={index}>
                      <TouchableOpacity
                        disabled={this.state.ticbtndis}
                        onPress={() => this.ticdetails({k})}
                        style={[styles.txtview, {paddingVertical: 10}]}>
                        <View>
                          <Text
                            style={{
                              color: '#353535',
                              fontFamily: 'Montserrat-SemiBold',
                            }}>
                            Ticketid:{' '}
                            <Text
                              style={{
                                color: '#353535',
                                fontFamily: 'Montserrat-Regular',
                              }}>
                              {k?.ticket_id}
                            </Text>
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              color: '#353535',
                              fontFamily: 'Montserrat-SemiBold',
                            }}>
                            Message:{' '}
                            <Text
                              style={{
                                color: '#353535',
                                fontFamily: 'Montserrat-Regular',
                              }}>
                              {k?.descriptions[0]?.description}
                            </Text>
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <View>
                            <Text
                              style={{
                                color: '#353535',
                                fontFamily: 'Montserrat-Regular',
                                fontSize: 12,
                              }}>
                              <Moment
                                element={Text}
                                fromNow
                                format="DD/MM/YYYY hh:mm A">
                                {new Date(Number(k?.descriptions[0]?.datetime))}
                              </Moment>{' '}
                            </Text>
                          </View>
                          <View
                            style={{
                              // backgroundColor:
                              //   k?.status === 'Close' ? '#f34336' : 'green',
                              width: wp('18%'),
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: hp('3.5%'),
                              borderRadius: 20,
                              borderColor:
                                k?.status === 'Close' ? '#f34336' : '#4caf4f',
                              borderWidth: 1,
                            }}>
                            <Text
                              style={{
                                color:
                                  k?.status === 'Close' ? '#f34336' : '#4caf4f',
                                textTransform: 'capitalize',
                                fontFamily: 'Montserrat-SemiBold',
                              }}>
                              {k?.status}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <View
                  style={{
                    height: hp('60%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#f34336',
                      fontSize: 13,
                      fontFamily: 'Montserrat-Bold',
                    }}>
                    No RaiseTickets Found
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    gettickets: state.gettickets,
  };
};

export default connect(mapStateToProps)(Support);

const styles = StyleSheet.create({
  headerCont: {
    height: hp('8%'),
    backgroundColor: '#00291e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  txtview: {
    marginTop: 20,
    width: 330,
    height: 'auto',
    backgroundColor: '#00311d',
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 5,
    borderWidth:1,
    borderColor:"#10e549"
  },
  raiseTicketBtn:{
    backgroundColor: '#090932',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('14%'),
    paddingVertical: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 8,
  },
  openCloseCont:{
    width: wp('30%'),
    height: hp('4.5%'),
    borderColor: '#00f8e9',
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: hp('0.5%'),
    marginBottom:10
  }
});
