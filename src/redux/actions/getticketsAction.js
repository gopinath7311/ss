import store from '../index';
import auth from '../../services/authService';
import http from '../../services/httpService';
import profileService from '../../services/profileService';
import requestService from '../../services/requestService';

export var GET_TICKETS = 'GET_TICKETS';

function get_tickets() {
  setTimeout(async () => {
    try {
      await http.setJwt();

      const authy = await requestService.gettickets();
      store.dispatch({type: GET_TICKETS, payload: authy.success});
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
      }
    }
  }, 100);
}

export default get_tickets;
