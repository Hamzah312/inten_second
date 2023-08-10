
import { handleTHClick, handleSearch, handleRecordsNum, handleArrowsClick } from "./events.js";
let filteredCountriesList;
let updatedCountriesList;
let recordPerPage = 10;
let searchedString = "";
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
  }));
  updatedCountriesList = [...filteredCountriesList];
  return filteredCountriesList;
}
function renderCountriesList(updatedCountriesList) {
  const tableBody = document.querySelector('#data-table tbody');
  tableBody.innerHTML = "";
  for (const item of updatedCountriesList) {
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
// Sort
function sortCountriesList(tableHeaderName, sortingOrder) {// sortingOrder=1: ASC / -1:DES
  updatedCountriesList.sort((a, b) => a[tableHeaderName] > b[tableHeaderName] ? sortingOrder * 1 : sortingOrder * -1);
  paginateCountriesList(1);
}

// Searching
function searchCountriesList() {
  updatedCountriesList = filteredCountriesList.filter((item) => Object.values(item).some(innerItem =>
    String(innerItem).toLocaleLowerCase().includes(searchedString)));
}

// Pagination
function paginateCountriesList(pageNumber) {
  const startIndex = (pageNumber - 1) * recordPerPage;
  renderCountriesList(updatedCountriesList.slice(startIndex, startIndex + recordPerPage));
}

// Reset
function reset() {
  searchCountriesList(searchedString);
  handleRecordsNum();
}
function runListeners() {
  // Click listeners for all table headers
  const TableHeadersElements = document.getElementsByClassName('table_header');
  for (let tableHeader of TableHeadersElements) {
    tableHeader.addEventListener('click', () => handleTHClick(tableHeader.id));
  }

  // Input listener for the search bar
  const searchElement = document.getElementById('search');
  searchElement.addEventListener('input', () => {
    searchedString = searchElement.value.toLowerCase();
    handleSearch();
  });

  // Change listener for the dropdown of records per page 
  const recordsPerPageElement = document.getElementById("nums");
  recordsPerPageElement.addEventListener('change', () => {
    recordPerPage = Number.parseInt(recordsPerPageElement.value);
    handleRecordsNum();
  });

  // Click listener for the pagination arrows
  const pageArrowsElements = document.getElementsByClassName("page_numbers_arrow");
  const pageNumbersElements = document.getElementsByClassName("page_numbers");
  for (const pageArrowElement of pageArrowsElements) {
    pageArrowElement.addEventListener('click', () => {
      handleArrowsClick(updatedCountriesList, pageArrowElement.id, recordPerPage);
    });
  }
  reset();
}
export { fetchCountriesList, renderCountriesList, runListeners, searchCountriesList, paginateCountriesList, sortCountriesList, reset };