import store from '../index';
import auth from '../../services/authService';
import http from '../../services/httpService';
import profileService from '../../services/profileService';

export var GET_PROFILE = 'GET_PROFILE';

function get_profile() {
  setTimeout(async () => {
    try {
      await http.setJwt();

      const authy = await profileService.getprofile();
      store.dispatch({type: GET_PROFILE, payload: authy.success});
    } catch (error) {}
  }, 100);
}

export default get_profile;
