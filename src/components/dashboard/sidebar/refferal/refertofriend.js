import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Share from 'react-native-share';
import PieChart from 'react-native-pie-chart';
import {VictoryPie,VictoryLabel,VictoryTooltip} from 'victory-native';
import Clipboard from '@react-native-community/clipboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-tiny-toast';
import {Avatar, Button, Image, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {NumericFormat} from 'react-number-format';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'react-moment';
const graphicData = [
  {y: 10, x: ['Level3  1%']},
  {y: 28, x: ['Level2  2%']},
  {y: 50, x: ['Level1  5%']},
];
const {width} = Dimensions.get('window');
const bg = require('../../../../assests/images/bg_img.jpg');

class Refertofriend extends Component {
  state = {reflink: '', readbtn: false};
  componentDidMount() {}

  clip = async copylink => {
    Clipboard.setString(copylink);
    await this.setState({copytext: 'Referral Link Copied Successfully'});
    setTimeout(async () => {
      await this.setState({copytext: ''});
    }, 3000);
  };
  onshare = copylink => {
    const options = {
      title: 'name pending',
      message: 'Install this wonderful App and enjoy',
      url: copylink,
    };
    Share.open(options)
      .then(res => {})
      .catch(err => {
        err && console.log('Share failed: ', err);
      });
  };

  onread = async () => {
    await this.setState({readbtn: !this.state.readbtn});
  };
  render() {
    const copylink = this.state.reflink;
    const widthAndHeight = 250;
    const series = [123, 321, 123];
    const sliceColor = ['#fbd203', '#ffb300', '#ff9100'];
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('home')}>
            <Icon name="arrow-back" type="ionicons" size={35} color="#fff" />
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <Image
              style={{
                width: 205,
                height: 60,
              }}
              source={require('../../../../assests/images/logoname-bg.png')}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity />
        </View>
        <ScrollView>
          <View style={{marginBottom: hp('15%')}}>
            {/* <View style={styles.levelCont}>
              <Image
                source={require('../../../../assests/images/ref-bg1.png')}
                style={styles.levelImg}>
                <NumericFormat
                  value={this?.props?.gettaxes?.referral_commissions?.level1}
                  displayType={'text'}
                  thousandSeparator={true}
                  thousandsGroupStyle={'thousand'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={value => (
                    <Text style={styles.levelText}>{value} %</Text>
                  )}
                />
                <Text style={styles.levelNO}>
                  level 1{/* Total Affiliates Earnings{' '} */}
            {/* </View></Text> */}
            {/* </Image> */}
            {/* <Image
                source={require('../../../../assests/images/ref-bg2.png')}
                style={styles.levelImg}>
                <NumericFormat
                  value={this?.props?.gettaxes?.referral_commissions?.level2}
                  displayType={'text'}
                  thousandSeparator={true}
                  thousandsGroupStyle={'thousand'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={value => (
                    <Text style={styles.levelText}>{value} %</Text>
                  )}
                /> */}
            {/* <Text style={styles.levelNO}>
                  level 2{/* Total Affiliates{' '} */}
            {/* </Text> */}
            {/* </Image> */}
            {/* <Image
                source={require('../../../../assests/images/ref-bg3.png')}
                style={styles.levelImg}>
                <NumericFormat
                  value={this?.props?.gettaxes?.referral_commissions?.level3}
                  displayType={'text'}
                  thousandSeparator={true}
                  thousandsGroupStyle={'thousand'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={value => (
                    <Text style={styles.levelText}>{value} %</Text>
                  )}
                />

                <Text style={styles.levelNO}>
                  level 3{/* Total Activated Affiliates{' '} */}
            {/* </Text> */}
            {/* </Image> */}
            {/* </View>  */}

            <View
              style={{
                marginTop: hp('1%'),
                // paddingVertical: hp('2%'),
              }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  // textAlign: 'center',
                  marginHorizontal: 10,
                  marginTop:20,
                  color: '#fff',
                }}>
                Refer a Friend & Earn
              </Text>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  // textAlign: 'center',
                  marginHorizontal: 10,
                  color: 'grey',
                }}>
                Unlock Rewards for You and Your Friends: Start Referring Now
              </Text>
              {/* <Image
                source={require('../../../../assests/images/refermin1.png')}
                style={{
                  height: 130,
                  width: undefined,
                }}
                resizeMode="contain"
              /> */}

              {/* <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.60}
            coverFill={'#001d1a'}
            style={{alignSelf:'center'}}
          /> */}

              <VictoryPie
                data={graphicData}
                width={350}
                height={350}
                innerRadius={70}
                
                style={{
                  labels: {
                    fill: 'green',
                    fontSize: 15,
                    padding: -30,
                   
                  },
                }}
                colorScale={['#00f8f1', '#16b27d', '#34ea62']}
                padAngle={1} 
                endAngle={-90} 
                startAngle={90} 
                labelComponent={<VictoryTooltip  active flyoutStyle={{ stroke: "green", strokeWidth: 2,stopColor:'red'}}/>}
                
              />
              <View style={{marginTop:-150}}>
              <Text style={styles.afsBonusText}>
                AFS Bonus{' '}
                <Text
                  style={{
                    color: '#55d35a',
                    fontFamily: 'Poppins-Bold',
                    fontSize: 18,
                  }}>
                  10%
                </Text>
              </Text>
              <Text
                style={[
                  styles.txt,
                  {
                    left: 15,
                    color: '#fff',
                    //marginTop: -50,
                  },
                ]}>
                Share My Affiliate Link
              </Text>
              <View style={{paddingHorizontal: 10}}>
                <TouchableOpacity
                  style={styles.linkContainer}
                  onPress={() => this.clip(copylink)}>
                  <Text style={styles.linkText}>
                  https://stableswap.live/ref?id=UA9BD77 {copylink.slice(0, 42) + '.....'}
                  </Text>
                  <Icon type="FontAwesome" name="copy-all" color={'white'} />
                </TouchableOpacity>
                <Text style={styles.coppiedText}> {this.state.copytext} </Text>
              </View>
              <View style={{flexDirection:"row",justifyContent:"space-evenly",marginBottom:5}}>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                  <Icon name='facebook' type='Entypo' color={'#00f9f1'} />
                  <Text style={styles.iconText}>Facebook</Text>
                </View>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                  <Icon name='call' type='FontAwesome' color={'#00f9f1'}/>
                  <Text style={styles.iconText} >Twitter</Text>
                </View>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                  <Icon type='FontAwesome' name='telegram' color={'#00f9f1'}/>
                  <Text style={styles.iconText}>Telegram</Text>
                </View>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                  <Icon type='Entypo' name='email' color={'#00f9f1'}/>
                  <Text style={styles.iconText}>Email</Text>
                </View>
              </View>
              <View style={styles.shareAffilate}>
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={() => this.onshare(copylink)}>
                  <Icon
                    name="share"
                    type="AntDesign"
                    size={20}
                    color="white"
                    style={{
                      height: 38,
                      width: 35,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: 20,
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#fff',
                    }}>
                    Share
                  </Text>
                  {/* </LinearGradient> */}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('refer')}
                  style={styles.shareBtn}>
                  <Text style={{color: '#fff', fontFamily: 'Montserrat-Bold'}}>
                    Affiliate Summary
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.affiliateCont}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                  }}>
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 13,
                    }}
                    source={require('../../../../assests/images/sslogo.png')}
                    resizeMode="contain"
                  />

                  <View>
                    <Text
                      style={{
                        color: '#62d45d',
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 18,
                        top: 5,
                      }}>
                      Total Affiliates
                    </Text>
                    <Text
                      style={{
                        color: '#74fffa',
                        fontFamily: 'Montserrat-ExtraBold',
                        fontSize: 25,
                        textAlign: 'center',
                        top: 5,
                      }}>
                      {this?.props?.getrefsumry?.Total_Affiliates}0
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    top: 10,
                    marginBottom: hp('3%'),
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: '#fff',
                        fontSize: 14,
                      }}>
                      Active Affiliates
                    </Text>
                    <NumericFormat
                      value={
                        this?.props?.getrefsumry
                          ? this?.props?.getrefsumry &&
                            this?.props?.getrefsumry?.Total_Active_Affiliates
                          : 0
                      }
                      displayType={'text'}
                      thousandSeparator={true}
                      thousandsGroupStyle={'thousand'}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      renderText={value => (
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Bold',
                            color: '#fff',
                            fontSize: 17,
                          }}>
                          {value}0
                        </Text>
                      )}
                    />
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: '#fff',
                        fontSize: 14,
                      }}>
                      Total Affiliate Earnings
                    </Text>
                    <NumericFormat
                      value={
                        this?.props?.getrefsumry
                          ? this?.props?.getrefsumry &&
                            this?.props?.getrefsumry?.Total_Affiliate_Earnings
                          : 0
                      }
                      displayType={'text'}
                      thousandSeparator={true}
                      thousandsGroupStyle={'thousand'}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      renderText={value => (
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Bold',
                            color: '#fff',
                            fontSize: 17,
                          }}>
                          {value}0
                        </Text>
                      )}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.affiliateProgCont}>
                <Text style={styles.programText}>Affiliate Program</Text>
                <View style={{marginHorizontal: wp('5%')}}>
                  <Text style={[styles.txt, {marginVertical: hp('1%')}]}>
                    Start Enjoying the Benefits of The Stable Swap Affiliate
                    Program!
                  </Text>
                  <Text style={styles.txt}>
                    * Share your unique Affiliate Link to your friends to start
                    growing your network.
                  </Text>
                  <Text style={styles.txt}>
                    * If a user registers with your Affiliate link, they will be
                    added as a member of your network.
                  </Text>
                  {this.state.readbtn ? (
                    <View>
                      <Text style={styles.txt}>
                        * AFS will be automatically added to your Stable Swap
                        account..
                      </Text>
                      <Text style={styles.txt}>
                        * You must start providing liquidity to be eligible to
                        receive the AFS Bonus.
                      </Text>
                      <Text
                        style={[
                          styles.txt,
                          {fontSize: 20, fontFamily: 'Monserrat-Bold'},
                        ]}>
                        Terms
                      </Text>
                      <Text style={styles.txt}>
                        * Active Affiliate - Active members of your referral
                        network.
                      </Text>
                      <Text style={styles.txt}>
                        * AFS Bonus - Advanced Fee Share Bonus
                      </Text>
                      <Text style={styles.txt}>
                        * Total Advanced Fee Share - Accumulated AFS
                      </Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => this.onread()}
                    style={styles.readMore}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Montserrat-SemiBold',
                      }}>
                      {this.state.readbtn ? 'Read Less..' : 'Read More..'}
                    </Text>
                  </TouchableOpacity>
                </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profile: state.getprofile,
    gettaxes: state.gettaxes,
    getrefsumry: state.getrefsumry,
  };
};

