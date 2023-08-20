import { searchCountriesList, paginateCountriesList, sortCountriesList, reset } from "./countriesTable.js";
let tableHeaderCounter = 0;
let savedTableHeaderName;
const TableHeaders = document.getElementsByClassName("table_header");
let pageNumberLocationPointer = 1;
let pageNumberLastValuePointer = 5;
let pageNumberFirstValuePointer = 1;
let pageNumberValuePointer = 1
const pageNumbers = document.getElementsByClassName("page_numbers");

// Sorting
function handleTHClick(tableHeaderName) {
    if (tableHeaderName === savedTableHeaderName) {
        tableHeaderCounter++;
    }
    else {
        tableHeaderCounter = 1;
        savedTableHeaderName = tableHeaderName;
    }
    tableHeaderCounter = tableHeaderCounter > 2 ? 0 : tableHeaderCounter;
    switch (tableHeaderCounter) {
        case 0:
            displayArrow(tableHeaderName, "");
            reSetPagination();
            reset();
            break;
        case 1:
            displayArrow("&uarr;", tableHeaderName);
            reSetPagination();
            sortCountriesList(tableHeaderName, 1);
            break;
        case 2:
            displayArrow("&darr;", tableHeaderName);
            reSetPagination();
            sortCountriesList(tableHeaderName, -1)
            break;
    }
}
function displayArrow(arrowType, tableHeaderName) {
    for (let i = 0; i < TableHeaders.length; i++) {
        if (TableHeaders[i].childNodes[1]) {
            TableHeaders[i].childNodes[1].innerHTML = "";
        }
        if (tableHeaderName) {
            document.getElementById(tableHeaderName).childNodes[1].innerHTML = arrowType;
        }
    }
}
// Searching
function handleSearch() {
    setTimeout(function () {
        displayArrow(savedTableHeaderName);
        reSetPagination();
        searchCountriesList();
        paginateCountriesList(1);
    }, 1000);
}

// Pagination
// Records per page
function handleRecordsNum() {
    displayArrow(savedTableHeaderName);
    reSetPagination();
    paginateCountriesList(1);
}

// Navigate between pages
async function handleArrowsClick(filteredCountriesList, arrowDirection, recordPerPage) {
    let lastPageNumber = Math.ceil(filteredCountriesList.length / Number.parseInt(recordPerPage));
    const arrowDirectionValue = arrowDirection === "right" ? 1 : -1;

    pageNumberValuePointer = modifyPointerValue(pageNumberValuePointer, arrowDirection === "right", pageNumberLastValuePointer);

    if ((pageNumberLocationPointer === 3) && checkFirstLastPointerValues(lastPageNumber, arrowDirectionValue)) {
        changePageNumberValues(arrowDirectionValue, lastPageNumber)
    } else {
        pageNumberLocationPointer = modifyPointerValue(pageNumberLocationPointer, arrowDirection === "right");
        displayLine(pageNumberLocationPointer);
    }

    pageNumberFirstValuePointer = Math.max(1, pageNumberValuePointer - 2);
    pageNumberLastValuePointer = Math.min(lastPageNumber, pageNumberFirstValuePointer + 4);
    paginateCountriesList(pageNumberValuePointer);
}

function modifyPointerValue(targetPointer, condition, MaxValue = 5) {
    if (condition && targetPointer < MaxValue) {
        return ++targetPointer;
    }
    if (!condition && targetPointer > 1) {
        return --targetPointer
    }
    return targetPointer;
}

function displayLine(pageNumberID) {
    for (let pageNumber = 0; pageNumber < 5; pageNumber++) {
        pageNumbers[pageNumber].style.textDecoration = "none";
    }

    pageNumbers[pageNumberID - 1].style.textDecoration = "underline";
}
function changePageNumberValues(arrowDirection, lastPageNumber, incrementValue = 1) {
    if (pageNumberFirstValuePointer > 1 || pageNumberLastValuePointer < lastPageNumber) {
        Array.from(pageNumbers).map(item => item.innerHTML = Number.parseInt(item.innerHTML) + incrementValue * arrowDirection);
    }
}
function reSetPagination() {
    pageNumberLocationPointer = 1;
    pageNumberLastValuePointer = 5;
    pageNumberFirstValuePointer = 1;
    pageNumberValuePointer = 1;
    displayLine(1, 1);
    for (let i = 0; i < 5; i++) {
        if (i == 0) {
            pageNumbers[i].style.textDecoration = "underline";
        }
        else {
            pageNumbers[i].style.textDecoration = "none";
        }
        pageNumbers[i].innerHTML = i + 1;
    }
}
function handlePageNumberClick(updatedCountriesList, elementID, recordPerPage) {
    let lastPageNumber = Math.ceil(updatedCountriesList.length / Number.parseInt(recordPerPage));
    pageNumberValuePointer = Number.parseInt(document.getElementById(elementID).innerHTML);
    let arrowDirectionValue = elementID > pageNumberLocationPointer ? 1 : -1;
    pageNumberLocationPointer = 3;

    if ((Number.parseInt(elementID) <= 2 && pageNumberFirstValuePointer === 1) || pageNumberValuePointer >= lastPageNumber - 1) {
        pageNumberLocationPointer = Number.parseInt(elementID);
    } else if (checkFirstLastPointerValues(lastPageNumber, arrowDirectionValue)) {
        changePageNumberValues(arrowDirectionValue, lastPageNumber, Math.abs(elementID - 3));
    }
    displayLine(pageNumberLocationPointer);

    pageNumberFirstValuePointer = Math.max(1, pageNumberValuePointer - 2);
    pageNumberLastValuePointer = Math.min(lastPageNumber, pageNumberFirstValuePointer + 4);
    paginateCountriesList(pageNumberValuePointer);
}

