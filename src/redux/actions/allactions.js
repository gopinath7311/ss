import store from '../index';
import http from '../../services/httpService';
//import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {backEndCall} from '../../services/allService';
export var GET_PROFILE = 'GET_PROFILE';
export var UPDATE_ADMINTXES = 'UPDATE_ADMINTXES';

async function allactions() {
  setTimeout(async () => {
    try {
      await http.setJwt();

      const genmovies = await backEndCall('/user_get/universal');
      //console.log(genmovies.admin_controls, 'genmovies');
      store.dispatch({type: GET_PROFILE, payload: genmovies?.profile});
      store.dispatch({
        type: UPDATE_ADMINTXES,
        payload: genmovies?.admin_controls,
      });
    } catch (ex) {
      if (ex.response && ex.response.status) {
        Alert.alert(
          'Alert',
          'There is a Difficulty in Processing your request , Please Try Again',
          [{text: 'OK', 
          //onPress: () => Actions.splash()
        }],
          {
            cancelable: false,
          },
        );
      }
    }
  }, 100);
}

export default allactions;
