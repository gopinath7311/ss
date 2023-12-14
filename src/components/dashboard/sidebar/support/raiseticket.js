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
  Image,
} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import Joi from 'joi-browser';
// import Toast from 'react-native-tiny-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
//import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import get_tickets from '../../../../redux/actions/getticketsAction';
import {showToast} from '../../../../services/toastService';
import Toast from 'react-native-toast-message';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {backEndCallObj} from '../../../../services/allService';
import LinearGradient from 'react-native-linear-gradient';

const schema = {
  subject: Joi.string().min(4).max(50).required(),
  Description: Joi.string().min(20).max(150).required().label('Description'),
};

class RaiseTicket extends Component {
  state = {
    contact: this.props.auth.phone,
    subject: '',
    Description: '',
    raisebtndis: false,
    btnlodr: false,
  };

  componentDidMount() {
    get_tickets();
  }

  raiseticket = async () => {
    this.loadingButton.showLoading(true);
    const {subject, Description} = this.state;
    await this.setState({raisebtndis: true, btnlodr: true});
    let val = '';
    const validata = Joi.validate(
      {
        subject: subject,
        Description: Description,
      },
      schema,
      function (err, value) {
        if (!err) return null;
        const reter = err.details[0].message;

        val = err.details[0].context.key;
        return reter;
      },
    );
    if (!!validata) {
      showToast('error', validata);
      this.loadingButton.showLoading(false);
      setTimeout(async () => {
        await this.setState({raisebtndis: false});
      }, 2000);
    } else {
      try {
        const obj = {
          subject: this.state.subject,
          description: this.state.Description,
        };
        const datata = await backEndCallObj('user/raise_ticket', obj);
        if (datata.success) {
          showToast('success', datata.success);
          await get_tickets();
          setTimeout(async () => {
            this.props.navigation.navigate('home');
          }, 700);
        }
      } catch (ex) {
        this.loadingButton.showLoading(false);
        if (ex.response && ex.response.status === 400) {
          showToast('error', ex.response.data);
          this.loadingButton.showLoading(false);
          setTimeout(async () => {
            // await this.setState({subject: '', description: ''});
            await this.setState({raisebtndis: false, btnlodr: false});
          }, 1000);
        }
      }
    }
  };

  regvaldc = async value => {
    this.setState({contact: value});
    let na = value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    const reppo = na.replace(' ', '');
    await this.setState({contact: reppo});
  };

  wssub = async subject => {
    const subj = this.state.subject.split(' ');
    if (subj.length <= 10) {
      if (subject[0] == 0) {
        showToast('error', "Don't Enter space before subject.");
        await this.setState({subject: ''});
      } else {
        await this.setState({subject});

        let na = subject.replace(
          /[`~^|°π©℗®™√€£¥¢℅؋ƒ₼៛₡✓•△¶∆\{\}\[\]\\\/]/gi,
          '',
        );
        const reppo = na;
        await this.setState({subject: reppo});
      }
    } else {
      showToast('error', 'Subject Must be 10 Words.');
    }
  };
  wsdes = async Description => {
    const des = this.state.Description.split(' ');
    if (des.length <= 30) {
      if (Description[0] == ' ') {
        showToast('error', "Don't Enter space before Description.");
        await this.setState({Description: ''});
      } else {
        await this.setState({Description});

        let na = Description.replace(
          /[`~^|°π©℗®™√€£¥¢℅؋ƒ₼៛₡✓•△¶∆\{\}\[\]\\\/]/gi,
          '',
        );
        const reppo = na;
        await this.setState({Description: reppo});
      }
    } else {
      showToast('error', 'Description Must be 30 Words.');
    }
  };

  render() {
    return (
      <SafeAreaView>
        <LinearGradient
          colors={['#101a10', '#40b16bbe']}
          start={{x: 0.2, y: 0.2}}
          end={{x: 1, y: 0.2}}
          //locations={[0, 0.20, 0.80, 1]}

          style={{height: hp('1005'), width: wp('100%')}}>
          <View style={styles.headerCont}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
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
          <View style={{zIndex: 1}}>
            <Toast />
          </View>

          <View style={styles.container}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'NotoSerifBalinese-Regular',
                color: '#fff',
                fontSize: 25,
              }}>
              Raise Ticket
            </Text>
            <View>
            <Text style={styles.headLineText}>Subject</Text>
            <TextInput
              ref="firstname"
              returnKeyType="done"
              placeholder="Please Enter Title"
              placeholderTextColor={'#487b67'}
              onChangeText={subject => this.wssub(subject)}
              value={this.state.subject}
              style={[{height: 50}, styles.inputStyle]}
            />
</View>
            <View style={{top:10}}>
              <Text style={styles.headLineText}>Description</Text>
              <TextInput
                ref="description"
                returnKeyType="done"
                placeholder="Please Enter Description"
                placeholderTextColor={'#487b67'}
                multiline={true}
                onChangeText={Description => this.setState({Description})}
                value={this.state.Description}
                style={styles.inputStyleDescription}
              />
            </View>

            <View style={styles.ButtonWrapper}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={wp('45%')}
                height={hp('6%')}
                backgroundColor="#02d4c2"
                justifyContent="center"
                alignItems="center"
                borderRadius={10}
                titleFontFamily="Montserrat-SemiBold"
                title="Submit"
                titleFontSize={hp('2.3%')}
                titleColor="black"
                onPress={this.raiseticket.bind(this)}
              />
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(RaiseTicket);

const styles = StyleSheet.create({
  headerCont: {
    height: hp('8%'),
    backgroundColor: '#00291e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  gcontainer: {
    height: '100%',
  },
  txtview: {
    marginTop: 20,
    width: 330,
    height: 'auto',
    //backgroundColor: '#00311d',
    alignSelf: 'center',
    paddingBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 10,
    //borderWidth:1,
    //borderColor:"#10e549"
  },
  inputStyle: {
    width: wp('80%'),
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
    padding: 0,
    paddingHorizontal: wp('3%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#10e549',
    color: '#fff',
  },
  inputStyleDescription: {
    textAlignVertical: 'top',
    height: 250,
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    paddingHorizontal: 10,
    borderRadius: wp('3%'),

    borderWidth: 1,
    borderColor: '#10e549',
    color: '#fff',
    width: wp('80%'),
  },
  ButtonWrapper: {
    flexDirection: 'row',
    marginTop: hp('5%'),
    alignSelf: 'center',
    marginBottom:30
  },
  headLineText: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
    marginVertical: 5,
  },
  container: {
    padding: 15,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#030303b8',
    borderRadius: 10,
    width:wp('95%'),
    justifyContent:'center',
    alignItems:'center'
  },
});

