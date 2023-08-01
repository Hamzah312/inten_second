import { fetchData, runListeners } from "./countriesTable.js";
window.addEventListener('load', function () {
    fetchData();
    runListeners();
});
