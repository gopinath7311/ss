import {backEndCall} from '../../services/allService';
import store from '../index';
export var GET_PROFITHIS = 'GET_PROFITHIS';

async function get_profithis() {
  setTimeout(async () => {
    try {
      const gentxhis = await backEndCall('/user_get/gethistory');
      //   console.log(gentxhis?.success, 'gentxhis');
      var profithis = gentxhis && gentxhis?.success?.PROFIT;
      //   console.log(profithis, 'profithis');
      //   var profithis =
      //     gentxhis &&
      //     gentxhis?.success?.length > 0 &&
      //     gentxhis?.success?.filter(o => o.type === 'PROFIT');
      //   console.log(profithis, 'profithis');
      // gentxhis.filter(o => o.type === 'DEPOSIT' || o.type === 'WITHDRAW');
      store.dispatch({type: GET_PROFITHIS, payload: profithis});
      return profithis;
    } catch (error) {}
  }, 100);
}

export default get_profithis;
