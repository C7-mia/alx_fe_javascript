const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Creativity is intelligence having fun.", category: "Creativity" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<em>No quotes available. Please add one!</em>";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"<em>${quote.text}</em>" — <strong>[${quote.category}]</strong>`;
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

    // Append all to container
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm(); // Call the form builder on load
