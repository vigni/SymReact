import axios from "axios";

function findAll() {
  return axios
    .get("http://localhost:8001/api/invoices")
    .then((response) => response.data["hydra:member"]);
}

function deleteInvoice(id) {
  return axios.delete("http://localhost:8001/api/invoices/" + id);
}

function find(id) {
  return axios
    .get("http://localhost:8001/api/invoices/" + id)
    .then((response) => response.data);
}

function update(id, invoice) {
  return axios.put("http://localhost:8001/api/invoices/" + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

function create(invoice) {
  return axios.post("http://localhost:8001/api/invoices", {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}
export default {
  findAll,
  delete: deleteInvoice,
  find,
  update,
  create,
};
