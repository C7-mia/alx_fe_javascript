// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Creativity is intelligence having fun.", category: "Creativity" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote and save index to sessionStorage
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<em>No quotes available. Please add one!</em>";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>[${quote.category}]</strong>`;
    // Save last shown quote index to session storage
    sessionStorage.setItem("lastQuoteIndex", randomIndex);
}

// Add a new quote and save
function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (!newText || !newCategory) {
        alert("Please fill in both the quote and category.");
        return;
    }

    quotes.push({ text: newText, category: newCategory });
    saveQuotes();

    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
}

// Create form inputs and buttons dynamically
function createAddQuoteForm() {
    const formContainer = document.getElementById("formContainer");

    // Quote text input
    const quoteInput = document.createElement("input");
    quoteInput.type = "text";
    quoteInput.id = "newQuoteText";
    quoteInput.placeholder = "Enter quote text";

    // Category input
    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter category";

    // Add button
    const addButton = document.createElement("button");
    addButton.id = "addQuote";
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    // Append inputs and button to the form container
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
}

// Export quotes as JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    downloadLink.click();

    URL.revokeObjectURL(url);
}

// Import quotes from JSON file input
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);

            if (!Array.isArray(importedQuotes)) {
                alert("Invalid JSON format: Expected an array of quotes.");
                return;
            }

            // Validate imported quotes format
            for (const q of importedQuotes) {
                if (typeof q.text !== "string" || typeof q.category !== "string") {
                    alert("Invalid quote format in imported data.");
                    return;
                }
            }

            quotes.push(...importedQuotes);
            saveQuotes();
            alert("Quotes imported successfully!");
        } catch (err) {
            alert("Error parsing JSON file: " + err.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Restore last shown quote on page load (if any)
function restoreLastQuote() {
    const lastIndex = sessionStorage.getItem("lastQuoteIndex");
    const quoteDisplay = document.getElementById("quoteDisplay");

    if (lastIndex !== null && quotes[lastIndex]) {
        const quote = quotes[lastIndex];
        quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>[${quote.category}]</strong>`;
    }
}

// Setup event listeners on page load
function setup() {
    createAddQuoteForm();

    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);

    restoreLastQuote();
}

// Run setup after DOM loads
window.addEventListener("DOMContentLoaded", setup);
