import React, { useState, useEffect, setState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import Axios from "axios";
import CustomersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
  });

  const [editing, setEditing] = useState(false);

  const fetchCustomer = async (id) => {
    try {
      const { firstName, lastName, email, company } = await CustomersAPI.find(
        id
      );
      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      //TODO FLASH NOTIF EZRROR
      history.replace("/customers");
    }
  };

  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await CustomersAPI.update(id, customer);

        //TODO : flash notification succes
      } else {
        await CustomersAPI.create(customer);
        //TODO : flash notification succes
        history.replace("/customers");
      }
      setErrors({});
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          if (!apiErrors[propertyPath]) {
            apiErrors[propertyPath] = message;
          }
        });
        setErrors(apiErrors);
        //TODO : flash notification succes
      }
    }
  };
  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          value={customer.lastName}
          placeholder="Nom de famille du client"
          label="Nom de famille"
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          value={customer.firstName}
          placeholder="Prénom de famille du client"
          label="Prénom de famille"
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          value={customer.email}
          placeholder="Email du client"
          label="Email"
          type="email"
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          value={customer.company}
          placeholder="Entreprise du client"
          label="Entreprise"
          onChange={handleChange}
          error={errors.company}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
