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
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import { NumericFormat } from 'react-number-format';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import get_profithis from '../../../../../redux/actions/getprofilthistoryAction';
import LinearGradient from 'react-native-linear-gradient';

const usdt = require('../../../../../assests/images/usdt1.png');
const usdc = require('../../../../../assests/images/cicon1.png');
const busd = require('../../../../../assests/images/busd.png');

class Rewardshistory extends Component {
  state = {
    refreshing: false,
    isModalVisible: false,
    modaldata: [],
  };

  toggleModal = async (data, colr) => {
    const obj = {
      modal: data,
      colors: colr,
    };
    await this.setState({
      isModalVisible: !this.state.isModalVisible,
      modaldata: obj,
    });
  };
async componentDidMount(){
  await get_profithis();
}
  _refresh = async () => {
    await this.setState({refreshing: true});
    setTimeout(async () => {
      await get_profithis();
      await this.setState({refreshing: false});
    }, 1000);
  };

  saveQRCode = () => {
    this.refs.viewShot.capture().then(uri => {
      var shareImageBase64 = {
        type: 'image/jpg',
        title: 'StableStake',
        message: 'StableStake Receipt',
        url: uri,
        subject: 'Share Link',
      };
      if (uri.length > 10) {
        Share.open(shareImageBase64);
      }
    });
  };

  render() {
    const prfithis = this?.props?.getprfithis;
    const {modaldata} = this.state;
    return (
      <View style={{backgroundColor:"#000000", flex:1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refresh.bind(this)}
              title="Loading..."
            />
          }>
          <View style={{flex: 1, alignItems: 'center'}}>
            {prfithis && prfithis?.length > 0 ? (
              prfithis?.map((hist, index) => {
                const clogo =
                  hist?.coin_name === 'USDT'
                    ? usdt
                    : hist?.coin_name === 'USDC'
                    ? usdc
                    : busd;
                const colors = [
                  '#fe8c49',
                  '#5998d6',
                  '#b9bbed',
                  '#e0a6a6',
                  '#e0dfa6',
                  '#e0c1a6',
                  '#a6e0c6',
                  '#e0a6d1',
                ];
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      this.toggleModal(hist, colors[index % colors.length])
                    }
                    style={{
                      width: wp('95%'),
                      height: hp('13%'),
                      backgroundColor: colors[index % colors.length],
                      marginVertical: hp('1.5%'),
                      borderRadius: 5,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 0.27,
                      shadowRadius: 4.65,
                      elevation: 6,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: wp('2%'),
                    }}>
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: 13,
                        }}>
                        Txn_ID
                      </Text>
                      <Text
                        style={{fontFamily: 'Montserrat-Medium', fontSize: 13}}>
                        {hist && hist?.t_id && hist?.t_id?.length > 10
                          ? hist?.t_id.slice(0, 10) + '...'
                          : hist?.t_id}
                      </Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: 13,
                        }}>
                        Date
                      </Text>
                      <Text
                        style={{fontFamily: 'Montserrat-Medium', fontSize: 13}}>
                        <Moment
                          format="DD/MM/YYYY"
                          //   format="DD/MM/YYYY hh:mm A"
                          element={Text}
                          fromNow>
                          {hist?.createdAt}
                        </Moment>
                      </Text>
                      <Text
                        style={{fontFamily: 'Montserrat-Medium', fontSize: 13}}>
                        <Moment format="hh:mm A" element={Text} fromNow>
                          {hist?.createdAt}
                        </Moment>
                      </Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: 13,
                        }}>
                        Amount
                      </Text>
                      <NumericFormat
                        value={hist?.amount}
                        displayType={'text'}
                        thousandSeparator={true}
                        thousandsGroupStyle={'thousand'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={value => (
                          <Text
                            style={{
                              fontFamily: 'Montserrat-SemiBold',
                              fontSize: 13,
                            }}>
                            {value}{' '}
                            <Image
                              style={{
                                width: 17,
                                height: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              source={clogo}
                              resizeMode="contain"
                            />
                          </Text>
                        )}
                      />
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: 13,
                        }}>
                        Status
                      </Text>
                      <Text
                        style={{fontFamily: 'Montserrat-Medium', fontSize: 13}}>
                        {hist?.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: hp('70%'),
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    textAlign: 'center',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  No Records Found
                </Text>
              </View>
            )}
            <Modal
              transparent={true}
              animationType="fade"
              style={styles.modalcontainer}
              //   onBackdropPress={() => this.toggleModal(modaldata)}
              isVisible={this.state.isModalVisible}>
              <View style={styles.transparentBackground}>
                <View style={styles.MoreDetailsContainer}>
                  <ViewShot
                    ref="viewShot"
                    reff="capture"
                    options={{format: 'jpg', quality: 0.9}}
                    style={{
                      backgroundColor: '#fff',
                    }}>
                    <View style={styles.TitleContainer}>
                      <View style={styles.leftContainer} />
                      <Text style={styles.Title}>Transaction Details</Text>
                      <View style={styles.rightContainer}>
                        <Icon
                          name="close"
                          size={hp('4%')}
                          color="white"
                          onPress={() => this.toggleModal(modaldata)}
                        />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.Details,
                        {backgroundColor: modaldata?.colors},
                      ]}>
                      <View style={[styles.Row, {alignItems: 'center'}]}>
                        <Text style={styles.greyText}>Amount</Text>
                        <Text style={styles.blackText}>
                          : {modaldata?.modal?.amount}{' '}
                          <Image
                            style={{
                              width: 13,
                              height: 16,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            source={
                              modaldata?.modal?.coin_name === 'USDT'
                                ? usdt
                                : modaldata?.modal?.coin_name === 'USDC'
                                ? usdc
                                : busd
                            }
                            resizeMode="contain"
                          />
                        </Text>
                      </View>

                      <View style={styles.Row}>
                        <Text style={styles.greyText}>Date</Text>
                        <Text style={styles.blackText}>
                          :{' '}
                          <Moment
                            format="DD/MM/YYYY hh:mm A"
                            element={Text}
                            fromNow>
                            {modaldata?.modal?.createdAt}
                          </Moment>
                        </Text>
                      </View>

                      <View style={styles.Row}>
                        <Text style={styles.greyText}>Transaction ID</Text>
                        <Text style={styles.blackText}>
                          : {modaldata?.modal?.t_id}
                        </Text>
                      </View>
                      <View style={styles.Row}>
                        <Text style={styles.greyText}>Contract_name</Text>
                        <Text style={styles.blackText}>
                          : {modaldata?.modal?.contract_name}
                        </Text>
                      </View>

                      <View style={styles.Row}>
                        <Text style={styles.greyText}>Type</Text>
                        <Text style={styles.blackText}>
                          : {modaldata?.modal?.type}
                        </Text>
                      </View>
                      <View style={styles.Row}>
                        <Text style={styles.greyText}>Fee</Text>
                        <Text style={styles.blackText}>
                          : {modaldata?.modal?.fee}
                        </Text>
                      </View>
                      <View style={styles.Row}>
                        <Text style={styles.greyText}>Status</Text>
                        <Text style={styles.blackText}>
                          : {modaldata?.modal?.status}
                        </Text>
                      </View>
                      <View style={styles.Row}>
                        <Text style={styles.greyText}>Comment</Text>
                        <Text style={styles.blackText}>
                          : {modaldata?.modal?.comment}
                        </Text>
                      </View>
                    </View>
                  </ViewShot>
                  <View style={styles.copysharesigninwrapper}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={this.saveQRCode}>
                      <View
                        style={[
                          styles.withdrawraisedbutton,
                          {flexDirection: 'row'},
                        ]}>
                        <Icon
                          name="share-a"
                          type="fontisto"
                          size={15}
                          color="#090932"
                        />
                        <Text style={styles.shareraisedbuttonText}>Share</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    getprfithis: state.getprfithis,
  };
};
export default connect(mapStateToProps)(Rewardshistory);

