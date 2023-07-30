import { handleTHClick } from "./events.js";
import { handleSearch } from "./events.js";
const originalData = [];
const filteredData = [];
export default function fetchData() {
  const apiUrl = 'https://restcountries.com/v3.1/all';
  fetch(apiUrl)
    .then(response => {
      if (!response) {
        throw new Error("something wrong")
      }
      return response.json()
    })
    .then(data => {
      filterData(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}
function filterData(fetchedData) {
  fetchedData.forEach(item => {
    const wantedItem = {};
    wantedItem.name = item.name.common;
    wantedItem.cca3 = item.cca3;
    wantedItem.capital = item.capital ? item.capital[0] : "";
    wantedItem.population = Number.parseInt(item.population);
    wantedItem.region = item.region;
    filteredData.push(wantedItem);
    originalData.push(wantedItem);
  });
  renderData(filteredData)
}
export function renderData(filteredData) {
  const tableBody = document.querySelector('#data-table tbody');
  let i = 0;
  tableBody.innerHTML = "";
  filteredData.forEach(item => {
    const row = document.createElement('tr');
    const btn = "<button>Show Borders</button>";
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
//sort
export function searchData(filteredData, subString) {
  console.log(filteredData);
  const arr = filteredData.filter((item) => {
    return item.name.toLowerCase().includes(subString) || item.cca3.toLowerCase().includes(subString) ||
      item.capital.toLowerCase().includes(subString)
      || String(item.population).includes(subString) || item.region.toLowerCase().includes(subString)
  });
  console.log(arr);
  return arr;
}
//pagination






// reset
window.addEventListener('load', function () {
  const ths = document.getElementsByClassName('table_header');
  const search = document.getElementById('search');

  for (let th of ths) {
    th.addEventListener('click', function () { handleTHClick(this.id, searchData(filteredData, search.value.toLocaleLowerCase())) });
  }
  search.addEventListener('input', function () { handleSearch(filteredData, search) });
});
