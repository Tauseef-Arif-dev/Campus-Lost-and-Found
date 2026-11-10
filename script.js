
// ==========================================
// CAMPUS LOST & FOUND APPLICATION
// JavaScript Functionality
// ==========================================

// Get HTML elements
const itemForm = document.getElementById("itemForm");

const itemType = document.getElementById("itemType");
const itemName = document.getElementById("itemName");
const category = document.getElementById("category");
const locationInput = document.getElementById("location");
const contact = document.getElementById("contact");
const description = document.getElementById("description");

const itemsContainer = document.getElementById("itemsContainer");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

// Load saved items from browser storage
let items = [];

try {
    items = JSON.parse(localStorage.getItem("campusItems")) || [];
} catch (error) {
    items = [];
}

// Save items in browser storage
function saveItems() {
    localStorage.setItem("campusItems", JSON.stringify(items));
}

// Update dashboard statistics
function updateStatistics() {

    document.getElementById("totalItems").textContent =
        items.length;

    document.getElementById("lostItems").textContent =
        items.filter(item => item.type === "Lost").length;

    document.getElementById("foundItems").textContent =
        items.filter(item => item.type === "Found").length;

    document.getElementById("resolvedItems").textContent =
        items.filter(item => item.resolved).length;
}

// Display reported items
function displayItems() {

    itemsContainer.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedType = filterType.value;

    const filteredItems = items.filter(item => {

        const matchesSearch =
            item.name.toLowerCase().includes(searchText) ||
            item.category.toLowerCase().includes(searchText) ||
            item.location.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText);

        const matchesType =
            selectedType === "All" ||
            item.type === selectedType;

        return matchesSearch && matchesType;
    });

    // Show message if no items exist
    if (filteredItems.length === 0) {

        const message = document.createElement("p");

        message.id = "emptyMessage";
        message.textContent =
            items.length === 0
                ? "No items reported yet."
                : "No matching items found.";

        itemsContainer.appendChild(message);

        updateStatistics();
        return;
    }

    // Create item cards
    filteredItems.forEach(item => {

        const card = document.createElement("div");
        card.className = "item-card";

        const heading = document.createElement("h3");
        heading.textContent = item.name;

        const typeText = document.createElement("p");
        typeText.textContent = "Type: " + item.type;

        const categoryText = document.createElement("p");
        categoryText.textContent = "Category: " + item.category;

        const locationText = document.createElement("p");
        locationText.textContent = "Location: " + item.location;

        const contactText = document.createElement("p");
        contactText.textContent = "Contact: " + item.contact;

        const descriptionText = document.createElement("p");
        descriptionText.textContent =
            "Description: " + item.description;

        const dateText = document.createElement("p");
        dateText.textContent = "Reported: " + item.date;

        const statusText = document.createElement("p");
        statusText.textContent = item.resolved
            ? "Status: Resolved"
            : "Status: Active";

        // Resolve button
        const resolveButton = document.createElement("button");

        resolveButton.textContent = item.resolved
            ? "Reopen Item"
            : "Mark as Resolved";

        resolveButton.addEventListener("click", function () {

            item.resolved = !item.resolved;

            saveItems();
            displayItems();
        });

        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {

            const confirmDelete = confirm(
                "Are you sure you want to delete this report?"
            );

            if (confirmDelete) {

                items = items.filter(
                    savedItem => savedItem.id !== item.id
                );

                saveItems();
                displayItems();
            }
        });

        // Add everything to the card
        card.appendChild(heading);
        card.appendChild(typeText);
        card.appendChild(categoryText);
        card.appendChild(locationText);
        card.appendChild(contactText);
        card.appendChild(descriptionText);
        card.appendChild(dateText);
        card.appendChild(statusText);
        card.appendChild(resolveButton);
        card.appendChild(deleteButton);

        itemsContainer.appendChild(card);
    });

    updateStatistics();
}

// Submit new report
itemForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const newItem = {

        id: Date.now(),

        type: itemType.value,
        name: itemName.value.trim(),
        category: category.value,
        location: locationInput.value.trim(),
        contact: contact.value.trim(),
        description: description.value.trim(),

        date: new Date().toLocaleDateString(),

        resolved: false
    };

    // Add new item
    items.unshift(newItem);

    // Save and refresh
    saveItems();

    itemForm.reset();

    displayItems();

    alert("Your report has been submitted successfully!");
});

// Search items
searchInput.addEventListener("input", displayItems);

// Filter Lost and Found items
filterType.addEventListener("change", displayItems);

// Load existing reports when website opens
displayItems();
