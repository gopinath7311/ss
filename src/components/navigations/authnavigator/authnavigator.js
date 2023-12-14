import React, {Component} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Register from '../../auth/register/register';
import Login from '../../auth/login/login';
import Forgot from '../../auth/forgot/forgot';
import Splash from '../../splash/splash';
import RegisterOtp from '../../auth/otps/registerotp';
import ResetPass from '../../auth/reset/reset';
import profile from '../../dashboard/sidebar/profile/profile';
import kyc from '../../auth/kyc/kyc';
import Drawernavigator from '../drawernavigator/drawernavigator';
import Fluidbottm from '../fluidbottom/fluidbottom';
import Twofaotp from '../../auth/otps/twofaotp';
import support from '../../dashboard/sidebar/support/support';
import raiseticket from '../../dashboard/sidebar/support/raiseticket';
import changepassword from '../../dashboard/sidebar/changepassword/changepassword';
import History from '../../dashboard/sidebar/history';
import TicketDetails from '../../dashboard/sidebar/support/ticketdetails';
import Factor2FA from '../../dashboard/sidebar/2FA/Factor2FA';
import Camera from '../../auth/camera/camera';
import affiliatesummaray from '../../dashboard/sidebar/refferal/affiliatesummaray';
import refertofriend from '../../dashboard/sidebar/refferal/refertofriend';
import ForgotOtp from '../../auth/otps/forgototp';

const Stack = createNativeStackNavigator();
class Authnavigator extends Component {
  state = {};
  render() {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="splash">
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="forgot" component={Forgot} />
        <Stack.Screen name="registerotp" component={RegisterOtp} />
        <Stack.Screen name="resetpass" component={ResetPass} />
        <Stack.Screen name="profile" component={profile} />
        <Stack.Screen name="2fa" component={Factor2FA} />
        <Stack.Screen name="initiatekyc" component={kyc} />
        <Stack.Screen name='forgototp' component={ForgotOtp}/>
        <Stack.Screen
          name="home"
          component={Drawernavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="bottom"
          component={Fluidbottm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="twofaotp"
          component={Twofaotp}
          options={{headerShown: false}}
        />

        <Stack.Screen name="support" component={support} />
        <Stack.Screen name="raiseticket" component={raiseticket} />
        <Stack.Screen name="changepassword" component={changepassword} />
        <Stack.Screen name="history" component={History} />
        <Stack.Screen name="ticketdetails" component={TicketDetails} />
        <Stack.Screen name="camera" component={Camera} />
        <Stack.Screen name="refer" component={affiliatesummaray} />
        <Stack.Screen name="refertofriend" component={refertofriend} />
        
      </Stack.Navigator>
    );
  }
}

export default Authnavigator;