function checkFirstLastPointerValues(lastPageNumber, arrowDirectionValue) {
    return (pageNumberLastValuePointer < lastPageNumber && arrowDirectionValue == 1) || (pageNumberFirstValuePointer > 1 && arrowDirectionValue == -1)
}

// Local Storage Functionality
function handleCheckboxClick(checkbox, filteredCountriesList) {
    let searchedName = checkbox.nextSibling.nextSibling.innerHTML;

    let storedCountriesList = JSON.parse(localStorage.getItem("storedCountriesList"));
    let storedCountriesBordersList = JSON.parse(localStorage.getItem("storedCountriesBordersList"));

    const clickedRecord = filteredCountriesList.find((record) => record.name === searchedName);
    let countryIndex = storedCountriesList.findIndex(item => item.name === searchedName);
    const countriesBordersList = getBordersByCountry(filteredCountriesList, clickedRecord.borders);
    
    clickedRecord.checkbox = `<input type="checkbox" class="checkbox" ${checkbox.checked ? "checked" : ""}></input>`;
    
    checkbox.checked ? storedCountriesList.push(clickedRecord) : storedCountriesList.splice(countryIndex, 1);

    matchBorderCountries(checkbox.checked, countriesBordersList, storedCountriesBordersList);
    storeInLocalStorage(storedCountriesList, storedCountriesBordersList);
}
function matchBorderCountries(isChecked, countriesBordersList, storedCountriesBordersList) {

    for (const borderCountry of countriesBordersList) {
        const condition = isChecked ? !(storedCountriesBordersList.some(obj => obj.cca3 === borderCountry.cca3)) : (storedCountriesBordersList.some(obj => obj.cca3 === borderCountry.cca3));
        if (condition) {
            if (isChecked) {
                saveBorder(storedCountriesBordersList, borderCountry);
            } else {
                deleteBorder(storedCountriesBordersList, borderCountry);
            }
        }
    }
}
function saveBorder(storedCountriesBordersList, borderCountry) {
    storedCountriesBordersList.push(borderCountry);
}
function deleteBorder(storedCountriesBordersList, borderCountry) {
    let index = storedCountriesBordersList.findIndex(item => item.cca3 === borderCountry.cca3);
    storedCountriesBordersList.splice(index, 1);
}
function storeInLocalStorage(storedCountriesList, storedCountriesBordersList) {
    const storedAsString = JSON.stringify(storedCountriesList);
    localStorage.setItem("storedCountriesList", storedAsString);
    const storedBordersAsString = JSON.stringify(storedCountriesBordersList);
    localStorage.setItem("storedCountriesBordersList", storedBordersAsString);
}
// Show borders
function handleBordersButtonClick(bordersButton, bordersBox, countriesList, isOnline,) {
    bordersBox.style.display = "block";

    const clickedRecord = countriesList.find((record) => record.cca3 === bordersButton.id);
    const clickedRecordBorders = clickedRecord.borders;
    let clickedBordersCountriesList;
    const storedCountriesBordersList = JSON.parse(localStorage.getItem("storedCountriesBordersList"));
    if (isOnline) {
        clickedBordersCountriesList = getBordersByCountry(countriesList, clickedRecordBorders);
    }
    else {
        clickedBordersCountriesList = getBordersByCountry(storedCountriesBordersList, clickedRecordBorders);
    }

    renderModalBoxTable(clickedBordersCountriesList, clickedRecordBorders, clickedRecord.name);
}
function renderModalBoxTable(borderCountriesList, condition, countryName) {
    const countryBordersTitle = document.getElementById('modal_box_title');
    countryBordersTitle.innerHTML = ` ${countryName} Borders List`;
    const message = document.getElementById('message');
    const tableBody = document.getElementById('borders_modal_box_table_body');

    if (condition) {
        tableBody.parentElement.style.display = "table";
        message.innerHTML = "";
        tableBody.innerHTML = "";
        for (const borderCountry of borderCountriesList) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${borderCountry.name}</td>
                <td>${borderCountry.cca3}</td>
                <td>${borderCountry.region}</td>
              `;
            tableBody.appendChild(row);
        }
    }
    else {
        tableBody.parentElement.style.display = "none";
        tableBody.innerHTML = "";
        message.innerHTML = "";
        message.innerHTML = "This country does not has any borders, or data do not support it";
    }
}
function getBordersByCountry(list, cca3s) {
    if (!cca3s)
        return [];
    return list.filter(country => cca3s.includes(country.cca3));
}
export { handleTHClick, handleSearch, handleRecordsNum, handleArrowsClick, handlePageNumberClick, handleCheckboxClick, handleBordersButtonClick }