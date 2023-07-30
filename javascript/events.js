import { renderData, searchData } from "./TableCreator.js";
let i = 0;
let prop = "name"
const headers = document.getElementsByClassName("table_header");
//sorting
export function handleTHClick(propertyName, filteredData) {
    console.log(filteredData);
    if (propertyName == prop)
        i++
    else {
        i = 1;
        prop = propertyName;
    }
    i = i > 2 ? 0 : i;
    switch (i) {
        case 0:
            renderData(filteredData);
            displayArrow(propertyName, "");
            break;
        case 1:
            renderData(compare(filteredData, propertyName, 1));
            displayArrow(propertyName, "&uarr;");
            break;
        case 2:
            renderData(compare(filteredData, propertyName, -1));
            displayArrow(propertyName, "&darr;");
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

function compare(filteredData, propertyName, num) {
    const temp = Array.from(filteredData);
    temp.sort((a, b) => a[propertyName] > b[propertyName] ? num * 1 : num * -1);
    return temp;
}
//searching

export function handleSearch(filteredData, search) {
    setTimeout(function () {
        displayArrow(prop, "");
        renderData(searchData(filteredData, search.value.toLowerCase()));
    }, 1000);
}