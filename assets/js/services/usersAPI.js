import Axios from "axios";
import { USERS_API } from "../config";
function register(user) {
  return Axios.post(USERS_API, user);
}

export default {
  register,
};
