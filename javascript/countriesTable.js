import { handleTHClick } from "./events.js";
let filteredCountriesList ;
async function fetchCountriesList() {
  const apiUrl = 'https://restcountries.com/v3.1/all';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const countriesList = await response.json();
    renderCountriesList(filterCountriesList(countriesList));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
function filterCountriesList(fetchedData) {
  filteredCountriesList = fetchedData.map(item => ({
    name: item.name.common,
    cca3: item.cca3,
    capital: item.capital ? item.capital[0] : "",
    population: Number.parseInt(item.population),
    region: item.region
  }))
  return filteredCountriesList;
}
function renderCountriesList(filteredCountriesList) {
  const tableBody = document.querySelector('#data-table tbody');
  tableBody.innerHTML = "";
  for (const item of filteredCountriesList) {
    const row = document.createElement('tr');
    const btn = '<button class="btn">Show Borders</button>';
    row.innerHTML = `
            <input type="checkbox">
            <td>${item.name}</td>
            <td>${item.cca3}</td>
            <td>${item.capital}</td>
            <td>${item.population}</td>
            <td>${item.region}</td>
            ${btn}
          `;
    tableBody.appendChild(row);
  }
}
function runListeners() {
  const ths = document.getElementsByClassName('table_header');
  for (let th of ths) {
    th.addEventListener('click', () => { handleTHClick(th.id, filteredCountriesList) });
  }
}
export { fetchCountriesList, renderCountriesList, runListeners };