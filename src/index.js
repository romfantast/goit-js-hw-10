import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let country = e.target.value;
  if (country.trim() === '') {
    refs.listEl.innerHTML = '';
    return;
  }

  fetchCountries(country.trim()).then(data => {
    if (!data) {
      Notify.failure('Oops, there is no country with that name');
    }
    if (data.length === 1) {
      refs.listEl.innerHTML = '';
      refs.countryInfoEl.innerHTML = renderOneCountyMarkup(data);
    } else if (data.length >= 2 && data.length <= 10) {
      refs.countryInfoEl.innerHTML = '';
      refs.listEl.innerHTML = renderCountriesMarkup(data);
    } else if (data.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name');
    }
  });
}

function renderCountriesMarkup(countries) {
  const markup = countries
    .map(country => {
      return `
		<li class='country-preview'><img src='${country.flags.svg}' class='flag-country'><span class='country-name'>${country.name.official}</span></li>
		`;
    })
    .join('');

  return markup;
}

function renderOneCountyMarkup(country) {
  const markup = country
    .map(country => {
      return `
		<div class='country-card'>
			<p class='country-card__name'><img src='${
        country.flags.svg
      }' class='country-flag'><span class='country-name'><b>${
        country.name.official
      }</b></span></p>
			<p><b>Capital:</b> ${country.capital}</p>
			<p><b>Population:</b> ${country.population}</p>
			<p><b>Languages:</b> ${renderCountryLanguagesString(country.languages)}</p>
		</div>
		`;
    })
    .join('');

  return markup;
}

function renderCountryLanguagesString(country) {
  return Object.values(country).join(', ');
}