export default connect(mapStateToProps)(Refertofriend);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  txt: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    marginVertical: hp('1%'),
    color: '#fff',
  },
  header: {
    height: hp('8%'),
    backgroundColor: '#00291e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('2%'),
  },
  levelCont: {
    marginHorizontal: wp('2%'),
    marginTop: hp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelImg: {
    width: 110,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 5,
    paddingHorizontal: wp('2%'),
  },
  levelText: {
    fontSize: 16,
    fontFamily: 'Montserrat-ExtraBold',
    textAlign: 'center',
    color: '#fff',
    paddingVertical: hp('0.5%'),
  },
  levelNO: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  affiliateCont: {
    backgroundColor: '#002e1f',
    borderRadius: 10,
    marginTop: hp('2%'),
    paddingHorizontal: wp('5%'),
    width: wp('90%'),
    alignSelf: 'center',
    borderWidth: 0.3,
    borderColor: '#64d25c',
    marginBottom: hp('4.5%'),
  },
  affiliateProgCont: {
    backgroundColor: '#172917',
    marginHorizontal: wp('3%'),
    marginVertical: hp('1.5%'),
    borderRadius: 8,
  },
  programText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 20,
    marginTop: hp('1%'),
  },
  linkContainer: {
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 13,
    paddingVertical: 8,
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    paddingLeft: 5,
    width:wp('85%')
  },
  coppiedText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: '#ccccff',
  },
  shareAffilate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp('5%'),
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
  },
  shareBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: hp('2%'),
    width: wp('40%'),
    height: hp('5.5%'),
    borderWidth: 1,
    backgroundColor: '#183b31',
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: '#62d45d',
  },
  readMore: {
    width: wp('27%'),
    height: hp('5%'),
    backgroundColor: '#3772ff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: hp('2%'),
  },
  afsBonusText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    right: 15,
  },
  iconText:{
    color:"#00f9f1",
    left:2,
    fontWeight:"500"
  }
});
