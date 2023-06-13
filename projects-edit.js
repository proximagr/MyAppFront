window.addEventListener('DOMContentLoaded', () => {
    const customerSelect = document.getElementById('customerSelect');
    const projectSelect = document.getElementById('projectSelect');
    const paymentTableBody = document.getElementById('paymentTableBody');
  
    // Fetch the list of customers from the server
    window.archpro.fetch('/list-jusers')
      .then(response => response.json())
      .then(customers => {
        // Populate the customer select dropdown
        customers.forEach(customer => {
          const option = document.createElement('option');
          option.value = customer.id;
          option.text = customer.name;
          customerSelect.appendChild(option);
        });
      })
      .catch(error => console.error(error));
  
    // Event listener for customer selection change
    customerSelect.addEventListener('change', () => {
      const customerId = customerSelect.value;
  
      // Fetch the list of projects for the selected customer from the server
      window.archpro.fetch(`/list-customerprojects?customer_id=${customerId}`)
        .then(response => response.json())
        .then(projects => {
          // Clear project select dropdown options
          while (projectSelect.firstChild) {
            projectSelect.removeChild(projectSelect.firstChild);
          }
  
          // Populate the project select dropdown
          projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.text = project.project;
            projectSelect.appendChild(option);
          });
        })
        .catch(error => console.error(error));
    });
  
    // Event listener for project selection change
    projectSelect.addEventListener('change', () => {
      const projectId = projectSelect.value;
  
      // Fetch the list of payments for the selected project from the server
      window.archpro.fetch(`/list-projectspayments?project_id=${projectId}`)
        .then(response => response.json())
        .then(payments => {
          // Clear payment table body
          paymentTableBody.innerHTML = '';
  
          // Populate the payment table
          payments.forEach(payment => {
            const row = document.createElement('tr');
  
            const dateCell = document.createElement('td');
            dateCell.textContent = payment.date;
            row.appendChild(dateCell);
  
            const amountCell = document.createElement('td');
            amountCell.textContent = payment.payment;
            row.appendChild(amountCell);
  
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editPayment(payment.id));
            actionsCell.appendChild(editButton);
  
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deletePayment(payment.id));
            actionsCell.appendChild(deleteButton);
  
            row.appendChild(actionsCell);
  
            paymentTableBody.appendChild(row);
          });
        })
        .catch(error => console.error(error));
    });
  
    // Function to edit a payment
    function editPayment(paymentId) {
      const newAmount = prompt('Enter the new payment amount:');
      if (newAmount !== null) {
        const newDate = prompt('Enter the new payment date (YYYY-MM-DD):');
        if (newDate !== null) {
          const data = {
            amount: newAmount,
            date: newDate
          };
  
          // Send the updated payment data to the server
          window.archpro.fetch(`/update-payments/${paymentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(response => {
              if (response.ok) {
                // Payment updated successfully, refresh the payment table
                projectSelect.dispatchEvent(new Event('change'));
              } else {
                console.error('Failed to update payment');
              }
            })
            .catch(error => console.error(error));
        }
      }
    }
  
    // Function to delete a payment
    function deletePayment(paymentId) {
      if (confirm('Are you sure you want to delete this payment?')) {
        // Send the payment ID to the server for deletion
        window.archpro.fetch(`/delete-payment/${paymentId}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (response.ok) {
              // Payment deleted successfully, refresh the payment table
              projectSelect.dispatchEvent(new Event('change'));
            } else {
              console.error('Failed to delete payment');
            }
          })
          .catch(error => console.error(error));
      }
    }
  });
  