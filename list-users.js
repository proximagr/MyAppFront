//authentication token
const token = localStorage.getItem('token');
const headers = { 'Authorization': `Bearer ${token}` };
//end authentication token


// function to log in a user and obtain a token
async function login(username, password) {
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  const { token } = await response.json();
  localStorage.setItem('token', token);
}

// function to make an authenticated request to the server
async function makeAuthenticatedRequest(url, options) {
  const token = localStorage.getItem('token');
  if (!token) {
    // user is not authenticated, redirect to login page
    window.location.href = '/login.html';
    return;
  }
  const headers = options.headers || {};
  headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    // token is invalid, redirect to login page
    localStorage.removeItem('token');
    window.location.href = '/login.html';
    return;
  }
  return response.json();
}

// example usage: fetch a list of customers
makeAuthenticatedRequest('/list-customers')
  .then(customers => {
    // do something with the customers
  })
  .catch(error => {
    console.error(error);
  });


//end login

document.addEventListener("DOMContentLoaded", function () {
  const listUsersButton = document.querySelector("#list-users-btn");

  listUsersButton.addEventListener("click", function () {
    //add authentication
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`
    };
    //end authentication
    fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users", { headers })
      .then((response) => response.json())
      .then((data) => {
        const table = document.querySelector("#users-table");
        table.innerHTML = "";
        data.forEach((user) => {
          const row = table.insertRow();
          const idCell = row.insertCell(0);
          const nameCell = row.insertCell(0);
          idCell.innerHTML = user.id;
          nameCell.innerHTML = user.name;
        });
      })
      .catch((error) => console.error(error));
  });
});

// close users-table
document.addEventListener("DOMContentLoaded", function () {
  const closeTableButton = document.querySelector("#close-table-btn");

  closeTableButton.addEventListener("click", function () {
    const table = document.querySelector("#users-table");
    table.innerHTML = "";
  });
});
