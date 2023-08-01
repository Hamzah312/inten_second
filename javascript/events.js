import { renderCountriesList } from "./countriesTable.js";
let tableHeaderCounter = 0;
let cachedTableHeaderName;
const TableHeaders = document.getElementsByClassName("table_header");
export function handleTHClick(tableHeaderName, filteredCountriesList) {
    if (tableHeaderName == cachedTableHeaderName) {
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