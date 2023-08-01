import { fetchCountriesList, runListeners,renderCountriesList } from "./countriesTable.js";
window.addEventListener('load',  ()=> {
    fetchCountriesList();
    runListeners();
});
