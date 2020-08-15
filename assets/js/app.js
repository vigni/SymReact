import React, { useState } from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import "../css/app.css";
import HomePage from "./pages/Homepage";
import { HashRouter, Switch, Route, withRouter } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import CustomerPage from "./pages/CustomerPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

AuthAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );
  const NavbarWithRouter = withRouter(Navbar);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      <HashRouter>
        <NavbarWithRouter />
        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/customers/:id" component={CustomerPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />
            <PrivateRoute path="/invoices/:id" component={InvoicePage} />
            <PrivateRoute path="/invoices" component={InvoicesPage} />

            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};
const rootElement = document.querySelector("#app");

ReactDOM.render(<App />, rootElement);
