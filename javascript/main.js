import { fetchCountriesList, runListeners } from "./countriesTable.js";
window.addEventListener('load',  async ()=> {
    await fetchCountriesList();
    runListeners();
});
