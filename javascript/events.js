import { renderCountriesList, searchData, paginateData } from "./countriesTable.js";
let tableHeaderCounter = 0;
let cachedTableHeaderName = "name";
const TableHeaders = document.getElementsByClassName("table_header");
let pageNumberPointer = 1;
let pageNumberLastValuePointer = 5;
let pageNumberFirstValuePointer = 1;
let pageNumberValuePointer = 1
const pageNumbers = document.getElementsByClassName("page_numbers");
//sorting
export function handleTHClick(tableHeaderName, filteredCountriesList) {
    if (tableHeaderName === cachedTableHeaderName) {
        tableHeaderCounter++
    }
    else {
        tableHeaderCounter = 1;
        cachedTableHeaderName = tableHeaderName;
    }
    tableHeaderCounter = tableHeaderCounter > 2 ? 0 : tableHeaderCounter;
    switch (tableHeaderCounter) {
        case 0:
            renderCountriesList(filteredCountriesList);
            displayArrow(tableHeaderName, "");
            break;
        case 1:
            renderCountriesList(sort(filteredCountriesList, tableHeaderName, 1));
            displayArrow(tableHeaderName, "&uarr;");
            break;
        case 2:
            renderCountriesList(sort(filteredCountriesList, tableHeaderName, -1));
            displayArrow(tableHeaderName, "&darr;");
            break;
    }
}

function displayArrow(tableHeaderName, arrowType) {
    for (let i = 0; i < TableHeaders.length; i++) {
        if (TableHeaders[i].childNodes[1])
            TableHeaders[i].childNodes[1].innerHTML = ""
    }
    document.getElementById(tableHeaderName).childNodes[1].innerHTML = arrowType;
}

function sort(filteredCountriesList, tableHeaderName, sortingOrder) {// sortingOrder=1: ASC / -1:DES
    const copyCountriesList = Array.from(filteredCountriesList);
    copyCountriesList.sort((a, b) => a[tableHeaderName] > b[tableHeaderName] ? sortingOrder * 1 : sortingOrder * -1);
    return copyCountriesList;
}

//searching
export function handleSearch(filteredCountriesList, search, recordsPerPageValue) {
    setTimeout(function () {
        displayArrow(cachedTableHeaderName, "");
        reSetPagination();
        renderCountriesList(paginateData(searchData(filteredCountriesList, search.value.toLowerCase()), 1, recordsPerPageValue));
    }, 1000);
}

//pagination
//Records per page
export function handleRecordsNum(recordsPerPage, filteredCountriesList) {
    displayArrow(cachedTableHeaderName, "");
    reSetPagination();
    renderCountriesList(paginateData(filteredCountriesList, 1, Number.parseInt(recordsPerPage.value)));
}
//navigate pages
export function handleArrowsClick(filteredCountriesList, arrowDirection, pageNumbers, recordPerPage) {
    displayArrow(cachedTableHeaderName, "");
    let lastPageNumber = filteredCountriesList.length / Number.parseInt(recordPerPage);
    let arrowDirectionValue = arrowDirection === "right" ? 1 : -1;
    arrowDirection === "right" ? (pageNumberValuePointer < pageNumberLastValuePointer ? pageNumberValuePointer++ : pageNumberValuePointer) : (pageNumberValuePointer > 1 ? pageNumberValuePointer-- : pageNumberValuePointer);
    switch (pageNumberPointer) {
        case 1:
        case 2:
        case 4:
        case 5:
            arrowDirection === "right" ? (pageNumberPointer < 5 ? pageNumberPointer++ : pageNumberPointer) : (pageNumberPointer > 1 ? pageNumberPointer-- : pageNumberPointer);
            displayLine(pageNumberPointer, arrowDirectionValue);
            break;
        case 3:
            if ((pageNumberLastValuePointer < lastPageNumber && arrowDirectionValue == 1) || (pageNumberFirstValuePointer > 1 && arrowDirectionValue == -1)) {
                changePageNumberValues(pageNumbers, arrowDirectionValue, lastPageNumber)
            }
            else {
                arrowDirection === "right" ? (pageNumberPointer < 5 ? pageNumberPointer++ : pageNumberPointer) : (pageNumberPointer > 1 ? pageNumberPointer-- : pageNumberPointer);
                displayLine(pageNumberPointer, arrowDirectionValue);
            }
            break;
    }
    renderCountriesList(paginateData(filteredCountriesList, pageNumberValuePointer, Number.parseInt(recordPerPage)));
}

function displayLine(pageNumberID, arrowDirection) {// arrow direction= 1:right / -1:left
    if (pageNumberID > 1 || arrowDirection == -1)
        document.getElementById(pageNumberID - (1 * arrowDirection)).style.textDecoration = "none";
    document.getElementById(pageNumberID).style.textDecoration = "underline";
}
function changePageNumberValues(pageNumbers, arrowDirection, lastPageNumber) {
    if (arrowDirection == 1 && pageNumberLastValuePointer < lastPageNumber) {
        Array.from(pageNumbers).map(item => item.innerHTML = Number.parseInt(item.innerHTML) + 1);
        pageNumberLastValuePointer++;
        pageNumberFirstValuePointer++;
    }
    else if (arrowDirection == -1 && pageNumberLastValuePointer <= lastPageNumber) {
        console.log("hi");
        Array.from(pageNumbers).map(item => item.innerHTML = Number.parseInt(item.innerHTML) - 1);
        pageNumberLastValuePointer--;
        pageNumberFirstValuePointer--;
    }
}
function reSetPagination() {
    pageNumberPointer = 1;
    pageNumberLastValuePointer = 5;
    pageNumberFirstValuePointer = 1;
    pageNumberValuePointer = 1
    displayLine(1, 1)
    for (let i = 0; i < 5; i++) {
        if (i == 0)
            pageNumbers[i].style.textDecoration = "underline";
        else
            pageNumbers[i].style.textDecoration = "none";
        pageNumbers[i].innerHTML = i + 1;
    }
}
export function getPageNumber() {
    return pageNumberValuePointer;
}
