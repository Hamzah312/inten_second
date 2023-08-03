
import { handleTHClick, handleSearch, handleRecordsNum } from "./events.js";
let filteredCountriesList;
let recordPerPage = 10;
let pageNumber = 1;
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
//sort
function searchData(filteredCountriesList, subString) {
  const arr = filteredCountriesList.filter((item) => {
    return item.name.toLowerCase().includes(subString) || item.cca3.toLowerCase().includes(subString) ||
      item.capital.toLowerCase().includes(subString)
      || String(item.population).includes(subString) || item.region.toLowerCase().includes(subString)
  });
  return arr;
}
//pagination
function setRecordsPerPage(recordsPerPageValue, filteredCountriesList) {
  return paginateData(filteredCountriesList, 2, recordsPerPageValue);
}

function paginateData(filteredCountriesList, pageNumber, recordPerPage) {
  const startIndex = (pageNumber - 1) * recordPerPage;
  return filteredCountriesList.slice(startIndex, startIndex + recordPerPage);
}
function runListeners() {
  const ths = document.getElementsByClassName('table_header');
  const search = document.getElementById('search');
  const recordsPerPage = document.getElementById("nums");
  const pageNumbers=document.getElementsByClassName("page_numbers_arrow");
  for (let th of ths) {
    th.addEventListener('click', function () { handleTHClick(this.id, setRecordsPerPage(Number.parseInt
      (recordsPerPage.value), searchData(filteredCountriesList, search.value.toLocaleLowerCase()))) });
  }
  search.addEventListener('input', function () { handleSearch(filteredCountriesList, search) });
  recordsPerPage.addEventListener('change', function ()
   { handleRecordsNum(recordsPerPage, searchData(filteredCountriesList, search.value.toLocaleLowerCase())) });
  
}
export { fetchCountriesList, renderCountriesList, runListeners, searchData, setRecordsPerPage, paginateData };


