import React, {Component, useContext} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {Icon, Avatar} from 'react-native-elements';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import authService from '../../../services/authService';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import update_theme from '../../../redux/actions/darkmodeActions';

class Sidebar extends Component {
  state = {
    btndis: false,
    darkmode: false,
  };
  logout = async () => {
    await this.setState({btndis: true});
    await authService.logout(this.props);
    await this.setState({btndis: false});
  };

  stogl = async () => {
    await this.setState({darkmode: !this.state.darkmode});
    AsyncStorage.setItem('darkmode', JSON.stringify(this.state.darkmode));
    update_theme();
  };

  onverify = async () => {
    this.props.navigation.navigate('initiatekyc');
  };

  render() {
    const mode = this.state.darkmode;
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <View style={{flex: 1, backgroundColor: '#000000'}}>
          <Image
            source={require('../../../assests/images/profile1.png')}
            style={{
              alignSelf: 'center',
              top: 20,
              resizeMode: 'contain',
              width: 120,
              height: 120,
              borderRadius: 60,
            }}
          />
          <ScrollView>
            <View style={{marginBottom: 50}}>
              <View style={styles.bodycontainr}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Profile')}
                  disabled={this.state.btndis}
                  style={styles.bodyview}>
                  <View>
                    <Icon
                      name="person"
                      size={20}
                      type="ionicons"
                      color={'#10e549'}
                    />
                  </View>
                  <View style={styles.txtview}>
                    <Text
                      style={[
                        styles.icontext,
                        {
                          // color: mode ? '#fff' : '#353535',
                          left: -5,
                        },
                      ]}>
                      My Profile
                    </Text>
                  </View>
                </TouchableOpacity>
                     <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Home')}
                  disabled={this.state.btndis}
                  style={styles.bodyview}>
                  <View>
                    <Icon
                      name="home"
                      size={20}
                      type="Entypo"
                      color={'#10e549'}
                    />
                  </View>
                  <View style={styles.txtview}>
                    <Text
                      style={[
                        styles.icontext,
                        {
                          // color: mode ? '#fff' : '#353535',
                          left: -5,
                        },
                      ]}>
                      Dashboard
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Liquidity')}
                  disabled={this.state.btndis}
                  style={styles.bodyview}>
                  <View>
                    <Icon
                      // name="typing"
                      name="switch-access-shortcut-add"
                      size={18}
                      // type="entypo"
                      type="AntDesign"
                      color={'#10e549'}
                    />
                  </View>
                  <View style={styles.txtview}>
                    <Text style={[styles.icontext]}>Liquidity Pools</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('2fa')}
                  disabled={this.state.btndis}
                  style={styles.bodyview}>
                  <View>
                    <Icon
                      // name="typing"
                      name="security"
                      size={18}
                      // type="entypo"
                      type="materialicons"
                      color={'#10e549'}
                    />
                  </View>
                  <View style={styles.txtview}>
                    <Text style={[styles.icontext]}>2FA</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('history')}
                  disabled={this.state.btndis}
                  style={styles.bodyview}>
                  <View>
                    <Icon
                      name="history"
                      size={18}
                      type="FontAwesome5"
                      color={'#10e549'}
                    />
                  </View>
                  <View style={styles.txtview}>
                    <Text style={[styles.icontext]}>History</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('changepassword')
                  }
                  disabled={this.state.btndis}
                  style={styles.bodyview}>
                  <View>
                    <Icon
                      name="lock"
                      size={18}
                      type="ionicons"
                      color={'#10e549'}
                    />
                  </View>
                  <View style={styles.txtview}>
                    <Text style={[styles.icontext]}>Update Password</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('refertofriend')
                  }
                  disabled={this.state.btndis}
                  style={styles.bodyview}>
                  <View>
                    <Icon
                      name="card-giftcard"
                      size={18}
                      type="Feather"
                      color={'#10e549'}
                    />
                  </View>
                  <View style={styles.txtview}>
                    <Text style={[styles.icontext]}>Affiliate</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('support')}
                  disabled={this.state.btndis}
                  style={styles.bodyview}>
                  <View>
                    <Icon
                      name="support-agent"
                      size={20}
                      type="ionicons"
                      color={'#10e549'}
                    />
                  </View>
                  <View style={styles.txtview}>
                    <Text style={[styles.icontext]}>Support</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.logout()}
                  disabled={this.state.btndis}
                  style={styles.bodyview}>
                  <View>
                    <Icon
                      name="logout"
                      size={18}
                      type="MaterialIcons"
                      color={'#10e549'}
                    />
                  </View>
                  <View style={styles.txtview}>
                    <Text style={[styles.icontext]}>Logout</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.providersCont}>
<View style={{flexDirection:"row"}}>
<Icon name='person' type='ionicons' color={'#fff'}/>
<Text style={styles.providersText}>Total Providers</Text>
</View>
<Text style={styles.providersNum}>600</Text>
<View style={{flexDirection:"row"}}>
<Icon name='switch-access-shortcut-add' type='AntDesing' color={'#fff'}/>
<Text style={styles.providersText}>Liquidity Provided</Text>
</View>
<Text style={styles.providersNum}>362,069</Text>
                </View>

              </View>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                marginRight: 10,
              }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#10e549',
                }}>
                App Version : V {DeviceInfo.getVersion()}
              </Text>
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
    getprofil: state.getprofil,
  };
};

export default connect(mapStateToProps)(Sidebar);

const styles = StyleSheet.create({
  halfcir: {
    alignSelf: 'center',
    backgroundColor: '#1d1d1b',
    borderRadius: 200,
    transform: [{scaleX: 2}],
    height: hp('30%'),
    width: wp('40%'),
    marginTop: hp('-15%'),
  },
  dp: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userdetails: {marginTop: hp('1%')},
  username: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: wp('4%'),
    paddingTop: hp('0.5%'),
    textTransform: 'capitalize',
  },
  usertype: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: wp('3.5%'),
    textTransform: 'uppercase',
  },
  bodycontainr: {marginHorizontal: wp('6%'), marginTop: hp('5%')},
  bodyview: {flexDirection: 'row', marginVertical: hp('1.5%')},
  icontext: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
  },
  txtview: {
    left: 12,
  },
  txt: {
    fontFamily: 'Montserrat-Medium',
  },
  providersCont:{
    borderWidth:0.5,
    borderColor:"#336631",
    justifyContent:"center",
    alignItems:"center",
    width:wp('50%'),
    top:10,
    borderRadius:hp('1%')
  },
  providersText:{
    color:'#03cc4f',
    fontFamily:"YoungSerif-Regular"
  },
  providersNum:{
    color:"#fff",
    fontFamily:'Poppins-SemiBold'
  }
});
