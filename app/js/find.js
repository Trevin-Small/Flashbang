let searchInputShown = false; // Track visibility of search input
let matchCount = 0; // Initialize match count
let currentMatchIndex = 0; // Track the current match index
let matchesArray = []; // Store the matched elements

// Keydown event listener for Ctrl + F
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey && e.key === "f") || (e.metaKey && e.key === "f")) {
    e.preventDefault(); // Prevent the default browser behavior
    searchInputShown = !searchInputShown; // Toggle the search input visibility
    const searchInput = document.getElementById("search-input-bar");
    if (searchInputShown) {
      searchInput.classList.remove("hide");
      setTimeout(() => {
        searchInput.focus();
      }, 250);
      performSearch();
    } else {
      searchInput.classList.add("hide");
      clearHighlights(); // Clear highlights when hiding
      searchInput.value = ""; // Clear the input value
    }
  }

  if (searchInputShown) {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      document.getElementById("next-match").click(); // Trigger the next match button
    } else if (e.key === "ArrowUp") {
      document.getElementById("prev-match").click(); // Trigger the next match button
    }
  }
});

document
  .getElementById("search-input")
  .addEventListener("input", performSearch);

// Function to perform the search and highlight matches
function performSearch() {
  const searchInput = document.getElementById("search-input");
  const value = searchInput.value.toLowerCase();
  clearHighlights(); // Clear previous highlights
  if (value.length > 0) {
    highlightMatch(value); // Highlight new matches
  }
}

// Function to highlight matching text and count matches
function highlightMatch(query) {
  const container = document.querySelector("#main-container");
  const parentDivs = container.querySelectorAll("*"); // Select all parent div elements
  matchCount = 0; // Reset match count for new search
  matchesArray = []; // Clear previous matches array

  parentDivs.forEach((el) => {
    el.style.backgroundColor = ""; // Reset background color initially
    let isMatchFound = false; // Flag to check if a match is found within this div
    const childNodes = el.childNodes; // Get all child nodes

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent;
        const regex = new RegExp(query, "gi"); // Case-insensitive search
        if (regex.test(textContent)) {
          isMatchFound = true; // Set the flag
          matchCount++; // Increment match count
        }
      }
    });

    if (isMatchFound) {
      matchesArray.push(el); // Store the element with a match
      el.style.backgroundColor = "yellow"; // Change background color to yellow
    }
  });

  currentMatchIndex = 0; // Reset the current match index
  if (matchesArray.length > 0) {
    scrollToMatch(0); // Scroll to the first match
  }
  updateMatchCount(); // Update the match count display
}

// Function to clear highlights
function clearHighlights() {
  const container = document.querySelector("#main-container");
  const parentDivs = container.querySelectorAll("*");

  parentDivs.forEach((el) => {
    el.style.backgroundColor = ""; // Reset background color for each element
  });
  matchesArray = []; // Clear the matches array
}

// Function to update match count display
function updateMatchCount() {
  const countDisplay = document.getElementById("match-count");
  if (matchCount > 0) {
    countDisplay.textContent = `${
      currentMatchIndex + 1
    } of ${matchCount} matches`; // Display current and total matches
  } else {
    countDisplay.textContent = "0 matches";
  }
}

// Function to scroll to a specific match
function scrollToMatch(index) {
  if (matchesArray.length > 0) {
    const matchElement = matchesArray[index];
    matchElement.scrollIntoView({ behavior: "auto", block: "center" });
  }
}

// Next Match button event listener
document.getElementById("next-match").addEventListener("click", () => {
  if (matchesArray.length > 0) {
    currentMatchIndex = (currentMatchIndex + 1) % matchesArray.length; // Loop back to the first match
    scrollToMatch(currentMatchIndex);
    updateMatchCount();
  }
});

// Previous Match button event listener
document.getElementById("prev-match").addEventListener("click", () => {
  if (matchesArray.length > 0) {
    currentMatchIndex =
      (currentMatchIndex - 1 + matchesArray.length) % matchesArray.length; // Loop to the last match
    scrollToMatch(currentMatchIndex);
    updateMatchCount();
  }
});

// Close button event listener to hide the search input bar
document.getElementById("close-button").addEventListener("click", () => {
  const searchInput = document.getElementById("search-input-bar");
  searchInput.classList.add("hide");
  clearHighlights(); // Clear highlights when hiding
});
