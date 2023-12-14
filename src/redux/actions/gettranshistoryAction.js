import {backEndCall} from '../../services/allService';
import store from '../index';
import _ from 'lodash';
export var GET_TRANSACTNHIS = 'GET_TRANSACTNHIS';

async function get_transactnhis() {
  setTimeout(async () => {
    try {
      const gentxhis = await backEndCall('/user_get/gethistory');
      var dd = (gentxhis && gentxhis?.success?.DEPOSIT) || [];

      var inth = (gentxhis && gentxhis?.success?.WITHDRAW) || [];

      var buy = (gentxhis && gentxhis?.success?.NEW_STAKE) || [];

      var ss = [...inth, ...dd, ...buy];
      const gg = _.orderBy(ss, [obj => new Date(obj.createdAt)], ['desc']);
      store.dispatch({type: GET_TRANSACTNHIS, payload: gg});
      return gg;
    } catch (error) {}
  }, 100);
}

export default get_transactnhis;
