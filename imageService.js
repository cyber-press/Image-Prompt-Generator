// js/imageService.js

const API_KEY = 'YOUR_PEXELS_API_KEY';

export const debounce = (func, delay = 500) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(null, args), delay);
    };
};

export const fetchImages = async (keyword, imageBoard) => {
    imageBoard.innerHTML = `<p class="image-board-placeholder">Searching...</p>`;

    if (!keyword) {
        imageBoard.innerHTML = `<p class="image-board-placeholder">Type a subject to see inspirational images here...</p>`;
        return;
    }

    try {
        if (API_KEY === 'YOUR_PEXELS_API_KEY') {
            imageBoard.innerHTML = `<p class="image-board-placeholder">Please add your Pexels API key in js/imageService.js</p>`;
            return;
        }

        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=9`,
            { headers: { Authorization: API_KEY } }
        );

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.statusText}`);
        }

        const data = await response.json();
        imageBoard.innerHTML = '';

        if (data.photos.length === 0) {
            imageBoard.innerHTML = `<p class="image-board-placeholder">No images found for "${keyword}"</p>`;
            return;
        }

        data.photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.src.medium;
            img.alt = photo.alt;
            imageBoard.appendChild(img);
        });
    } catch (error) {
        console.error("Failed to fetch images:", error);
        imageBoard.innerHTML = `<p class="image-board-placeholder">Error fetching images.</p>`;
    }
};
