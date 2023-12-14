import http from './httpService';
import helpr from '../../cryptos';

// const apiEndpoint = '/member';
import jwtDecode from 'jwt-decode';

const tokenKey = 'token';

export async function backEndCallObj(route, obj) {
  http.setJwt();
  const userob = helpr.encryptobj(obj);

  const datat = await http.post(route, {enc: userob});

  return helpr.decryptobj(datat.data);
}

export async function backEndCallObjNoDcyt(route, obj) {
  http.setJwt();
  const userob = helpr.encryptobj(obj);
  const datat = await http.post(route, {enc: userob});
  return datat.data;
}

export async function backEndCall(route) {

  http.setJwt();
  const {data} = await http.post(route);
  return helpr.decryptobj(data);
}

export async function backEndCallObjNEnc(route, obj) {
  http.setJwt();
  const {data} = await http.post(route, obj);
  return helpr.decryptobj(data);
}

// export async function uptrmulims(updata) {
//   const {data} = await http.post('/kyc/forTraderKyc', updata);
//   return helpr.decryptobj(data);
// }

export default {
  backEndCall,
  backEndCallObj,
  backEndCallObjNoDcyt,
  backEndCallObjNEnc,
  //   uptrmulims,
};
