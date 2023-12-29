import jwtDecode from 'jwt-decode';
import http from './httpService';
import AsyncStorage from '@react-native-async-storage/async-storage';
// {Actions} from 'react-native-router-flux';
import helpr from '../../cryptos';

const apiEndpoint = '/user';
const tokenKey = 'token';

http.setJwt(getJwt());

export async function updtk() {
  http.setJwt(getJwt());
}

export async function register(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post(apiEndpoint + '/register', {enc: userob});
  console.log(datat, 'uuuuuudatata');
  return helpr.decryptobj(datat.data);
}

export async function getnewcode(phone, type) {
  const getnewobj = helpr.encryptobj({phone});
  console.log(getnewobj, 'getnewobj');
  const {data} = await http.post(apiEndpoint + '/resendotp', {
    enc: getnewobj,
  });
  return helpr.decryptobj(data);
}

export async function updtoken() {
  const jst = await AsyncStorage.getItem(tokenKey);
  const {data: jwt} = await http.post(apiEndpoint + '/token_update', {
    enc: jst,
  });

  try {
    const code = helpr.decryptobj(jwt);
    const logobj = helpr.encryptobj(code.success);

    const da = await AsyncStorage.setItem(tokenKey, logobj);
    const codee = helpr.decryptobj(jwt);
    return jwtDecode(codee.success);
  } catch (error) {}
}

export async function loginvalidate(user) {
  zz;
  const logobj = helpr.encryptobj(user);
  const {data: jwt} = await http.post(apiEndpoint + '/login', {
    enc: logobj,
  });
  try {
    const code = helpr.decryptobj(jwt);
    const logobj = helpr.encryptobj(code.success);

    const da = await AsyncStorage.setItem(tokenKey, logobj);
  } catch (error) {}
  const codee = helpr.decryptobj(jwt);

  return jwtDecode(codee.success);
}
export async function getJwt() {
  const jst = await AsyncStorage.getItem(tokenKey);
  if (jst) {
    return jst;
  } else {
    return false;
  }
}
export async function getCurrentUser() {
  try {
    const jwt = await AsyncStorage.getItem(tokenKey);

    const codee = helpr.decrypt(jwt);

    if (codee) {
      const decoded = jwtDecode(codee);
      const datenow = Date.now() / 1000;
      if (decoded.exp > datenow) {
        return decoded;
      } else logout();
      return false;
    } else {
      return false;
    }
  } catch (ex) {
    return ex;
  }
}
export async function logout(props) {
  try {
    const ret = await AsyncStorage.removeItem(tokenKey);

    setTimeout(() => {
      //Actions.login();
      props?.navigation?.navigate('login');
    }, 500);

    return ret;
  } catch (error) {
    return error;
  }
}

export async function changepassword(obj) {
  console.log(obj, 'obj');
  const encobj = helpr.encryptobj(obj);
  console.log(encobj, 'encobj');
  const {data} = await http.post(apiEndpoint + '/change_password', {
    enc: encobj,
  });
  console.log(data, 'data');
  try {
    const code = helpr.decryptobj(data);
    console.log(code, 'code');

    // const codee = helpr.decryptobj(jwt);
    // return jwtDecode(codee.success);
  } catch (error) {}
}

export async function raiseticket(obj) {
  console.log(obj, 'obj');
  const encobj = helpr.encryptobj(obj);
  console.log(encobj, 'encobj');

  try {
    const {data} = await http.post(apiEndpoint + '/raise_ticket', {
      enc: encobj,
    });
    const code = helpr.decryptobj(data);
    console.log(code, 'code');

    // const codee = helpr.decryptobj(jwt);
    // return jwtDecode(codee.success);
  } catch (error) {}
}
export default {
  updtoken,
  updtk,
  register,
  getnewcode,
  loginvalidate,
  getCurrentUser,
  logout,
  changepassword,
  raiseticket,
};
