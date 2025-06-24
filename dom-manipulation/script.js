let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { id: 1, text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { id: 2, text: "Creativity is intelligence having fun.", category: "Creativity" },
    { id: 3, text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

const serverUrl = "https://jsonplaceholder.typicode.com/posts";
const syncInterval = 30000;

// Save to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Notification display
function showNotification(message) {
    const notify = document.getElementById("notification");
    notify.innerText = message;
    notify.style.display = "block";
    setTimeout(() => notify.style.display = "none", 4000);
}

// Show random quote
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

// Add quote
function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (!newText || !newCategory) {
        alert("Please fill in both the quote and category.");
        return;
    }

    const newId = Date.now(); // unique local ID
    quotes.push({ id: newId, text: newText, category: newCategory });
    saveQuotes();
    populateCategories();
    showNotification("✅ Quote added locally.");
    textInput.value = "";
    categoryInput.value = "";
}

// Create form
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

// Export quotes
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

// Import quotes
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
            quotes.push(...importedQuotes.map(q => ({ ...q, id: Date.now() + Math.random() })));
            saveQuotes();
            populateCategories();
            showNotification("✅ Quotes imported successfully!");
        } catch (err) {
            alert("Import failed: " + err.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Populate category filter
function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    const selected = categorySelect.value;

    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    uniqueCategories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });

    const lastFilter = localStorage.getItem("selectedCategory");
    if (lastFilter) {
        categorySelect.value = lastFilter;
    } else {
        categorySelect.value = selected;
    }

    filterQuotes();
}

// Filter quotes by category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    const filtered = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    showRandomQuote(filtered);
}

// Restore last viewed quote
function restoreLastQuote() {
    const lastIndex = sessionStorage.getItem("lastQuoteIndex");
    const selectedCategory = localStorage.getItem("selectedCategory");

    const currentQuotes = selectedCategory && selectedCategory !== "all"
        ? quotes.filter(q => q.category === selectedCategory)
        : quotes;

    if (lastIndex !== null && currentQuotes[lastIndex]) {
        const quote = currentQuotes[lastIndex];
        document.getElementById("quoteDisplay").innerHTML = `"<em>${quote.text}</em>" — <strong>[${quote.category}]</strong>`;
    }
}

// ✅ Fetch from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        const serverData = await response.json();

        return serverData.slice(0, 3).map((item, index) => ({
            id: 1000 + index,
            text: item.title,
            category: "Server"
        }));
    } catch (error) {
        console.error("Failed to fetch from server:", error);
        return [];
    }
}

// ✅ Sync with server
async function syncWithServer() {
    const serverQuotes = await fetchQuotesFromServer();

    const newQuotes = serverQuotes.filter(serverQ =>
        !quotes.some(localQ => localQ.id === serverQ.id)
    );

    if (newQuotes.length > 0) {
        quotes = [...newQuotes, ...quotes];
        saveQuotes();
        populateCategories();
        showNotification("🔄 Synced with server: New quotes added.");
    }
}

// ✅ POST to server
async function sendNewQuotesToServer() {
    const unsyncedQuotes = quotes.filter(q => q.id < 1000); // Assuming only local quotes

    for (const quote of unsyncedQuotes) {
        try {
            const response = await fetch(serverUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: quote.text,
                    body: quote.category,
                    userId: 1
                })
            });

            if (response.ok) {
                console.log("Quote sent:", quote);
            } else {
                console.warn("Failed to send quote:", quote);
            }
        } catch (error) {
            console.error("POST error:", error);
        }
    }

    showNotification("📤 Quotes sent to server (simulated).");
}

// Setup app
function setup() {
    createAddQuoteForm();
    populateCategories();

    document.getElementById("newQuote").addEventListener("click", () => {
        const category = document.getElementById("categoryFilter").value;
        const filtered = category === "all"
            ? quotes
            : quotes.filter(q => q.category === category);
        showRandomQuote(filtered);
    });

    document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);
    document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

    restoreLastQuote();
    syncWithServer();
    sendNewQuotesToServer();

    setInterval(syncWithServer, syncInterval);
    setInterval(sendNewQuotesToServer, 60000); // Post every 60s
}

window.addEventListener("DOMContentLoaded", setup);
