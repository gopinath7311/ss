import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-tiny-toast';
import auth from '../../services/authService';
import update_auth from '../../redux/actions/authAction';
import allactions from '../../redux/actions/allactions';

class Splash extends Component {
  state = {};

  async componentDidMount() {
    this.messageListener();
    setTimeout(async () => {
      await NetInfo.fetch().then(async state => {
        if (state.isConnected) {
          const user = await auth.getCurrentUser();
        
          if (user && user?.user_email) {
            await update_auth();
            await allactions();

            this.props.navigation.navigate('home');
          } else {
            this.props.navigation.navigate('home');

            //this.props.navigation.navigate("login")
          }
        } else {
          Alert.alert(
            'Alert',
            'Please Connect to Internet and Try Again! '[
              {
                text: 'OK',
                onPress: async () => {
                  Toast.hide();
                  BackHandler.exitApp();
                },
              }
            ],
          );
        }
      });
    }, 1000);
  }

  messageListener = async () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const {title, body} = remoteMessage.notification;
      Alert.alert(title, body);
      if (title.includes('New message')) {
        setTimeout(() => {
          get_allchat();
        }, 2000);
      } else if (title.includes('New Request')) {
        setTimeout(() => {
          get_requests();
        }, 2000);
      }
    });
    this.notificationListener = messaging().onMessage(async notification => {
      const {title, body} = notification.notification;
      Alert.alert(title, body);
      if (title.includes('New message')) {
        setTimeout(() => {
          get_allchat();
        }, 2000);
      } else if (title.includes('New Request')) {
        setTimeout(() => {
          get_requests();
        }, 2000);
      }
    });
  };

  render() {

    return (
      <SafeAreaView>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: hp('100%'),
            backgroundColor: '#041f18',
          }}>
          <Image
            style={{width: 320}}
            source={require('../../assests/images/logoname-bg.png')}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.getprofile,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Splash);

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#212627',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
