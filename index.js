const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let books = [];
let page = 1;
let isDarkMode = true;
let isGridView = true;

async function fetchBooks() {
    try {
        const response = await fetch(`${apiUrl}?page=${page}`);
        const result = await response.json();

        if (result.statusCode === 200 && result.data && result.data.data) {
            books = books.concat(result.data.data);
            renderBooks();
        } else {
            console.error("Error fetching books:", result);
        }
    } catch (error) {
        console.error("Failed to fetch books:", error);
    }
}

function renderBooks(filteredBooks = books) {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    filteredBooks.forEach(book => {
        const volumeInfo = book.volumeInfo || {};
        const bookDiv = document.createElement("div");
        bookDiv.className = "book p-3";

        if (isGridView) {
            bookDiv.innerHTML = `
                <img src="${volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" 
                    alt="${volumeInfo.title}" class="img-fluid">
                <h5 class="mt-2">${volumeInfo.title || "Unknown Title"}</h5>
                <p>${volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author"}</p>
                <p>📅 ${volumeInfo.publishedDate || "Unknown Date"}</p>
                <a href="${volumeInfo.infoLink || '#'}" class="btn btn-light mt-2" target="_blank">More Info</a>
            `;
        } else {
            bookDiv.innerHTML = `
                <img src="${volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" 
                    alt="${volumeInfo.title}" class="img-fluid">
                <div>
                    <h5>${volumeInfo.title || "Unknown Title"}</h5>
                    <p>${volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author"}</p>
                    <p>📅 ${volumeInfo.publishedDate || "Unknown Date"}</p>
                    <a href="${volumeInfo.infoLink || '#'}" class="btn btn-light mt-2" target="_blank">More Info</a>
                </div>
            `;
        }

        bookList.appendChild(bookDiv);
    });
}

document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    document.getElementById("toggleTheme").textContent = isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode";
});

document.getElementById("toggleView").addEventListener("click", () => {
    document.body.classList.toggle("grid-view");
    document.body.classList.toggle("list-view");
    isGridView = !isGridView;
    document.getElementById("toggleView").textContent = isGridView ? "📖 List View" : "🔲 Grid View";
    renderBooks();
});

document.getElementById("loadMore").addEventListener("click", () => {
    page++;
    fetchBooks();
});

fetchBooks();

