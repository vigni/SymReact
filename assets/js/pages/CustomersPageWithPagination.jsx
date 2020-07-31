import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = props => {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`http://localhost:8001/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
      .then(response => { 
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
        setLoading(false);
      })
      .catch(error => console.log(error.response))
  }, [currentPage])

  const handleDelete = (id) => {
    const originalCustomers = [...customers];

    setCustomers(customers.filter(customer => customer.id !== id));

    axios
      .delete('http://localhost:8001/api/customers/' + id)
      .then(response => console.log("okok"))
      .catch(error => {
        setCustomers(originalCustomers);
      })
  }

  const handlePageChanged = (page) => {
    setCurrentPage(page);
    setLoading(true);
  }


  return (
    <>
      <h1>Liste des clients (pagination)</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th>Factures</th>
            <th>Montant total</th>
            <th></th>
          </tr>
        </thead>
          <tbody>
            {loading && <tr><td>Chargement...</td></tr> }
            {!loading && customers.map(customer => 
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href="">{customer.firstName} {customer.lastName}</a>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company}</td>
              <td>
                <span className="badge badge-primary">{customer.invoices.length}</span>
                
              </td>
              <td>{customer.totalAmount.toLocaleString()} €</td>
              <td><button 
                    onClick = {() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0} 
                    className="btn btn-sm btn-danger">Supprimer</button></td>
            </tr>)}
            
          </tbody>
      </table>

      <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
      length={totalItems} onPageChanged={handlePageChanged}/>
    </>
  );
    
        
};
 
export default CustomersPageWithPagination;