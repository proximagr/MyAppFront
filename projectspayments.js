const customerSelect = document.getElementById("customer-select");
const projectSelect = document.getElementById("project-select");
const paymentTotal = document.getElementById("payment-total")
const projectPriceEl = document.getElementById("project-price")

const paymentTable = document.getElementById("payment-table");
const paymentTableHeader = paymentTable.createTHead();

// Populate the customer dropdown
fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
	.then(response => response.json())
	.then(customers => {
		for (let customer of customers) {
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
		fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-customerprojects?customer_id=${customerId}`)
			.then(response => response.json())
			.then(projects => {
				for (let project of projects) {
					const option = document.createElement("option");
					option.value = project.id;
					option.textContent = project.project + " ($" + project.price + ")";
					projectSelect.appendChild(option);
				}
			})
			.catch(error => console.error(error));
	}
});

//function to open the modal form for edit
function openEditModal(paymentId, paymentDate, paymentAmount) {
  const editPaymentModal = document.getElementById("editPaymentModal");
  const editPaymentDateInput = document.getElementById("editPaymentDate");
  const editPaymentAmountInput = document.getElementById("editPaymentAmount");
  editPaymentDateInput.value = paymentDate;
  editPaymentAmountInput.value = paymentAmount;
  editPaymentModal.style.display = "block";
  // Add event listener to form submit button
  const editPaymentForm = document.querySelector("#editPaymentModal form");
  editPaymentForm.addEventListener("submit", event => {
    event.preventDefault();
    const newPaymentDate = editPaymentDateInput.value;
    const newPaymentAmount = editPaymentAmountInput.value;
    updatePayment(paymentId, newPaymentDate, newPaymentAmount);
    closeModal();
  });
}

function closeModal() {
  const editPaymentModal = document.getElementById("editPaymentModal");
  const editPaymentForm = document.querySelector("#editPaymentModal form");
  editPaymentForm.removeEventListener("submit", () => {});
  editPaymentModal.style.display = "none";
}
//end of function for edit

//function for update database after edit
function updatePayment(paymentId, paymentDate, paymentAmount) {
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/update-payment?id=${paymentId}&date=${paymentDate}&amount=${paymentAmount}`, {
    method: "PUT"
  })
  .then(response => {
    if (response.ok) {
      fetchPayments(projectId); // Fetch updated payments and update payment table
    } else {
      console.error("Failed to update payment.");
    }
  })
  .catch(error => console.error(error));
}
//end function to update table from edit

// Populate the payment table and project price when a project is selected
projectSelect.addEventListener("change", event => {
  const projectId = event.target.value;
  paymentTable.innerHTML = "";
  paymentTotal.textContent = "";
  if (projectId) {
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projectspayments?project_id=${projectId}`)
      .then(response => response.json())
      .then(payments => {
        let totalPayment = payments.reduce((sum, payment) => sum + payment.payment, 0);
        // Create table headers
        const headerRow = paymentTable.insertRow();
        const dateHeader = headerRow.insertCell();
        const amountHeader = headerRow.insertCell();
        const editHeader = headerRow.insertCell();
        dateHeader.textContent = "Date";
        amountHeader.textContent = "Amount";
        editHeader.textContent = "Edit";
        // Create table rows
        for (let payment of payments) {
          const row = paymentTable.insertRow();
          const dateCell = row.insertCell();
          const amountCell = row.insertCell();
          const editCell = row.insertCell();
          dateCell.textContent = payment.date;
          amountCell.textContent = payment.payment;
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", () => {
            const newDate = prompt("Enter new date:", payment.date);
            const newPayment = parseFloat(prompt("Enter new payment:", payment.payment));
            if (newDate && !isNaN(newPayment)) {
              payment.date = newDate;
              payment.payment = newPayment;
              fetch(`http://arch.francecentral.cloudapp.azure.com:43704/update-payment?id=${payment.id}&date=${newDate}&payment=${newPayment}`)
                .then(response => response.json())
                .then(updatedPayment => {
                  dateCell.textContent = updatedPayment.date;
                  amountCell.textContent = updatedPayment.payment;
                  totalPayment = payments.reduce((sum, payment) => sum + payment.payment, 0);
                  paymentTotal.textContent = `Total Payment: ${totalPayment}`;
                })
                .catch(error => console.error(error));
            }
          });
          editCell.appendChild(editButton);
        }
        paymentTotal.textContent = `Total Payment: ${totalPayment}`;

		
        // Second fetch call
        fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projects`)
          .then(response => response.json())
          .then(projects => {
            const project = projects.find(project => project.id === projectId);
            const projectPrice = project.price;
            projectPriceEl.textContent = `Project: ${projectPrice}`;
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }
});

//modal form
function openEditModal(payment) {
  // create modal form
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Edit Payment</h2>
      <form>
        <label for="date">Date:</label>
        <input type="date" id="date" name="date" value="${payment.date}">
        <br>
        <label for="payment">Payment:</label>
        <input type="number" id="payment" name="payment" value="${payment.payment}">
        <br>
        <button type="submit">Save</button>
        <button type="button" onclick="closeModal()">Cancel</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // handle form submit
  const form = modal.querySelector("form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const newDate = form.elements.date.value;
    const newPayment = form.elements.payment.value;
    updatePayment(payment.id, newDate, newPayment)
      .then(() => {
        closeModal();
        // update table row with new data
        const row = paymentTable.rows[1+payment.id]; // table rows start at index 1 because of header row
        row.cells[0].textContent = newDate;
        row.cells[1].textContent = newPayment;
        // update total payment
        const totalPayment = calculateTotalPayment();
        paymentTotal.textContent = `Total Payment: ${totalPayment}`;
      })
      .catch(error => console.error(error));
  });
}

function closeModal() {
  const modal = document.querySelector(".modal");
  modal.remove();
}
//end modal form

async function updatePayment(paymentId, newDate, newPayment) {
  const url = `http://arch.francecentral.cloudapp.azure.com:43704/update-payment?id=${paymentId}&date=${newDate}&payment=${newPayment}`;
  const response = await fetch(url, { method: "PUT" });
  if (!response.ok) {
    throw new Error("Failed to update payment");
  }
}
