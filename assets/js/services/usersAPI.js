import Axios from "axios";

function register(user) {
  return Axios.post("http://localhost:8001/api/users", user);
}

export default {
  register,
};
