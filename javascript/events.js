import { renderData, searchData } from "./TableCreator.js";
let i = 0;
let prop = "name"
const headers = document.getElementsByClassName("table_header");
//sorting
export function handleTHClick(tableHeaderName, filteredCountriesList) {
    console.log(filteredCountriesList);
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

function displayArrow(tableHeaderName, type) {
    for (let i = 0; i < headers.length; i++) {
        if (headers[i].childNodes[1])
            headers[i].childNodes[1].innerHTML = ""
    }
    document.getElementById(tableHeaderName).childNodes[1].innerHTML = type;
}

function compare(filteredCountriesList, tableHeaderName, num) {
    const temp = Array.from(filteredCountriesList);
    temp.sort((a, b) => a[tableHeaderName] > b[tableHeaderName] ? num * 1 : num * -1);
    return temp;
}
//searching

export function handleSearch(filteredCountriesList, search) {
    setTimeout(function () {
        displayArrow(prop, "");
        renderData(searchData(filteredCountriesList, search.value.toLowerCase()));
    }, 1000);
}