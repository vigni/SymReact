import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import Axios from "axios";

const CustomerPage = (props) => {
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

  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Axios.post(
        "http://localhost:8001/api/customers",
        customer
      );
      console.log(customer);
      setErrors({});
    } catch (error) {
      if (error.response.data.violations) {
        const apiErrors = {};
        error.response.data.violations.forEach((violation) => {
          if (!apiErrors[violation.propertyPath]) {
            apiErrors[violation.propertyPath] = violation.message;
          }
        });
        setErrors(apiErrors);
      }
    }
  };
  return (
    <>
      <h1>Création d'un client</h1>

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
