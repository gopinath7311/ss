import store from '../index';
import auth from '../../services/authService';
import http from '../../services/httpService';
import profileService from '../../services/profileService';
import requestService from '../../services/requestService';

export var GET_HISTORY = 'GET_HISTORY';

function get_history() {
  setTimeout(async () => {
    try {
      await http.setJwt();

      const authy = await requestService.gethistory();

      store.dispatch({type: GET_NOTIFICATIONS, payload: authy.success});
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
      }
    }
  }, 100);
}

export default get_history;
