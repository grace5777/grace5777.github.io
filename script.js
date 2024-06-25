document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const addLocationBtn = document.getElementById('addLocationBtn');
    const saveLocationBtn = document.getElementById('saveLocationBtn');
    const cancelLocationBtn = document.getElementById('cancelLocationBtn');
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');
    const starRating = document.getElementById('starRating');
    const locationForm = document.getElementById('locationForm');
    const dashboard = document.querySelector('.dashboard');
    const locationsDiv = document.getElementById('locations');
    const fullReviewDiv = document.getElementById('fullReview');
    const fullReviewName = document.getElementById('fullReviewName');
    const fullReviewImage = document.getElementById('fullReviewImage');
    const fullReviewRating = document.getElementById('fullReviewRating');
    const fullReviewText = document.getElementById('fullReviewText');

    let selectedRating = 0;
    let locations = [];

    // Handle image upload button click
    uploadImageBtn.addEventListener('click', () => {
        imageInput.click();
    });

    // Handle star rating selection
    starRating.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') {
            selectedRating = parseInt(e.target.dataset.rating);
            updateStarRating(selectedRating);
        }
    });

    // Update star rating display
    function updateStarRating(rating) {
        const stars = starRating.querySelectorAll('span');
        stars.forEach(star => {
            star.classList.remove('selected');
            if (parseInt(star.dataset.rating) <= rating) {
                star.classList.add('selected');
            }
        });
    }

    // Handle create a new spot button click
    addLocationBtn.addEventListener('click', () => {
        locationForm.classList.remove('hidden');
        dashboard.classList.add('hidden');
    });

    // Handle save spot button click
    saveLocationBtn.addEventListener('click', () => {
        const locationName = document.getElementById('locationName').value;
        const locationReview = document.getElementById('locationReview').value;
        const locationImage = imageInput.files[0];

        if (!locationName || !locationReview || !locationImage || !selectedRating) {
            alert('Please fill out all fields and select an image.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const thumbnail = createThumbnail(event.target.result, locationName, selectedRating, locationReview);
            const newLocation = {
                name: locationName,
                review: locationReview,
                rating: selectedRating,
                image: event.target.result,
                thumbnail: thumbnail
            };
            locations.push(newLocation);
            displayLocations();
            resetForm(); // Manually reset the form after saving
            locationForm.classList.add('hidden');
            dashboard.classList.remove('hidden');
            saveLocationsLocally(); // Save locations locally
        };
        reader.readAsDataURL(locationImage);
    });

    // Create thumbnail HTML
    function createThumbnail(imageSrc, name, rating, review) {
        const div = document.createElement('div');
        div.classList.add('location');
        div.innerHTML = `
            <img src="${imageSrc}" alt="Location Image" onclick="viewFullReview(${locations.length})">
            <p>${name}</p>
            <p>Rating: ${rating}</p>
            <p>${review.substring(0, 50)}...</p>
            <button onclick="deleteLocation(${locations.length})">Delete</button>
        `;
        return div.outerHTML;
    }

    // Display saved locations
    function displayLocations() {
        locationsDiv.innerHTML = '';
        locations.forEach((location, index) => {
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.classList.add('location');
            thumbnailDiv.innerHTML = location.thumbnail;
            thumbnailDiv.querySelector('img').onclick = () => viewFullReview(index); // Update image click
            thumbnailDiv.querySelector('button').onclick = () => deleteLocation(index); // Update delete button
            locationsDiv.appendChild(thumbnailDiv);
        });
    }

    // View full review of a location
    window.viewFullReview = function(index) {
        const location = locations[index];
        fullReviewName.textContent = location.name;
        fullReviewImage.src = location.image;
        fullReviewRating.innerHTML = 'Rating: ' + '★'.repeat(location.rating);
        fullReviewText.textContent = location.review;
        fullReviewDiv.classList.remove('hidden');
        dashboard.classList.add('hidden');
    };

    // Delete a location
    window.deleteLocation = function(index) {
        locations.splice(index, 1);
        displayLocations();
        saveLocationsLocally(); // Update local storage after deletion
    };

    // Handle back to dashboard button click
    backToDashboardBtn.addEventListener('click', () => {
        fullReviewDiv.classList.add('hidden');
        dashboard.classList.remove('hidden');
    });

    // Manually reset the form
    function resetForm() {
        document.getElementById('locationName').value = '';
        document.getElementById('locationReview').value = '';
        imageInput.value = '';
        selectedRating = 0;
        updateStarRating(0);
    }

    // Save locations locally
    function saveLocationsLocally() {
        localStorage.setItem('savedLocations', JSON.stringify(locations));
    }

    // Load locations from local storage on page load
    function loadLocations() {
        const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
        locations = savedLocations;
        displayLocations();
    }

    // Initialize: Load locations from local storage
    loadLocations();
});
