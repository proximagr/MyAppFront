const customerSelect = document.getElementById("customer-select");
const projectSelect = document.getElementById("project-select");
const paymentTable = document.getElementById("payment-table").getElementsByTagName("tbody")[0];
const paymentTotal = document.getElementById("payment-total")
const projectPriceEl = document.getElementById("project-price")

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

  // Create edit button and attach event listener to each payment row
for (let i = 0; i < paymentTable.rows.length; i++) {
  const row = paymentTable.rows[i];
  const editCell = row.insertCell();
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", event => {
    const paymentId = event.target.dataset.paymentId;
    const paymentAmount = event.target.dataset.paymentAmount;
    const dateCell = row.cells[0];
    const amountCell = row.cells[1];
    const editCell = row.cells[2];

    // Replace date and amount cells with input fields
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = dateCell.textContent;
    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.value = paymentAmount;
    amountInput.min = 0;
    amountInput.step = 0.01;
    dateCell.innerHTML = "";
    amountCell.innerHTML = "";
    dateCell.appendChild(dateInput);
    amountCell.appendChild(amountInput);

    // Replace edit button with save and cancel buttons
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("cancel-button");
    editCell.innerHTML = "";
    editCell.appendChild(saveButton);
    editCell.appendChild(cancelButton);

    // Attach event listeners to save and cancel buttons
    saveButton.addEventListener("click", () => {
      const newDate = dateInput.value;
      const newAmount = amountInput.value;
      fetch(`http://arch.francecentral.cloudapp.azure.com:43704/edit-payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: paymentId,
          date: newDate,
          payment: newAmount
        })
      })
        .then(response => {
          if (response.ok) {
            // Replace input fields with new date and amount
            dateCell.textContent = newDate;
            amountCell.textContent = newAmount;
            // Replace save and cancel buttons with edit button
            editCell.innerHTML = "";
            editCell.appendChild(editButton);
            // Recalculate total payment
            let totalPayment = 0;
            for (let i = 0; i < paymentTable.rows.length; i++) {
              const row = paymentTable.rows[i];
              const amount = parseFloat(row.cells[1].textContent);
              if (!isNaN(amount)) {
                totalPayment += amount;
              }
            }
            paymentTotal.textContent = `Total Payment: ${totalPayment}`;
          } else {
            throw new Error("Failed to update payment");
          }
        })
        .catch(error => console.error(error));
    });

    cancelButton.addEventListener("click", () => {
      // Replace input fields with original date and amount
      dateCell.textContent = dateInput.defaultValue;
      amountCell.textContent = paymentAmount;
      // Replace save and cancel buttons with edit button
      editCell.innerHTML = "";
      editCell.appendChild(editButton);
    });
  });
  editCell.appendChild(editButton);
  editButton.dataset.paymentId = row.cells[3].textContent;
  editButton.dataset.paymentAmount = row.cells[1].textContent;
}

// Add event listeners to edit buttons
paymentTable.addEventListener("click", event => {
  if (event.target.tagName.toLowerCase() === "button") {
    const paymentRow = event.target.closest("tr");
    const paymentId = paymentRow.dataset.id;
    const paymentDate = paymentRow.cells[0].textContent;
    const paymentAmount = paymentRow.cells[1].textContent;
    const modal = document.getElementById("payment-modal");
    const paymentForm = modal.querySelector("form");
    paymentForm.elements["date"].value = paymentDate;
    paymentForm.elements["amount"].value = paymentAmount;
    paymentForm.dataset.paymentId = paymentId;
    modal.style.display = "block";
  }
});

// Add event listener to payment form
const paymentForm = document.getElementById("payment-form");
paymentForm.addEventListener("submit", event => {
  event.preventDefault();
  const paymentId = event.target.dataset.paymentId;
  const projectId = projectSelect.value;
  const paymentDate = event.target.elements["date"].value;
  const paymentAmount = event.target.elements["amount"].value;
  const payment = {
    payment: paymentAmount,
    date: paymentDate,
    project_id: projectId
  };
  if (paymentId) {
    // Edit payment
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/edit-payment?id=${paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payment)
      })
      .then(response => response.json())
      .then(() => {
        // Refresh payment table
        projectSelect.dispatchEvent(new Event("change"));
        // Close modal
        const modal = document.getElementById("payment-modal");
        modal.style.display = "none";
      })
      .catch(error => console.error(error));
  } else {
    // Add new payment
    fetch("http://arch.francecentral.cloudapp.azure.com:43704/add-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payment)
      })
      .then(response => response.json())
      .then(() => {
        // Refresh payment table
        projectSelect.dispatchEvent(new Event("change"));
        // Clear form
        event.target.reset();
      })
      .catch(error => console.error(error));
  }
});

// Add event listener to close modal button
const closeModalButton = document.getElementById("close-modal");
closeModalButton.addEventListener("click", () => {
  const modal = document.getElementById("payment-modal");
  modal.style.display = "none";
});

// Edit payment button functionality
paymentTable.addEventListener("click", event => {
	if (event.target.classList.contains("edit-btn")) {
		const row = event.target.parentNode.parentNode;
		const paymentId = row.dataset.paymentId;
		const date = row.cells[0].textContent;
		const amount = row.cells[1].textContent;
		const modal = document.getElementById("edit-modal");
		const editDate = document.getElementById("edit-date");
		const editAmount = document.getElementById("edit-amount");
		const editSubmitBtn = document.getElementById("edit-submit-btn");

		// Populate edit modal with current payment info
		editDate.value = date;
		editAmount.value = amount;

		// Save edited payment on submit
		editSubmitBtn.onclick = () => {
			const newDate = editDate.value;
			const newAmount = editAmount.value;
			if (newDate && newAmount) {
				fetch(`http://arch.francecentral.cloudapp.azure.com:43704/edit-payment?id=${paymentId}&date=${newDate}&payment=${newAmount}`)
					.then(response => response.json())
					.then(data => {
						console.log(data);
						if (data.status === "success") {
							// Update payment table with edited payment info
							row.cells[0].textContent = newDate;
							row.cells[1].textContent = newAmount;
							modal.style.display = "none";
							const alert = document.getElementById("alert-success");
							alert.style.display = "block";
							alert.textContent = "Payment successfully edited.";
							setTimeout(() => {
								alert.style.display = "none";
							}, 3000);
						} else {
							const alert = document.getElementById("alert-error");
							alert.style.display = "block";
							alert.textContent = "Error editing payment. Please try again.";
							setTimeout(() => {
								alert.style.display = "none";
							}, 3000);
						}
					})
					.catch(error => console.error(error));
			} else {
				const alert = document.getElementById("alert-error");
				alert.style.display = "block";
				alert.textContent = "Please fill out all fields.";
				setTimeout(() => {
					alert.style.display = "none";
				}, 3000);
			}
		}

		// Show edit modal
		modal.style.display = "block";
	}
});

