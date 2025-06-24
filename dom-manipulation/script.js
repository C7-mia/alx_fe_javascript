const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Creativity is intelligence having fun.", category: "Creativity" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length === 0) {
        quoteDisplay.innerText = "No quotes available. Please add one!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerText = `"${quote.text}" — [${quote.category}]`;
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
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
