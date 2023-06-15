window.archpro = window.archpro || {};

const production = false;

window.archpro.getApiPath = function(path) {
  return production ? `http://arch.francecentral.cloudapp.azure.com:43704${path}` : `http://localhost:43704${path}`;
}

window.archpro.fetch = function (path, options) {
  const authToken = localStorage.getItem('authToken');
  const url  = window.archpro.getApiPath(path)
  return fetch(url, {headers:{authorization:authToken}, ...options}).then(response => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
        return Promise.reject('Unauthorized');
    } else {
      return Promise.reject(response);
    }
  });
}