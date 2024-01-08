import http from "./httpService";
import helpr from "../../cryptos";
import { updtoken } from "./authService";

export async function getprofile() {
  const datat = await http.post("/profile/getprofile");
  return helpr.decryptobj(datat.data);
}
export async function getlatest() {
  const datat = await http.post("/profile/getlatest20");

  return helpr.decryptobj(datat.data);
}
export async function updateprofile(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post("/profile/updateprofile", { enc: userob });

  return helpr.decryptobj(datat.data);
}
export async function updateimageview(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post("/profile/changeimgview", { enc: userob });
  updtoken();
  return helpr.decryptobj(datat.data);
}
export async function uploadimages(user) {
  const userob = helpr.encryptobj(user);

  const datat = await http.post("/profile/imgspost", { enc: userob });

  updtoken();

  return helpr.decryptobj(datat.data);
}
export async function deleteimages(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post("/profile/deleteimg", { enc: userob });
  updtoken();
  return helpr.decryptobj(datat.data);
}
export async function viewprofile(user) {
  const userob = helpr.encryptobj(user);
  const datat = await http.post("/profile/getprofilebyid", { enc: userob });

  return helpr.decryptobj(datat.data);
}
export async function getmatches(user) {
  await http.setJwt();
  const userob = helpr.encryptobj(user);
  const datat = await http.post("/profile/matchdesiredpartner", {
    enc: userob,
  });
  return helpr.decryptobj(datat.data);
}
export default {
  getprofile,
  updateprofile,
  uploadimages,
  deleteimages,
  getlatest,
  updateimageview,
  viewprofile,
  getmatches,
};
