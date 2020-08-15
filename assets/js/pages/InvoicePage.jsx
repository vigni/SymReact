import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import CustomerAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });
  const { id = "new" } = match.params;

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);

  //Récupératuion des clients
  const fetchCustomers = async () => {
    try {
      const data = await CustomerAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      console.log("error:", error);
      //notif error flash
      history.replace("/invoices");
    }
  };

  //Récupératuion des factures
  const fetchInvoice = async (id) => {
    try {
      const { amount, status, customer } = await InvoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
      console.log(customer.id);
    } catch (error) {
      console.log("error:", error);
      //notif error flash
      history.replace("/invoices");
    }
  };

  //Récupération de la liste des clients à chaque chargement du composant
  useEffect(() => {
    fetchCustomers();
  }, []);

  //Récupération de la bonne facture quand l'identifiant de l'URL change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  //Gestionde la submition du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await InvoicesAPI.update(id, invoice);
        //TODO: Flash
      } else {
        const response = await InvoicesAPI.create(id); //flash notif succes
        history.replace("/invoices");
      }
    } catch ({ response }) {
      console.log(response);
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
      {(editing && <h1>Modification d'une facture</h1>) || (
        <h1>Création d'une facture</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />
        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>

        <Select
          name="status"
          label="Status"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
