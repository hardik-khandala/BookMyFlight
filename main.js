let data;
async function fetchData() {
    data = await fetch(`data.json`);
    data = await data.json();
    demo(data);
}
fetchData();

async function demo(data) {
    let source = document.getElementById('Source');
    data.sources.forEach((item) => {
        let op = document.createElement('option');
        op.innerText = `${item.name}`;
        op.value = `${item.id}`;
        source.appendChild(op);
    });

    let destination = document.getElementById('Destinations');
    data.destinations.forEach((item) => {
        let op = document.createElement('option');
        op.innerText = `${item.name}`;
        op.value = `${item.id}`;
        destination.appendChild(op);
    });

    // Add event listeners to update flights on source or destination change
    document.getElementById('Source').addEventListener('change', () => SearchFlight(data));
    document.getElementById('Destinations').addEventListener('change', () => SearchFlight(data));

    // Also call SearchFlight initially to display default results if needed
    SearchFlight(data);
}

function SearchFlight(data) {
    const tableBody = document.querySelector('#f-list');
    tableBody.innerHTML = ""; // Clear previous results

    let src = document.getElementById('Source').value;
    let dst = document.getElementById('Destinations').value;
    let date1 = document.getElementById('dte').value;
    date1 = new Date(date1);

    for (let i = 0; i < data.flights.length; i++) {
        let souce = data.sources[data.flights[i].sourceID - 1].name;
        let dest = data.destinations[data.flights[i].destinationID - 1].name;
        let date2 = new Date(data.flights[i].departureDate);

        // Check if flight matches source, destination, and date
        if ((src == data.flights[i].sourceID || !src) &&
            (dst == data.flights[i].destinationID || !dst) &&
            date1 <= date2) {

            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${data.flights[i].name}</td>
                <td>${souce}</td>
                <td>${dest}</td>
                <td>${data.flights[i].price}</td>
                <td><button>Book</button></td>
            `;
            tableBody.appendChild(row);
        }
    }
}

function Search() {
    document.getElementById('error-src').innerText = "";
    document.getElementById('error-dst').innerText = "";
    document.getElementById('date-error').innerText = "";

    let src = document.getElementById('Source').value;
    let dst = document.getElementById('Destinations').value;

    if (!src) {
        document.getElementById('error-src').innerText = "Please Select Source :)";
    }
    if (!dst) {
        document.getElementById('error-dst').innerText = "Please Select Destination :)";
    }
}