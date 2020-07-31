import axios from 'axios';

function findAll() {
  return axios
  .get("http://localhost:8001/api/invoices")
  .then(response => response.data["hydra:member"]);
}

function deleteInvoice(id) {
  return axios
      .delete('http://localhost:8001/api/invoices/' + id)
}

export default {
  findAll,
  delete: deleteInvoice
}