const appRoot = document.getElementById('app-root');

let regions = externalService.getRegionsList().map(function (region) {
    return `<option value="${region}">${region}</option>`;
});
let languages = externalService.getLanguagesList().map(function (language) {
    return `<option value="${language}">${language}</option>`;
});

const rowArea = 4;

appRoot.insertAdjacentHTML('afterbegin',
    `<header class="header">
    <h1>Countries search</h1>
    <form>
        <div class="search-item">
            <p>Please choose the type of search:</p>
            <div class="search-item_wrp">
                <label for="region">
                    <input type="radio" id="region" name="typeSearch" value="byRegion" 
                    onchange="changeTypeSearch('byRegion')">
                    By Region
                </label>
                <label for="language">
                    <input type="radio" id="language" name="typeSearch" value="byLanguage" 
                    onchange="changeTypeSearch('byLanguage')">
                    By Language
                </label>
            </div>
        </div>
        <div class="search-item">
            <p>Please choose search query:</p>
            <select disabled name="region" id="byRegion" onchange="getCountryList()">
                <option value="">Select value</option>
                ${regions}
            </select>
            <select name="language" id="byLanguage" onchange="getCountryList()" class="none">
                <option value="">Select value</option>
                ${languages}
            </select>
        </div>
    </form>
  </header>
    <main>
        <p id="emptyMessage">No items, please choose search query</p>
        <table id="countryTable" class="none">
            <thead>
             <tr>
                <th id="countryName" class="sortedCell" onclick="sortBy('country')">Country name</th>
                <th>Capital</th>
                <th>World region</th>
                <th>Languages</th>
                <th id="countryArea" class="sortedCell" onclick="sortBy('area')">Area</th>
                <th>Flag</th> 
            </tr>
            </thead>
            <tbody id="countryList"></tbody>
        </table>
    </main>`
);

let countryTable = document.getElementById('countryTable');
let countryName = document.getElementById('countryName');
let countryArea = document.getElementById('countryArea');

function changeTypeSearch(value) {
    if (value === 'byRegion') {
        document.getElementById(value).classList.remove('none');
        document.getElementById('byLanguage').classList.add('none');
        document.getElementById('byLanguage').value = '';
        document.getElementById(value).removeAttribute('disabled');
    } else {
        document.getElementById(value).classList.remove('none');
        document.getElementById('byRegion').classList.add('none');
        document.getElementById('byRegion').value = '';
    }
    getCountryList();
}

function getCountryList() {
    let radioSelected = document.querySelector('input[name="typeSearch"]:checked').value;
    let selectedType = document.getElementById(radioSelected).value;

    const fName = radioSelected === 'byRegion' ? 'getCountryListByRegion' : 'getCountryListByLanguage';
        let tableCountries = externalService[fName](selectedType).map(function (item) {
            return `<tr>
            <td>${item.name}</td>
            <td>${item.capital}</td>
            <td>${item.region}</td>
            <td>${Object.values(item.languages).join(', ')}</td>
            <td>${item.area}</td>
            <td><img src="${item.flagURL}"></td> 
        </tr>`;
        });

    if (tableCountries.length !== 0) {
        document.getElementById('countryList').innerHTML = tableCountries.join('');
        document.getElementById('emptyMessage').classList.add('none');
        document.getElementById('countryTable').classList.remove('none');
    } else {
        document.getElementById('countryTable').classList.add('none');
        document.getElementById('emptyMessage').classList.remove('none');
    }

    sortByCountryName();
}

function sortByCountryName() {
    let sortedRows = Array.from(countryTable.rows)
                .slice(1)
                .sort((rowA, rowB) => rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? 1 : -1);
    countryTable.tBodies[0].append(...sortedRows);
    countryName.classList.add('asc');
}

function sortBy(type) {
    let sortedRows;

    if(type === 'country') {
        if(countryName.classList.contains('desc') 
            || !countryName.classList.contains('desc') 
            && !countryName.classList.contains('asc')) {
            sortedRows = Array.from(countryTable.rows)
                .slice(1)
                .sort((rowA, rowB) => rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? 1 : -1);
            countryName.classList.add('asc');
            countryName.classList.remove('desc');
            countryArea.classList.remove('asc', 'desc');
        } else {
            sortedRows = Array.from(countryTable.rows)
                .slice(1)
                .sort((rowA, rowB) => rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? -1 : 1);
            countryName.classList.add('desc');
            countryName.classList.remove('asc');
            countryArea.classList.remove('asc', 'desc');
        }
        
    } else {
        if(countryArea.classList.contains('desc') 
        || !countryArea.classList.contains('desc') 
        && !countryArea.classList.contains('asc')) {
            sortedRows = Array.from(countryTable.rows)
            .slice(1)
            .sort((rowA, rowB) =>
                rowA.cells[rowArea].innerHTML - rowB.cells[rowArea].innerHTML);
            countryArea.classList.add('asc');
            countryArea.classList.remove('desc');
            countryName.classList.remove('asc', 'desc');
        } else {
            sortedRows = Array.from(countryTable.rows)
            .slice(1)
            .sort((rowA, rowB) =>
                rowB.cells[rowArea].innerHTML - rowA.cells[rowArea].innerHTML);
            countryArea.classList.add('desc');
            countryArea.classList.remove('asc');
            countryName.classList.remove('asc', 'desc');
        }
    }
    countryTable.tBodies[0].append(...sortedRows);
}
