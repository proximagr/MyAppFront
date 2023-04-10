// select elements
const customerSelect = document.getElementById('customer-select');
const projectSelect = document.getElementById('project-select');
const paymentTable = document.getElementById('payment-table');
const paymentAmountInput = document.getElementById('payment-amount-input');
const paymentDateInput = document.getElementById('payment-date-input');
const addPaymentBtn = document.getElementById('add-payment-btn');

// add event listeners
customerSelect.addEventListener('change', () => {
  // clear project and payment options
  projectSelect.innerHTML = '';
  paymentTable.querySelector('tbody').innerHTML = '';
  // get selected customer ID
  const customerId = customerSelect.value;
  // get projects of selected customer
  const customerProjects = projects.filter(project => project.customerId === customerId);
  // create option for each project
  customerProjects.forEach(project => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.name;
    projectSelect.appendChild(option);
  });
});

projectSelect.addEventListener('change', () => {
  // clear payment options
  paymentTable.querySelector('tbody').innerHTML = '';
  // get selected project ID
  const projectId = projectSelect.value;
  // get payments of selected project
  const projectPayments = payments.filter(payment => payment.projectId === projectId);
  // create table row for each payment
  projectPayments.forEach(payment => {
    const row = paymentTable.insertRow(-1);
    const dateCell = row.insertCell(0);
    const amountCell = row.insertCell(1);
    dateCell.textContent = payment.date;
    amountCell.textContent = payment.amount;
  });
});

addPaymentBtn.addEventListener('click', (event) => {
  event.preventDefault();
  // get selected project ID
  const projectId = projectSelect.value;
  // get input values
  const amount = parseFloat(paymentAmountInput.value);
  const date = paymentDateInput.value;
  // create new payment object
  const newPayment = {
    id: payments.length + 1,
    projectId: projectId,
    amount: amount,
    date: date
  };
  // add new payment to array
  payments.push(newPayment);
  // create table row for new payment
  const row = paymentTable.insertRow(-1);
  const dateCell = row.insertCell(0);
  const amountCell = row.insertCell(1);
  dateCell.textContent = newPayment.date;
  amountCell.textContent = newPayment.amount;
  // clear input fields
  paymentAmountInput.value = '';
  paymentDateInput.value = '';
});
