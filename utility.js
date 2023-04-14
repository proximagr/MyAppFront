window.archpro.fetch = function (path, options) {
  const authToken = localStorage.getItem('authToken');
  const url = window.archpro.getApiPath(path);
  return fetch(url, { headers: { authorization: authToken }, ...options }).then(response => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 401) {
      window.location.href = 'login.html';
      return Promise.reject('Unauthorized');
    } else {
      return Promise.reject(response);
    }
  });
}
