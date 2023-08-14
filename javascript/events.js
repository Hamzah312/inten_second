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

    if (pageNumberLocationPointer === 3 && ((pageNumberLastValuePointer < lastPageNumber && arrowDirectionValue == 1) || (pageNumberFirstValuePointer > 1 && arrowDirectionValue == -1))) {
        changePageNumberValues(arrowDirectionValue, lastPageNumber)
    } else {
        pageNumberLocationPointer = modifyPointerValue(pageNumberLocationPointer, arrowDirection === "right");
        displayLine(pageNumberLocationPointer);
    }
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

function displayLine(pageNumberID, arrowDirection) {// arrow direction= 1:right / -1:left

    for (let i = 0; i < 5; i++) {
        pageNumbers[i].style.textDecoration = "none";
    }

    document.getElementById(pageNumberID).style.textDecoration = "underline";
}
function changePageNumberValues(arrowDirection, lastPageNumber, incrementValue = 1) {
    if (arrowDirection == 1 && pageNumberLastValuePointer < lastPageNumber) {
        Array.from(pageNumbers).map(item => item.innerHTML = Number.parseInt(item.innerHTML) + incrementValue);
        if (incrementValue === 1) {
            pageNumberLastValuePointer++;
            pageNumberFirstValuePointer++;
        }
    }
    else if (arrowDirection == -1 && pageNumberLastValuePointer <= lastPageNumber) {
        Array.from(pageNumbers).map(item => item.innerHTML = Number.parseInt(item.innerHTML) - incrementValue);
        if (incrementValue === 1) {
            pageNumberLastValuePointer--;
            pageNumberFirstValuePointer--;
        }
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

    if ((Number.parseInt(elementID) <= 2 && pageNumberFirstValuePointer === 1) || pageNumberValuePointer >= lastPageNumber - 1) {
        pageNumberLocationPointer = Number.parseInt(elementID);
    } else {
        pageNumberLocationPointer = 3;
    }

    if (pageNumberLocationPointer === 3 && ((pageNumberLastValuePointer < lastPageNumber && arrowDirectionValue == 1) || (pageNumberFirstValuePointer > 1 && arrowDirectionValue == -1))) {
        changePageNumberValues(arrowDirectionValue, lastPageNumber, Math.abs(elementID - 3));
    }
    displayLine(pageNumberLocationPointer);

    pageNumberLastValuePointer = pageNumberValuePointer + (5 - pageNumberLocationPointer);
    pageNumberFirstValuePointer = pageNumberValuePointer - (pageNumberLocationPointer - 1);
    paginateCountriesList(pageNumberValuePointer);
}

// Local Storage Functionality
function handleCheckboxClick(checkbox, filteredCountriesList, storedCountriesList, storedCountriesBordersList) {
    let searchedName = checkbox.nextSibling.nextSibling.innerHTML;

    const clickedRecord = filteredCountriesList.find((record) => record.name === searchedName)
    const clickedRecordBorders = clickedRecord.borders;
    const countriesBordersList = reduceCountriesList(filteredCountriesList, clickedRecordBorders)

    if (checkbox.checked == true) {
        storedCountriesList.push(clickedRecord);
        for (const borderCountry of countriesBordersList) {
            if (!(storedCountriesBordersList.some(obj => obj.cca3 === borderCountry.cca3))) {
                storedCountriesBordersList.push(borderCountry);
            }
        }
    }
    else {
        let countryIndex = storedCountriesList.findIndex(item => item.name == searchedName);
        storedCountriesList.splice(countryIndex, 1);
        for (const borderCountry of countriesBordersList) {
            if ((storedCountriesBordersList.some(obj => obj.cca3 === borderCountry.cca3))) {
                let index = storedCountriesBordersList.findIndex(item => item.cca3 == borderCountry.cca3);
                storedCountriesBordersList.splice(index, 1);
            }
        }

    }

    storeInLocalStorage(storedCountriesList, storedCountriesBordersList);
}

function storeInLocalStorage(storedCountriesList, storedCountriesBordersList) {
    const storedAsString = JSON.stringify(storedCountriesList);
    localStorage.setItem("storedCountriesList", storedAsString);
    const storedBordersAsString = JSON.stringify(storedCountriesBordersList);
    localStorage.setItem("storedCountriesBordersList", storedBordersAsString);
}
// Show borders
function handleBordersButtonClick(bordersButton, bordersBox, countriesList, storedCountriesBordersList, isOnline,) {
    bordersBox.style.display = "block";

    const clickedRecord = countriesList.find((record) => record.cca3 === bordersButton.id);
    const clickedRecordBorders = clickedRecord.borders;
    let clickedBordersCountriesList;

    if (isOnline) {
        clickedBordersCountriesList = reduceCountriesList(countriesList, clickedRecordBorders);
    }
    else {
        clickedBordersCountriesList = reduceCountriesList(storedCountriesBordersList, clickedRecordBorders);
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
function reduceCountriesList(list, cca3s) {
    return list.filter(country => {
        if (cca3s)
            return cca3s.includes(country.cca3);
    });
}
export { handleTHClick, handleSearch, handleRecordsNum, handleArrowsClick, handlePageNumberClick, handleCheckboxClick, handleBordersButtonClick }