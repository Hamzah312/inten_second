
import { handleTHClick, handleSearch, handleRecordsNum, handleArrowsClick, handlePageNumberClick, handleCheckboxClick, handleBordersButtonClick } from "./events.js";
let filteredCountriesList;
let updatedCountriesList;
let storedCountriesList = [];
let storedCountriesBordersList = [];
let recordPerPage = 10;
let searchedString = "";
let isOnline = true;
const selectHeader = document.getElementById('select');
async function fetchCountriesList() {
  storedCountriesList = JSON.parse(localStorage.getItem("storedCountriesList"));
  storedCountriesBordersList = JSON.parse(localStorage.getItem("storedCountriesBordersList"));
  if (navigator.onLine) {
    isOnline = true;
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
  } else {
    isOnline = false;
    filteredCountriesList = JSON.parse(localStorage.getItem("storedCountriesList"));
    updatedCountriesList = [...filteredCountriesList];
    renderCountriesList(filteredCountriesList);
  }
}
function filterCountriesList(fetchedData) {
  filteredCountriesList = fetchedData.map(item => ({
    name: item.name.common,
    cca3: item.cca3,
    capital: item.capital ? item.capital[0] : "",
    population: Number.parseInt(item.population),
    region: item.region,
    borders: item.borders
  }));
  updatedCountriesList = [...filteredCountriesList];
  return filteredCountriesList;
}
function renderCountriesList(updatedCountriesList) {
  const tableBody = document.querySelector('#data-table tbody');
  tableBody.innerHTML = "";
  for (const item of updatedCountriesList) {
    const row = document.createElement('tr');
    const btn = `<button id="${item.cca3}" class="borders">Show Borders</button>`;
    let checkbox;
    if (isOnline) {
      checkbox = '<input type="checkbox" class="checkbox"></input>';
      if (storedCountriesList.some(storedItem => storedItem.cca3 === item.cca3))
        checkbox = '<input type="checkbox" class="checkbox" checked></input>';
    }
    else {
      checkbox = '';
      selectHeader.style.display = 'none';
    }
    row.innerHTML = `
            ${checkbox}
            <td>${item.name}</td>
            <td>${item.cca3}</td>
            <td>${item.capital}</td>
            <td>${item.population}</td>
            <td>${item.region}</td>
            ${btn}
          `;
    tableBody.appendChild(row);
  }

  //click listener for checkboxes elements
  const checkboxes = document.getElementsByClassName("checkbox");
  for (const checkbox of checkboxes) {
    checkbox.addEventListener('click', () => {
      handleCheckboxClick(checkbox, filteredCountriesList, storedCountriesList, storedCountriesBordersList);
    });
  }

  //click listener for border buttons elements
  const bordersButtonsElements = document.getElementsByClassName("borders");
  const bordersBox = document.getElementById('borders_box');
  const closeElement = document.getElementsByClassName("close")[0];
  for (const bordersButton of bordersButtonsElements) {
    bordersButton.addEventListener('click', () => {
      handleBordersButtonClick(bordersButton, bordersBox, isOnline ? filteredCountriesList : storedCountriesList, storedCountriesBordersList, isOnline);
    });
  }
  closeElement.addEventListener('click', (event) => {
    bordersBox.style.display = "none";
  });
  window.addEventListener('click', (event) => {
    if (event.target === bordersBox) {
      bordersBox.style.display = "none";
    }
  });
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
  for (const pageArrowElement of pageArrowsElements) {
    pageArrowElement.addEventListener('click', () => {
      handleArrowsClick(updatedCountriesList, pageArrowElement.id, recordPerPage);
    });
  }

  // Click listener for the page numbers
  const pageNumbersElements = document.getElementsByClassName("page_numbers");
  for (const pageNumberElement of pageNumbersElements) {
    pageNumberElement.addEventListener('click', () => {
      handlePageNumberClick(updatedCountriesList, pageNumberElement.id, recordPerPage);
    });
  }
  reset();
}
export { fetchCountriesList, renderCountriesList, runListeners, searchCountriesList, paginateCountriesList, sortCountriesList, reset };