const styles = StyleSheet.create({
  modalcontainer: {
    justifyContent: 'center',
  },
  transparentBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  MoreDetailsContainer: {
    marginTop: hp('3%'),
    width: wp('90%'),
    borderRadius: wp('2.5%'),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  Details: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  TitleContainer: {
    backgroundColor: '#090932',
    width: wp('90%'),
    flexDirection: 'row',
    height: hp('10%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'green',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: wp('2%'),
  },
  Title: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2%'),
    lineHeight: hp('8%'),
    color: 'white',
    flexWrap: 'wrap',
  },
  Row: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
  },
  greyText: {
    width: wp('40%'),
    fontFamily: 'Montserrat-SemiBold',
    fontSize: hp('1.3%'),
    color: '#fff',
    // color: '#8D8D8D',
  },
  blackText: {
    width: wp('36%'),
    fontFamily: 'Montserrat-Medium',
    fontSize: hp('1.2%'),
    color: 'black',
  },
  copysharesigninwrapper: {
    alignSelf: 'center',
    width: wp('30%'),
  },
  withdrawraisedbutton: {
    backgroundColor: 'white',
    paddingVertical: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 16,
  },
  shareraisedbuttonText: {
    color: 'black',
    fontSize: wp('3.4%'),
    fontFamily: 'Montserrat-Medium',
    textTransform: 'uppercase',
  },
});




