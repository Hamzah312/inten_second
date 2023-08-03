
import { handleTHClick, handleSearch, handleRecordsNum, handleArrowsClick, getPageNumber } from "./events.js";
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
function paginateData(filteredCountriesList, pageNumber, recordPerPage) {
  const startIndex = (pageNumber - 1) * recordPerPage;
  return filteredCountriesList.slice(startIndex, startIndex + recordPerPage);
}
function runListeners() {
  const TableHeadersElements = document.getElementsByClassName('table_header');
  for (let tableHeader of TableHeadersElements) {
    tableHeader.addEventListener('click', () => {
      handleTHClick(tableHeader.id,
        paginateData(searchData(filteredCountriesList, searchElement.value.toLocaleLowerCase()),
          getPageNumber(), Number.parseInt(recordsPerPageElement.value)))
    });
  }
  const searchElement = document.getElementById('search');
  searchElement.addEventListener('input', () => { handleSearch(filteredCountriesList, searchElement, recordsPerPageElement.value) });
  const recordsPerPageElement = document.getElementById("nums");
  recordsPerPageElement.addEventListener('change', () => {
    handleRecordsNum(recordsPerPageElement,
      searchData(filteredCountriesList, searchElement.value.toLocaleLowerCase()))
  });
  const pageArrowsElements = document.getElementsByClassName("page_numbers_arrow");
  const pageNumbersElements = document.getElementsByClassName("page_numbers");
  for (const pageArrowElement of pageArrowsElements) {
    pageArrowElement.addEventListener('click', () => {
      handleArrowsClick(searchData(filteredCountriesList, searchElement.value.toLocaleLowerCase()),pageArrowElement.id,pageNumbersElements,recordsPerPageElement.value);
    });
  }
  handleRecordsNum(recordsPerPageElement, filteredCountriesList);
}
export { fetchCountriesList, renderCountriesList, runListeners, searchData, paginateData };