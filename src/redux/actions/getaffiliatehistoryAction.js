import {backEndCall} from '../../services/allService';
import store from '../index';
export var GET_REFERRALHIS = 'GET_REFERRALHIS';

async function get_referalhis() {
  setTimeout(async () => {
    try {
      const gentxhis = await backEndCall('/user_get/gethistory');
      //console.log(gentxhis,"red")
      var referralhis = gentxhis && gentxhis?.success?.REFERRAL;
      store.dispatch({type: GET_REFERRALHIS, payload: referralhis});
      return referralhis;
    } catch (error) {}
  }, 100);
}

export default get_referalhis;
