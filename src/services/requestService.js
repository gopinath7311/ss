import http from './httpService';
import helpr from '../../cryptos';
import {updtoken} from './authService';

export async function sendreq(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post('/userauth/sendreq', {enc: userob});

  return helpr.decryptobj(datat.data);
}
export async function search(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post('/userauth/search', {enc: userob});

  return helpr.decryptobj(datat.data);
}
export async function getrequests() {
  const datat = await http.post('/userauth/getrequsent');
  return helpr.decryptobj(datat.data);
}
export async function reqstatus(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post('/userauth/acceptreject', {enc: userob});

  return helpr.decryptobj(datat.data);
}
export async function startchat(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post('/userauth/chat', {enc: userob});
  await updtoken();
  return helpr.decryptobj(datat.data);
}
export async function withdraw(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post('/userauth/withdraw', {enc: userob});
  return helpr.decryptobj(datat.data);
}
export async function getusrreq() {
  const datat = await http.post('/userauth/getrequsentugot');
  return helpr.decryptobj(datat.data);
}

export async function getspool() {
  const datat = await http.post('spool/get_spool_list');
  return helpr.decryptobj(datat.data);
}

export async function getallchats() {
  const datat = await http.post('/userauth/getallchats');

  return helpr.decryptobj(datat.data);
}
export async function getnotifications() {
  const datat = await http.post('/userauth/getnotifications');

  return helpr.decryptobj(datat.data);
}
export async function raisetick(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post('/userauth/raiseticket', {enc: userob});
  return helpr.decryptobj(datat.data);
}
export async function replyticket(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post('/userauth/replyticket', {enc: userob});
  return helpr.decryptobj(datat.data);
}
export async function gettickets() {
 
  // const datat = await http.post('/userauth/gettickets');
  const datat = await http.post('/user_get/gettickets');
  return helpr.decryptobj(datat.data);
}
export async function payment(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post('/userauth/apppayment', {enc: userob});
  await updtoken();
  return helpr.decryptobj(datat.data);
}
export async function gethistory() {
  const datat = await http.post('/userauth/gethistory');

  return helpr.decryptobj(datat.data);
}
export default {
  sendreq,
  search,
  getrequests,
  reqstatus,
  getusrreq,
  getspool,
  startchat,
  getallchats,
  getnotifications,
  withdraw,
  raisetick,
  gettickets,
  payment,
  gethistory,
  updtoken,
  replyticket,
};
