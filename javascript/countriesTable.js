import { handleTHClick } from "./events.js";
const filteredCountriesList = [];
async function fetchData() {
  const apiUrl = 'https://restcountries.com/v3.1/all';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    filterData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
function filterData(fetchedData) {
  fetchedData.forEach(item => {
    const wantedItem = {};
    wantedItem.name = item.name.common;
    wantedItem.cca3 = item.cca3;
    wantedItem.capital = item.capital ? item.capital[0] : "";
    wantedItem.population = Number.parseInt(item.population);
    wantedItem.region = item.region;
    filteredCountriesList.push(wantedItem);
  });
  renderData(filteredCountriesList)
}
function renderData(filteredCountriesList) {
  const tableBody = document.querySelector('#data-table tbody');
  let i = 0;
  tableBody.innerHTML = "";
  filteredCountriesList.forEach(item => {
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
    i++;
  });
}
function runListeners() {
  const ths = document.getElementsByClassName('table_header');
  for (let th of ths) {
    th.addEventListener('click', function () { handleTHClick(this.id, filteredCountriesList) });
  }
}
export { fetchData, renderData, runListeners };