export function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages
`)
    .then(response => {
      if (!response.ok) {
        return false;
      }
      return response.json();
    })
    .then(data => {
      return data;
    });
}
