function fetchUsers() {
    fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users')
    .then(response => response.json())
    .then(data => {
        const table = document.createElement('table');
        const headers = Object.keys(data[0]);
        
        // create table header row
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // create table data rows
        data.forEach(user => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const cell = document.createElement('td');
            cell.textContent = user[header];
            row.appendChild(cell);
        });
        table.appendChild(row);

        // add option to select element for each customer
        const customerSelect = document.getElementById('customer-select');
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        customerSelect.appendChild(option);
      });

        // append the table to the user-list element
        const userList = document.getElementById('user-list');
        userList.appendChild(table);
    })
    .catch(error => {
        console.error(error);
    });
}

function closeTable() {
    const userList = document.getElementById('user-list');
    const table = document.querySelector('table');
    userList.removeChild(table);
  }
  
