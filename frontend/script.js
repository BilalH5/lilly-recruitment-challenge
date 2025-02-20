// Function to fetch medicine data from the backend
function fetchMedicines() {
    fetch("http://127.0.0.1:8000/medicines") // API call
        .then(response => response.json())   // Converts response to JSON
        .then(data => displayMedicines(data.medicines)) // Sends data to display function
        .catch(error => console.error("Error fetching medicines:", error));
}

// Function to display medicines in index.html file
function displayMedicines(medicines) {
    const mainContainer = document.querySelector("main"); // Gets <main> element
    mainContainer.innerHTML = ""; // Clears existing content

    medicines.forEach(med => {
        // Handles missing data
        const name = med.name.trim() === "" ? "Unknown Name" : med.name;
        const price = med.price === null ? "Not Available" : `£${med.price.toFixed(2)}`;

        // Creates HTML structure for medicine card
        const medCard = document.createElement("div");
        medCard.classList.add("medicine-card"); // Adds CSS class for styling
        medCard.innerHTML = `
            <h2>${name}</h2>
            <p>Price: ${price}</p>
        `;

        mainContainer.appendChild(medCard); // Adds card to main section
    });
}

// Calls fetch function when page loads
document.addEventListener("DOMContentLoaded", fetchMedicines);

// Function to handle form submission
document.getElementById("medicine-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    // Gets the input values
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const message = document.getElementById("message");

    // Validates the input
    if (name === "" || price === "") {
        message.textContent = "Please enter both name and price!";
        message.style.color = "red";
        return;
    }

    // Sends data to backend
    fetch("http://127.0.0.1:8000/create", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}`
    })
    .then(response => response.json())
    .then(data => {
        message.textContent = data.message;
        message.style.color = "green";

        // Clears input fields
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";

        // Refreshes the medicines list
        fetchMedicines();
    })
    .catch(error => {
        console.error("Error adding medicine:", error);
        message.textContent = "Error adding medicine!";
        message.style.color = "red";
    });
});

// Shows or Hides Form when "Add Medicine" button is clicked
document.getElementById("open-form").addEventListener("click", function() {
    const formContainer = document.getElementById("medicine-form-container");
    formContainer.classList.toggle("hidden"); // Toggles visibility
});

// Function to fetch and display the average price
function fetchAveragePrice() {
    fetch("http://127.0.0.1:8000/average-price")
        .then(response => response.json())
        .then(data => {
            const avgPriceElement = document.getElementById("average-price");
            if (data.average_price !== undefined) {
                avgPriceElement.textContent = `Average Price: £${data.average_price}`;
            } else {
                avgPriceElement.textContent = "No valid prices available.";
            }
        })
        .catch(error => console.error("Error fetching average price:", error));
}

// Calls the function when the page loads
document.addEventListener("DOMContentLoaded", fetchAveragePrice);

// Function to filter medicines based on search input
document.getElementById("search-bar").addEventListener("input", function() {
    const searchValue = this.value.toLowerCase();
    document.querySelectorAll(".medicine-card").forEach(card => {
        const medicineName = card.querySelector("h2").textContent.toLowerCase();
        if (medicineName.includes(searchValue)) {
            card.style.display = "block";  // Shows matching results
        } else {
            card.style.display = "none";   // Hides non-matching results
        }
    });
});

window.addEventListener("scroll", function() {
    const addButton = document.querySelector(".add-medicine-container");
    const medicinesContainer = document.getElementById("medicines-container");

    // Gets the position of the last medicine card
    const lastMedicineCard = medicinesContainer.lastElementChild;
    if (!lastMedicineCard) return; // If no medicines exist, exit

    const lastMedicinePosition = lastMedicineCard.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    if (lastMedicinePosition < windowHeight) {
        addButton.classList.add("bottom"); // Moves button below last medicine card
    } else {
        addButton.classList.remove("bottom"); // Keeps button floating
    }
});

let currentMedicines = []; // Store fetched medicines for sorting

// Fetch and store medicines
function fetchMedicines() {
    fetch("http://127.0.0.1:8000/medicines")
        .then(response => response.json())
        .then(data => {
            currentMedicines = data.medicines; // Store medicines
            displayMedicines(currentMedicines);
        })
        .catch(error => console.error("Error fetching medicines:", error));
}

// Display medicines dynamically
function displayMedicines(medicines) {
    const mainContainer = document.getElementById("medicines-container");
    mainContainer.innerHTML = ""; // Clear previous content

    medicines.forEach(med => {
        const name = med.name.trim() === "" ? "Unknown Name" : med.name;
        const price = med.price === null ? "Not Available" : `£${med.price.toFixed(2)}`;

        const medCard = document.createElement("div");
        medCard.classList.add("medicine-card");
        medCard.innerHTML = `
            <h2>${name}</h2>
            <p>Price: ${price}</p>
        `;

        mainContainer.appendChild(medCard);
    });
}

// Handle sort button click
document.getElementById("sort-button").addEventListener("click", () => {
    const sortOptions = document.getElementById("sort-options");
    sortOptions.classList.toggle("show"); // Toggle dropdown
});

// Apply sorting based on selection
document.querySelectorAll(".sort-option").forEach(option => {
    option.addEventListener("click", function () {
        const sortOrder = this.getAttribute("data-sort");

        // Sort medicines based on price
        const sortedMedicines = currentMedicines.slice().sort((a, b) => {
            if (a.price === null) return 1;
            if (b.price === null) return -1;
            return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        });

        displayMedicines(sortedMedicines);

        // Close dropdown after selection
        document.getElementById("sort-options").classList.remove("show");
    });
});
