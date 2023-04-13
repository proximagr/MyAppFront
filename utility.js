window.archpro = window.archpro || {};
window.archpro.fetch = function (url, options) {
  return fetch(url, options).then(response => {
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