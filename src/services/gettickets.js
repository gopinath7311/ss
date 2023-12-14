import http from './httpService';
import helpr from '../../cryptos';
const apiEndpoint = '/ticket';

export async function gettickets() {
  console.log("called")
  const {data} = await http.post(apiEndpoint + '/gettickets');
  return helpr.decryptobj(data);
}

// export async function commentticket(commentdata) {
// 	const comobj = helpr.encryptobj(commentdata);
// 	const { data } = await http.post(apiEndpoint + '/commentticket', { enc: comobj });
// 	return helpr.decryptobj(data);
// }

// export async function insertticket(title, subject) {
// 	const instobj = helpr.encryptobj({ title: title, subject: subject });
// 	const { data } = await http.post(apiEndpoint + '/newticket', { enc: instobj });
// 	return helpr.decryptobj(data);
// }

export default {
  gettickets,
  commentticket,
  insertticket,
};
