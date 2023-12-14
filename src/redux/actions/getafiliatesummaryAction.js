import {backEndCall} from '../../services/allService';
import store from '../index';
export var GET_REFERRALSUMRY = 'GET_REFERRALSUMRY';

async function get_referalsumry() {
  setTimeout(async () => {
    try {
      const getrefsumry = await backEndCall('/user_get/ref_summary');
      var referralsum = getrefsumry && getrefsumry?.success;
      store.dispatch({type: GET_REFERRALSUMRY, payload: referralsum});
      return referralsum;
    } catch (error) {}
  }, 100);
}

export default get_referalsumry;
