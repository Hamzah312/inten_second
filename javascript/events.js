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

    displayArrow(savedTableHeaderName);

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
    let pageNumberValuePointer = Number.parseInt(document.getElementById(elementID).innerHTML);
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
export { handleTHClick, handleSearch, handleRecordsNum, handleArrowsClick, handlePageNumberClick }