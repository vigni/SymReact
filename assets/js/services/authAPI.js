import Axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";
/**
 * Déconnexion (supression du token du localStorage et sur axios)
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete Axios.defaults.headers["Authorization"];
}
/**
 * Positionne le token jwt sur axios
 * @param {string} token
 */
function setAxiosToken(token) {
  Axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Requete http d'authentification et stockage du token
 * dansle storage et sur access
 * @param {object} credentials
 */
function authenticate(credentials) {
  return Axios.post(LOGIN_API, credentials)
    .then((response) => response.data.token)
    .then((token) => {
      window.localStorage.setItem("authToken", token);
      setAxiosToken(token);
      return true;
    });
}

/**
 * Mise en place lors du chargement de l'app
 */
function setup() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifier ou pas
 * returns boolean
 */
const isAuthenticated = () => {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
};

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
