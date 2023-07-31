import { renderData } from "./countriesTable.js";
let i = 0;
let prop = "name"
const headers = document.getElementsByClassName("table_header");
export function handleTHClick(tableHeaderName, filteredCountriesList) {
    if (tableHeaderName == prop)
        i++
    else {
        i = 1;
        prop = tableHeaderName;
    }
    i = i > 2 ? 0 : i;
    switch (i) {
        case 0:
            renderData(filteredCountriesList);
            displayArrow(tableHeaderName, "");
            break;
        case 1:
            renderData(compare(filteredCountriesList, tableHeaderName, 1));
            displayArrow(tableHeaderName, "&uarr;");
            break;
        case 2:
            renderData(compare(filteredCountriesList, tableHeaderName, -1));
            displayArrow(tableHeaderName, "&darr;");
            break;
    }
}

function displayArrow(propertyName, type) {
    for (let i = 0; i < headers.length; i++) {
        if (headers[i].childNodes[1])
            headers[i].childNodes[1].innerHTML = ""
    }
    document.getElementById(propertyName).childNodes[1].innerHTML = type;
}

function compare(filteredCountriesList, propertyName, num) {
    const copyCountriesList = Array.from(filteredCountriesList);
    copyCountriesList.sort((a, b) => a[propertyName] > b[propertyName] ? num * 1 : num * -1);
    return copyCountriesList;
}