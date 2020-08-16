import React, { useState, useEffect, setState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

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
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const fetchCustomer = async (id) => {
    try {
      const { firstName, lastName, email, company } = await CustomersAPI.find(
        id
      );
      setCustomer({ firstName, lastName, email, company });
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      toast.error("Le client n'a pas pu être chargé");
      history.replace("/customers");
    }
  };

  useEffect(() => {
    if (id !== "new") {
      setLoading(true);
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
      setErrors({});
      if (editing) {
        await CustomersAPI.update(id, customer);
        toast.success("Le client a bien été modifié");
      } else {
        await CustomersAPI.create(customer);
        toast.success("Le client a bien été crée");
        history.replace("/customers");
      }
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
        toast.error("Une erreur dans votre formulaire");
      }
    }
  };
  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}
      {loading && <FormContentLoader />}
      {!loading && (
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
      )}
    </>
  );
};

export default CustomerPage;
