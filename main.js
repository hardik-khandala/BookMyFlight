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

    document.getElementById('Source').addEventListener('change', () => SearchFlight(data));
    document.getElementById('Destinations').addEventListener('change', () => SearchFlight(data));
    document.getElementById('dte').addEventListener('change', () => SearchFlight(data))
    document.getElementById('search').addEventListener('input', () => SearchFlight(data));

    SearchFlight(data);
}

function SearchFlight(data) {
    const tableBody = document.querySelector('#f-list tbody');
    tableBody.innerHTML = ""; 

    let src = document.getElementById('Source').value;
    let dst = document.getElementById('Destinations').value;
    let date1 = document.getElementById('dte').value;
    let search = document.getElementById('search').value;
    date1 = new Date(date1);

    for (let i = 0; i < data.flights.length; i++) {
        let souce = data.sources[data.flights[i].sourceID - 1].name;
        let dest = data.destinations[data.flights[i].destinationID - 1].name;
        let date2 = new Date(data.flights[i].departureDate);

        if ((src == data.flights[i].sourceID || !src) &&
            (dst == data.flights[i].destinationID || !dst) &&
            date1 <= date2 && (search == data.flights[i].name || !search)){

            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${data.flights[i].name}</td>
                <td>${souce}</td>
                <td>${dest}</td>
                <td>${data.flights[i].price}</td>
                <td><button class="btn btn-primary" onclick="openBookingModal(${i}, data)">Book</button></td>
            `;
            tableBody.appendChild(row);
        }
    }
}

function openBookingModal(flightIndex, data) {
    // Get flight details
    const flight = data.flights[flightIndex];

    // Populate modal with flight details
    document.getElementById('flightName').value = flight.name;
    document.getElementById('flightPrice').value = flight.price;
    
    // Reset other fields
    document.getElementById('personName').value = '';
    document.getElementById('totalPersons').value = 1;
    calculateTotalPrice(flight.price);

    // Show the modal
    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();

    // Calculate total price on changing number of persons
    document.getElementById('totalPersons').addEventListener('input', function() {
        calculateTotalPrice(flight.price);
    });
}

function calculateTotalPrice(pricePerPerson) {
    const totalPersons = document.getElementById('totalPersons').value;
    const totalPrice = pricePerPerson * totalPersons;
    document.getElementById('totalPrice').value = totalPrice;
}

function bookFlight() {
    // Get form values
    const flightName = document.getElementById('flightName').value;
    const flightPrice = document.getElementById('flightPrice').value;
    const personName = document.getElementById('personName').value;
    const totalPersons = document.getElementById('totalPersons').value;
    const totalPrice = document.getElementById('totalPrice').value;

    if (!personName || totalPersons <= 0) {
        alert("Please fill in all the details.");
        return;
    }

    // Create a booking object
    const booking = {
        flightName: flightName,
        personName: personName,
        totalPersons: totalPersons,
        totalPrice: totalPrice
    };

    // Store booking in localStorage
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Confirmation
    alert("Flight booked successfully!");

    // Hide the modal
    const bookingModal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    bookingModal.hide();
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
