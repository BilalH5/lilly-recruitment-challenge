// Function to fetch medicine data from the backend
function fetchMedicines() {
    fetch("http://127.0.0.1:8000/medicines") // API call
        .then(response => response.json())   // Convert response to JSON
        .then(data => displayMedicines(data.medicines)) // Send data to display function
        .catch(error => console.error("Error fetching medicines:", error));
}

// Function to display medicines in index.html
function displayMedicines(medicines) {
    const mainContainer = document.querySelector("main"); // Get <main> element
    mainContainer.innerHTML = ""; // Clear existing content

    medicines.forEach(med => {
        // Handle missing data
        const name = med.name.trim() === "" ? "Unknown Name" : med.name;
        const price = med.price === null ? "Not Available" : `£${med.price.toFixed(2)}`;

        // Create HTML structure for medicine card
        const medCard = document.createElement("div");
        medCard.classList.add("medicine-card"); // Add CSS class for styling
        medCard.innerHTML = `
            <h2>${name}</h2>
            <p>Price: ${price}</p>
        `;

        mainContainer.appendChild(medCard); // Add card to main section
    });
}

// Call fetch function when page loads
document.addEventListener("DOMContentLoaded", fetchMedicines);

// Function to handle form submission
document.getElementById("medicine-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    // Get input values
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const message = document.getElementById("message");

    // Validate input
    if (name === "" || price === "") {
        message.textContent = "Please enter both name and price!";
        message.style.color = "red";
        return;
    }

    // Send data to backend
    fetch("http://127.0.0.1:8000/create", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}`
    })
    .then(response => response.json())
    .then(data => {
        message.textContent = data.message;
        message.style.color = "green";

        // Clear input fields
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";

        // Refresh the medicines list
        fetchMedicines();
    })
    .catch(error => {
        console.error("Error adding medicine:", error);
        message.textContent = "Error adding medicine!";
        message.style.color = "red";
    });
});

// Show or Hide Form when "Add Medicine" button is clicked
document.getElementById("open-form").addEventListener("click", function() {
    const formContainer = document.getElementById("medicine-form-container");
    formContainer.classList.toggle("hidden"); // Toggle visibility
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

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchAveragePrice);

// Function to filter medicines based on search input
document.getElementById("search-bar").addEventListener("input", function() {
    const searchValue = this.value.toLowerCase();
    document.querySelectorAll(".medicine-card").forEach(card => {
        const medicineName = card.querySelector("h2").textContent.toLowerCase();
        if (medicineName.includes(searchValue)) {
            card.style.display = "block";  // Show matching results
        } else {
            card.style.display = "none";   // Hide non-matching results
        }
    });
});
