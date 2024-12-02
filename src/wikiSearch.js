// Function to search Wikipedia
function searchWikipedia(term) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&titles=${term}&origin=*`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = pages[Object.keys(pages)[0]];
            const extract = page.extract;

            const wikiContent = document.getElementById("wiki-content");
            const floatingWindow = document.getElementById("floating-window");

            if (extract) {
                wikiContent.innerHTML = extract;
                floatingWindow.style.display = 'block';
            } else {
                wikiContent.innerHTML = "No information available.";
            }
        })
        .catch(error => {
            console.error("Error fetching Wikipedia data:", error);
            document.getElementById("wiki-content").innerHTML = "Error fetching data.";
        });
}

// Close button functionality
document.getElementById("close-button").addEventListener("click", () => {
    document.getElementById("floating-window").style.display = 'none';
});

// Draggable functionality
const floatingWindow = document.getElementById("floating-window");
const header = document.getElementById("floating-header");

let isDragging = false;
let offsetX, offsetY;

header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - floatingWindow.offsetLeft;
    offsetY = e.clientY - floatingWindow.offsetTop;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        floatingWindow.style.left = `${e.clientX - offsetX}px`;
        floatingWindow.style.top = `${e.clientY - offsetY}px`;
    }
});

// Center the window for large screens, or set full-screen for small screens
const wikiLinks = document.querySelectorAll('.wiki-link');
wikiLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const term = this.getAttribute('data-term');
        searchWikipedia(term);

        const floatingWindow = document.getElementById("floating-window");
        const isSmallScreen = window.innerWidth <= 768;

        // Ensure the floating window is visible
        floatingWindow.style.display = 'block';

        
    });
});
