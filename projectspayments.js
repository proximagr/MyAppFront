const customerSelect = document.getElementById("customer-select");
const projectSelect = document.getElementById("project-select");
const paymentTotal = document.getElementById("payment-total")
const projectPriceEl = document.getElementById("project-price")
const paymentTable = document.getElementById("payment-table");
const paymentTableHeader = paymentTable.createTHead();

// Populate the customer dropdown
window.archpro.fetch("/list-users")
  .then(customers => {
    for (const customer of customers) {
      const option = document.createElement("option");
      option.value = customer.id;
      option.textContent = customer.name;
      customerSelect.appendChild(option);
    }
  })
  .catch(error => console.error(error));

// Clear project and payment tables and populate the project dropdown when a customer is selected
customerSelect.addEventListener("change", event => {
  const customerId = event.target.value;
  projectSelect.innerHTML = "<option value=''>Select a project</option>";
  paymentTable.innerHTML = "";
  if (customerId) {
    window.archpro.fetch(`/list-customerprojects?customer_id=${customerId}`)
      .then(projects => {
        for (const project of projects) {
          const option = document.createElement("option");
          option.value = project.id;
          option.textContent = project.project + " ($" + project.price + ")";
          projectSelect.appendChild(option);
        }
      })
      .catch(error => console.error(error));
  }
});

// Populate the payment table and project price when a project is selected
projectSelect.addEventListener("change", event => {
  const projectId = event.target.value;
  paymentTable.innerHTML = "";
  paymentTotal.textContent = "";
  if (projectId) {
    window.archpro.fetch(`/list-projectspayments?project_id=${projectId}`)
      .then(payments => {
        const totalPayment = payments.reduce((sum, payment) => sum + payment.payment, 0);
        // Create table headers
        const headerRow = paymentTable.insertRow();
        const dateHeader = headerRow.insertCell();
        const amountHeader = headerRow.insertCell();
        const editHeader = headerRow.insertCell(); // New column for "Edit" button
        dateHeader.textContent = "Date";
        amountHeader.textContent = "Amount";
        editHeader.textContent = "Edit"; // Header text for "Edit" button column
        // Create table rows
        for (const payment of payments) {
          const row = paymentTable.insertRow();
          const dateCell = row.insertCell();
          const amountCell = row.insertCell();
          const editCell = row.insertCell(); // New column for "Edit" button
          const deleteCell = row.insertCell(); // New column for "Delete" button
          dateCell.textContent = payment.date;
          amountCell.textContent = payment.payment;
          const editButton = document.createElement("button");
          const deleteButton = document.createElement("button"); // Create a "Delete" button
          editButton.textContent = "Edit";
          deleteButton.textContent = "Delete"; // Set the text of the "Delete" button
          editButton.addEventListener("click", () => showEditForm({ ...payment, rowIndex: row.rowIndex || 0 }));
          deleteButton.addEventListener("click", () => deletePayment(payment.id, row.rowIndex)); // Add an event listener to the "Delete" button
          editCell.appendChild(editButton);
          deleteCell.appendChild(deleteButton); // Append the "Delete" button to the deleteCell
        }
        paymentTotal.textContent = `Total Payment: ${totalPayment}`;
        // Second fetch call
        window.archpro.fetch(`/list-projects`)
          .then(projects => {
            const project = projects.find(project => project.id === projectId);
            if (project) {
              const projectPrice = project.price;
              projectPriceEl.textContent = `Project: ${projectPrice}`;
            } else {
              console.error(`Project with ID ${projectId} not found`);
            }
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }
});

// Function to display the edit form
function showEditForm(paymentForm) {
  // Create the form elements
  const form = document.createElement("form");
  const dateInput = document.createElement("input");
  const amountInput = document.createElement("input");
  const submitButton = document.createElement("button");

  // Set the form properties
  form.addEventListener("submit", event => {
    event.preventDefault();
    const date = dateInput.value;
    const payment = amountInput.value;
    const paymentId = paymentForm.id;

    // Authenticate the request
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("Authentication token not found");
      return;
    }

    // Make the fetch request to update the payment
    window.archpro.fetch(`/update-payment/${paymentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken
      },
      body: JSON.stringify({
        payment: payment,
        date: new Date(date).toISOString().slice(0, 10) // convert date to ISO format (YYYY-MM-DD)
      })
    })
    
      .then(response => {
        if (!response.ok) {
          throw new Error("Error updating payment");
        }
        return response.json();
      })
      .then(updatedPayment => {
        // Update the payment in the table
        const row = paymentTable.rows[paymentForm.rowIndex];
        row.cells[0].textContent = updatedPayment.date;
        row.cells[1].textContent = updatedPayment.payment;
        // Hide the form
        form.remove();
      })
      .catch(error => console.error(error));
  });

  dateInput.type = "date";
  dateInput.value = paymentForm.date; // Populate the date field with the current date
  amountInput.type = "number";
  amountInput.value = paymentForm.payment;
  submitButton.type = "submit";
  submitButton.textContent = "Save";

  // Append the form to the table row
  const row = paymentTable.rows[paymentForm.rowIndex];
  const editCell = row.insertCell();
  editCell.appendChild(form);
  form.appendChild(dateInput);
  form.appendChild(amountInput);
  form.appendChild(submitButton);
}
//end function to display the edit form

function deletePayment(paymentId, rowIndex) {
  // Authenticate the request
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("Authentication token not found");
    return;
  }

  // Make the fetch request to delete the payment
  fetch(`/delete-payment/${paymentId}`, {
    method: "DELETE",
    headers: {
      Authorization: authToken,
    },
  })
    .then((response) => {
      if (response.ok) {
        // Remove the payment row from the table
        const row = paymentTable.rows[rowIndex];
        row.remove();
        // Display a confirmation message
        alert("Payment deleted successfully.");
        paymentTotal.textContent = `Total Payment: ${calculateTotalPayment()}`;
      } else {
        throw new Error("Error deleting payment");
      }
    })
    .catch((error) => {
      console.error("Error deleting payment:", error);
      alert("An error occurred while deleting the payment.");
    });
}
