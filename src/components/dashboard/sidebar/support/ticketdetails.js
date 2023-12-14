import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Moment from 'react-moment';
// import Toast from 'react-native-tiny-toast';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header, Icon, Badge, Button} from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';
import get_tickets from '../../../../redux/actions/getticketsAction';
import requestService from '../../../../services/requestService';
import {showToast} from '../../../../services/toastService';
import Toast from 'react-native-toast-message';
import {backEndCallObj} from '../../../../services/allService';
const {width} = Dimensions.get('window');
var Joi = require('joi-browser');
const schema = Joi.object().keys({
  Reply: Joi.string().min(4).max(500).required(),
});

var radio_props = [
  {label: 'Open', value: 0},
  {label: 'Close', value: 1},
];
class TicketDetails extends Component {
  state = {
    Reply: '',
    value: 0,
    pressbutton: true,
    btndis: false,
  };
  onReply = async () => {
    await this.setState({pressbutton: false});
    const {Reply} = this.state;
    const validata = Joi.validate(
      {
        Reply: Reply,
      },
      schema,
      function (err, value) {
        if (!err) return null;
        const reter = err.details[0].message;
        return reter;
      },
    );
    if (!!validata) {
      await this.setState({errors: validata});
      showToast('error', this.state.errors);
      setTimeout(async () => {
        await this.setState({
          errors: null,
          pressbutton: true,
        });
      }, 2000);
    } else {
      const {Reply, value} = this.state;
      if (value === 0) {
        var ticketstatus = 'Open';
      } else {
        var ticketstatus = 'Close';
      }
      try {
        const ticdetils = this.props.k.k;
        const obj = {
          ticketid: ticdetils?.ticket_id,
          description: Reply,
          status: ticketstatus,
        };
        const data = await backEndCallObj('/user/comment_ticket', obj);
        // const data = await requestService.replyticket(obj);
        if (data.success) {
          showToast('success', data.success);
          await get_tickets();
          setTimeout(async () => {
            this.props.navigation.navigate("support")
          }, 700);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          await this.setState({pressbutton: true});
          await this.setState({errors: ex.response.data});
          showToast('error', this.state.errors);
          setTimeout(async () => {
            await this.setState({errors: null});
            await this.setState({Reply: null});
          }, 2000);
        }
      }
    }
  };
  wsmsg = async Reply => {
    if (Reply[0] == ' ') {
      showToast('error', "Don't Enter space before Reply.");
      await this.setState({Reply: ''});
    } else {
      this.setState({Reply: Reply});
      let na = Reply.replace(
        /[`~0-9!@#$%^&*()_|+\-=?;:'",.<>×÷⋅°π©℗®™√€£¥¢✓•△¶∆\{\}\[\]\\\/]/gi,
        '',
      );
      const reppo = na;
      await this.setState({Reply: reppo});
    }
  };
  back = async () => {
    await this.setState({btndis: true});
    this.props.navigation.navigate("support")
    setTimeout(async () => {
      await this.setState({btndis: false});
    }, 2000);
  };
  render() {
    const ticdetils = this.props.route?.params?.k?.k;
    return (
      <SafeAreaView>
        <ImageBackground
          source={require('../../../../assests/images/bg2.png')}
          style={{width: wp('100%'), height: hp('100%')}}>
          <View
            style={{
              height: hp('8%'),
              backgroundColor: '#090932',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: wp('2%'),
            }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("support")}>
              <Icon name="arrow-back" type="ionicons" size={35} color="#fff" />
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 19,
                  textTransform: 'uppercase',
                }}>
                Ticket details{' '}
              </Text>
            </View>
            <TouchableOpacity />
          </View>
          <Toast />
          <ScrollView>
            <View style={styles.whiteboxContainer}>
              <Text style={styles.GreyText}>
                Ticket No. : #{ticdetils?.ticket_id}
              </Text>
              {ticdetils?.descriptions
                .slice(0)
                .reverse()
                .map((item, index) => {
                  return (
                    <View key={index} style={styles.whiteBox}>
                      <View>
                        <Text style={[{fontSize: 10}, styles.DefaultText]}>
                        <Moment
                                element={Text}
                                fromNow
                                format="DD/MM/YYYY hh:mm A">
                                {item?.descriptions?.datetime}
                              </Moment>
                              
                        </Text>
                        <Text style={[{fontSize: 10}, styles.DefaultText]}>
                          {item?.description}
                        </Text>
                      </View>

                      <View style={{alignSelf: 'flex-end'}}>
                        <Text
                          style={[
                            {fontSize: 10, textAlign: 'right'},
                            styles.DefaultText,
                          ]}>
                          Replied by:
                        </Text>
                        <Text
                          style={[
                            {fontSize: 10, textAlign: 'right'},
                            styles.DefaultText,
                          ]}>
                          {item?.person}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              {ticdetils?.status === 'Open' ? (
                <View>
                  <View style={{marginTop: 20}}>
                    <TextInput
                      style={styles.inputStyleDescription}
                      ref="firstname"
                      returnKeyType="done"
                      onChangeText={Reply => this.wsmsg(Reply)}
                      value={this.state.Reply}
                      editable={this.state.open}
                      placeholder="Please Enter New Reply"
                      multiline={true}
                      keyboardType="visible-password"
                    />
                    <View style={{flexDirection: 'row', marginTop: hp('1%')}}>
                      <RadioForm
                        formHorizontal={true}
                        labelHorizontal={true}
                        radio_props={radio_props}
                        initial={0}
                        buttonSize={10}
                        onPress={value => {
                          this.setState({value: value});
                        }}
                        labelStyle={{marginRight: 15, marginLeft: -8}}
                      />
                    </View>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    {this.state.pressbutton ? (
                      <View>
                        <TouchableOpacity
                          style={styles.Button}
                          activeOpacity={0.5}
                          onPress={() => this.onReply()}>
                          <Text style={styles.WhiteText}>New Reply</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default TicketDetails;

const styles = StyleSheet.create({
  Label: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginTop: 15,
  },

  inputStyleDescription: {
    textAlignVertical: 'top',
    height: 150,
    width: wp('80%'),
    fontSize: 10,
    fontFamily: 'Montserrat-Medium',
    backgroundColor: '#EBEBEB',
    paddingHorizontal: 10,
    borderRadius: wp('1%'),
  },

  DefaultText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#353535',
  },

  WhiteText: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
  },

  Button: {
    marginTop: hp('3%'),
    width: wp('40%'),
    height: hp('5.4%'),
    backgroundColor: '#090932',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowOffset: {width: 1, height: 8},
    borderRadius: 10,
  },

  whiteboxContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: hp('3%'),
    justifyContent: 'space-between',
    width: wp('90%'),
    // backgroundColor: '#e2e3e7',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowOffset: {width: 1, height: 8},
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: wp('2%'),
  },

  whiteBox: {
    marginTop: 30,
    justifyContent: 'space-between',
    height: 150,
    marginTop: hp('3%'),
    width: wp('80%'),
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowOffset: {width: 1, height: 8},
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: wp('1%'),
  },

  checkboxStyle: {
    backgroundColor: 'transparent',
    marginRight: 0,
    marginLeft: 0,
    padding: 0,
    height: 20,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#353535',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('2%'),
  },
  backArrow: {
    flexDirection: 'row',
    width: wp('100%'),
    height: hp('9%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
  },

  backButtonIcon: {
    width: wp('5%'),
    height: hp('5%'),
  },

  titles: {
    color: 'white',
    padding: 12,
    fontSize: hp('2.7%'),
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: wp('20%'),
  },
});
