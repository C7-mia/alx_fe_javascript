let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Creativity is intelligence having fun.", category: "Creativity" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote(filteredQuotes = quotes) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "<em>No quotes available for this category. Please add one!</em>";
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>[${quote.category}]</strong>`;
    sessionStorage.setItem("lastQuoteIndex", randomIndex);
}

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
    populateCategories(); // update dropdown
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
}

function createAddQuoteForm() {
    const formContainer = document.getElementById("formContainer");

    const quoteInput = document.createElement("input");
    quoteInput.type = "text";
    quoteInput.id = "newQuoteText";
    quoteInput.placeholder = "Enter quote text";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter category";

    const addButton = document.createElement("button");
    addButton.id = "addQuote";
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
}

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

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");
            for (const q of importedQuotes) {
                if (typeof q.text !== "string" || typeof q.category !== "string") {
                    throw new Error("Invalid quote format");
                }
            }
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            alert("Quotes imported successfully!");
        } catch (err) {
            alert("Error importing quotes: " + err.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    const selected = categorySelect.value;

    // Clear previous options
    categorySelect.innerHTML = '<option value="all">All Categories</option>';

    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    uniqueCategories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });

    // Restore last filter
    const lastFilter = localStorage.getItem("selectedCategory");
    if (lastFilter) {
        categorySelect.value = lastFilter;
    } else {
        categorySelect.value = selected;
    }

    filterQuotes(); // Refresh display
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    if (selectedCategory === "all") {
        showRandomQuote(quotes);
    } else {
        const filtered = quotes.filter(q => q.category === selectedCategory);
        showRandomQuote(filtered);
    }
}

function restoreLastQuote() {
    const lastIndex = sessionStorage.getItem("lastQuoteIndex");
    const quoteDisplay = document.getElementById("quoteDisplay");
    const selectedCategory = localStorage.getItem("selectedCategory");

    const currentQuotes = (selectedCategory && selectedCategory !== "all")
        ? quotes.filter(q => q.category === selectedCategory)
        : quotes;

    if (lastIndex !== null && currentQuotes[lastIndex]) {
        const quote = currentQuotes[lastIndex];
        quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>[${quote.category}]</strong>`;
    }
}

function setup() {
    createAddQuoteForm();
    populateCategories();

    document.getElementById("newQuote").addEventListener("click", () => {
        const category = document.getElementById("categoryFilter").value;
        if (category === "all") {
            showRandomQuote(quotes);
        } else {
            const filtered = quotes.filter(q => q.category === category);
            showRandomQuote(filtered);
        }
    });

    document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);
    document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

    restoreLastQuote();
}

window.addEventListener("DOMContentLoaded", setup);
