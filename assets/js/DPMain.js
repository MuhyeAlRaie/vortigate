// Sample JSON data for apartment details
var apartmentData = {
    "apartment1": {
        "video": "assets/apartmentsVid.mp4",
        "image": "assets/FloorPlane.png",
        "price": 250000,
        "surface": 100,
        "availability": "Available",
        "bedroom": 2,
        "bathroom": 1,
        "iframeSrc": "https://momento360.com/e/u/e89f13d9187b4fb1a809c49d7344e60a?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true"
    },
    "apartment2": {
        "video": "assets/apartmentsVid.mp4",
        "image": "assets/FloorPlane.png",
        "price": 200000,
        "surface": 60,
        "availability": "Reserved",
        "bedroom": 1,
        "bathroom": 1,
        "iframeSrc": "https://momento360.com/e/u/e89f13d9187b4fb1a809c49d7344e60a?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true"
    },
    "apartment3": {
        "video": "assets/apartmentsVid.mp4",
        "image": "assets/FloorPlane.png",
        "price": 150000,
        "surface": 60,
        "availability": "Available",
        "bedroom": 1,
        "bathroom": 1,
        "iframeSrc": "https://momento360.com/e/u/e89f13d9187b4fb1a809c49d7344e60a?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true"
    },  
     "apartment4": {
        "video": "assets/apartmentsVid.mp4",
        "image": "assets/FloorPlane.png",
        "price": 140000,
        "surface": 50,
        "availability": "Available",
        "bedroom": 1,
        "bathroom": 1,
        "iframeSrc": "https://momento360.com/e/u/e89f13d9187b4fb1a809c49d7344e60a?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true"
    },
    "apartment5": {
        "video": "assets/apartmentsVid.mp4",
        "image": "assets/FloorPlane.png",
        "price": 180000,
        "surface": 80,
        "availability": "Reserved",
        "bedroom": 2,
        "bathroom": 1,
        "iframeSrc": "https://momento360.com/e/u/e89f13d9187b4fb1a809c49d7344e60a?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true"
    },
    // Add details for other apartments as needed
};


function changeVideo(videoSource, button) {
    document.getElementById('background-video').src = videoSource;
    
    // Ensure inline playback on iOS
    var video = document.getElementById('background-video');
    video.setAttribute('playsinline', true);

    // Remove 'active' class from all buttons
    document.querySelectorAll('.navbar-button').forEach(function (btn) {
        btn.classList.remove('active');
    });

    // Add 'active' class to the clicked button
    button.classList.add('active');
}

function openSidebar(type, button) {
    var sidebar = document.getElementById('sidebar');
    var secondSidebar = document.getElementById('second-sidebar');

    sidebar.innerHTML = ''; // Clear previous content
    secondSidebar.style.display = 'none'; // Hide second sidebar

    // Remove 'active' class from all buttons
    document.querySelectorAll('.navbar-button').forEach(function (btn) {
        btn.classList.remove('active');
    });

    // Add 'active' class to the clicked button
    button.classList.add('active');

    if (type === 'apartments') {
        // Change video source and dynamically generate buttons for apartments
        changeVideo('assets/apartmentsVid.mp4', button);
        sidebar.innerHTML ='<div id="filter-section" class="position-relative top-20 start-50 translate-middle-x z-index-1 d-grid">'+
        '<label for="filter-price">Price:</label>'+
        '<input type="text" id="filter-price" placeholder="Enter price">'+
       ' <label for="filter-surface">Surface:</label>'+
        '<input type="text" id="filter-surface" placeholder="Enter surface">'+
        '<label for="filter-availability">Availability:</label>'+
        '<select id="filter-availability">'+
           ' <option value="">All</option>'+
            '<option value="Available">Available</option>'+
            '<option value="Reserved">Reserved</option>'+
        '</select>'+
        '<button onclick="applyFilters()">Apply Filters</button>'+
    '</div>';
        // Loop through the apartmentData and generate buttons
        var apartmentWrapperDiv = document.createElement('div');
        apartmentWrapperDiv.className = 'apartment-wrapper';
        
        // Loop through the apartmentData and generate buttons
        for (var apartmentKey in apartmentData) {
            if (apartmentData.hasOwnProperty(apartmentKey)) {
                var apartmentButton = document.createElement('button');
                apartmentButton.textContent = apartmentKey;
                apartmentButton.onclick = (function (key) {
                    return function () {
                        changeVideo(apartmentData[key].video, button);
                        showApartmentDetails(key);
                    };
                })(apartmentKey);
                
                apartmentWrapperDiv.appendChild(apartmentButton);
            }
        }
        
        // Append the wrapper div with apartment buttons to the sidebar
        sidebar.appendChild(apartmentWrapperDiv);
    } else if (type === 'home') {
// Change video source and add custom content for Home
changeVideo('assets/HomeVid.mp4', button);

var wrapperDiv = document.createElement('div');
wrapperDiv.className = 'home-wrapper';

// Set innerHTML for the wrapper div
wrapperDiv.innerHTML = '<h2>Your Project on Earth</h2>' +
    '<p class="main-desc">We are developing a sophisticated complex tailored for individuals who appreciate contemporary urban living. This innovative concept is designed to impeccably align with the distinctive standards of Dubai.</p>' +
    '<div class="statistics-wrapper">' +
    '<div class="item"><div class="number">4</div><div class="description">minutes to the bus station</div></div>' +
    '<div class="item"><div class="number">7</div><div class="description">minutes to the shopping center</div></div>' +
    '<div class="item"><div class="number">25</div><div class="description">minutes from the airport</div></div>' +
    '</div>'+
    '<div class="svg-with-text-wrapper"><img class="your-svg-class" src="assets/location-sign-svgrepo-com.svg" alt="Your SVG"><span class="svg-text">Riyadh, saudi arabia</span></div>';
    ;

// Append the wrapper div to the sidebar
sidebar.appendChild(wrapperDiv);
    } else if (type === 'features') {
        // Change video source and add buttons for features
        changeVideo('assets/FeaturesVid.mp4', button);
        var features = ['RoofTopGarden', 'PlayGround', 'Parking', 'ShoppingMall'];

        // Create a wrapper div
        var wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'Feature-wrapper';

        for (var j = 0; j < features.length; j++) {
            var featureButton = document.createElement('button');
            featureButton.textContent = features[j];
            featureButton.onclick = function () {
                changeVideo('assets/Bgvid.mp4', button);
                // Handle feature click
                // You can customize this function to display more information about the feature
                console.log('Feature Clicked: ' + features[j]);
            };

            // Append each button to the wrapper div
            wrapperDiv.appendChild(featureButton);
        }

        // Append the wrapper div to the sidebar
        sidebar.appendChild(wrapperDiv);

    } else if (type === 'contact') {
        // Change video source and add buttons for features
        changeVideo('assets/Bgvid.mp4', button);

        // Create a wrapper div for contact information
        var contactWrapperDiv = document.createElement('div');
        contactWrapperDiv.className = 'contact-wrapper';

        // Set innerHTML for the wrapper div
    contactWrapperDiv.innerHTML = '<h3 class="contact">Contact us</h3>' +
    '<div class="row input-container">' +
    '<div class="col-xs-12">' +
    '<div class="styled-input wide">' +
    '<input type="text" required />' +
    '<label>Name</label>' +
    '</div>' +
    '</div>' +
    '<div class="col-xs-12">' +
    '<div class="styled-input">' +
    '<input type="text" required />' +
    '<label>Email</label>' +
    '</div>' +
    '</div>' +
    '<div class="col-xs-12">' +
    '<div class="styled-input">' +
    '<input type="text" required />' +
    '<label>Phone Number</label>' +
    '</div>' +
    '</div>' +
    '<div class="col-xs-12">' +
    '<div class="styled-input wide">' +
    '<textarea required></textarea>' +
    '<label>Message</label>' +
    '</div>' +
    '</div>' +
    '<div class="col-xs-12">' +
    '<a href="mailto:muhye.alraie@gmail.com" class="btn-lrg submit-btn">Send Message</a>' +
    '</div>' +
    '</div>';

        // Append the wrapper div with contact information to the sidebar
        sidebar.appendChild(contactWrapperDiv);
    }
    sidebar.style.display = 'block';
}

function showApartmentDetails(apartmentKey) {
    var secondSidebar = document.getElementById('second-sidebar');
    var apartmentImage = document.getElementById('apartment-image');
    var apartmentImageLink = document.getElementById('apartment-image-link');
    var apartmentPrice = document.getElementById('apartment-price');
    var apartmentSurface = document.getElementById('apartment-surface');
    var apartmentAvailability = document.getElementById('apartment-availability');
    var apartmentBedroom = document.getElementById('apartment-bedroom');
    var apartmentBathroom = document.getElementById('apartment-bathroom');

    var filterSection = document.getElementById('filter-section');
    var sidebar = document.getElementById('sidebar');

    // Get the apartment details from the JSON data
    var apartmentDetails = apartmentData[apartmentKey];

    // Set apartment details
    apartmentImage.src = apartmentDetails.image;
    apartmentPrice.textContent = 'Price: $' + apartmentDetails.price.toLocaleString(); // Format price
    apartmentSurface.textContent = 'Surface: ' + apartmentDetails.surface + ' m²';
    apartmentAvailability.textContent = 'Availability: ' + apartmentDetails.availability;
    apartmentBedroom.textContent = 'Bedroom: ' + apartmentDetails.bedroom;
    apartmentBathroom.textContent = 'Bathroom: ' + apartmentDetails.bathroom;

    // Show the filter section
    filterSection.style.display = 'flex';

    // Hide the second sidebar
    secondSidebar.style.display = 'block';

    // Hide the sidebar
    sidebar.style.display = 'block';

     // Check if there is an iframe source for the virtual tour
     if (apartmentDetails.iframeSrc) {
        // Remove the previous "Virtual Tour" button if it exists
        var previousVirtualTourButton = document.getElementById('virtualTourButton');
        if (previousVirtualTourButton) {
            secondSidebar.removeChild(previousVirtualTourButton);
        }

        // Create a "Virtual Tour" button
        var virtualTourButton = document.createElement('button');
        virtualTourButton.id = 'virtualTourButton';
        virtualTourButton.textContent = 'Virtual Tour';
        virtualTourButton.onclick = function () {
            openIframe(apartmentDetails.iframeSrc);
        };

        // Append the "Virtual Tour" button to the second sidebar
        secondSidebar.appendChild(virtualTourButton);
    }

}


// Function to apply filters and update the list of apartments
function applyFilters() {
    var filterPrice = parseFloat(document.getElementById('filter-price').value) || 0;
    var filterSurface = parseFloat(document.getElementById('filter-surface').value) || 0;
    var filterAvailability = document.getElementById('filter-availability').value;

    var filteredApartments = {};

    // Apply filters to the apartment data
    for (var apartmentKey in apartmentData) {
        if (apartmentData.hasOwnProperty(apartmentKey)) {
            var apartment = apartmentData[apartmentKey];
            if (
                (filterPrice === 0 || apartment.price <= filterPrice) &&
                (filterSurface === 0 || apartment.surface <= filterSurface) &&
                (filterAvailability === "" || apartment.availability === filterAvailability)
            ) {
                filteredApartments[apartmentKey] = apartment;
            }
        }
    }

    // Update the sidebar with filtered apartments
    updateSidebar(filteredApartments, filterPrice, filterSurface, filterAvailability);
}

// Function to update the sidebar with the filtered apartments
function updateSidebar(apartments, lastPrice, lastSurface, lastAvailability) {
    var sidebar = document.getElementById('sidebar');

    // Create a wrapper div for apartments
    var apartmentWrapper = document.createElement('div');
    apartmentWrapper.classList = 'apartment-wrapper';

    // Clear previous content
    sidebar.innerHTML = '';

    // Create and append filter section
    var filterSection = document.createElement('div');
    filterSection.id = 'filter-section';
    filterSection.className = 'position-relative top-20 start-50 translate-middle-x z-index-1 d-grid';

    filterSection.innerHTML = 
        '<label for="filter-price">Price:</label>' +
        `<input type="text" id="filter-price" placeholder="Enter price" value="${lastPrice || ''}">` +
        '<label for="filter-surface">Surface:</label>' +
        `<input type="text" id="filter-surface" placeholder="Enter surface" value="${lastSurface || ''}">` +
        '<label for="filter-availability">Availability:</label>' +
        `<select id="filter-availability">
            <option value="" ${lastAvailability === '' ? 'selected' : ''}>All</option>
            <option value="Available" ${lastAvailability === 'Available' ? 'selected' : ''}>Available</option>
            <option value="Reserved" ${lastAvailability === 'Reserved' ? 'selected' : ''}>Reserved</option>
        </select>` +
        '<button onclick="applyFilters()">Apply Filters</button>';

    sidebar.appendChild(filterSection);

    // Append the apartmentWrapper to the sidebar
    sidebar.appendChild(apartmentWrapper);

    for (var apartmentKey in apartments) {
        if (apartments.hasOwnProperty(apartmentKey)) {
            var apartmentButton = document.createElement('button');
            apartmentButton.textContent = apartmentKey;
            apartmentButton.onclick = (function (key) {
                return function () {
                    changeVideo(apartments[key].video, apartmentButton);
                    showApartmentDetails(key);
                };
            })(apartmentKey);
            apartmentWrapper.appendChild(apartmentButton);
        }
    }
}
// function openIframe() {
//     // Create an iframe element
//     var iframe = document.createElement('iframe');
//     iframe.src = 'https://momento360.com/e/u/e89f13d9187b4fb1a809c49d7344e60a?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true'; // Set the URL for your iframe content
//     iframe.width = '800'; // Set the width of the iframe
//     iframe.height = '600'; // Set the height of the iframe

//     // Create a container div for the iframe
//     var iframeContainer = document.createElement('div');
//     iframeContainer.className = 'iframe-container';

//     // Append the iframe to the container
//     iframeContainer.appendChild(iframe);

//     // Append the container to the body
//     document.body.appendChild(iframeContainer);

//     // Center the iframe on the screen
//     iframeContainer.style.position = 'fixed';
//     iframeContainer.style.top = '50%';
//     iframeContainer.style.left = '50%';
//     iframeContainer.style.transform = 'translate(-50%, -50%)';
//     iframeContainer.style.zIndex = '9999';

//     // Add a close button to the iframe
//     var closeButton = document.createElement('button');
//     closeButton.textContent = 'Close';
//     closeButton.onclick = function () {
//         document.body.removeChild(iframeContainer);
//     };

//     // Append the close button to the container
//     iframeContainer.appendChild(closeButton);
// }

function isDeviceRotated() {
  
    // If it's a mobile device and in landscape orientation, return true
    if (window.matchMedia("(orientation: landscape) and (max-device-width: 1200px)").matches) {
        return true;
    }   }
  

function openIframe(iframeSrc) {
    // Create an iframe element
    var iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.width = '1000'; // Set the width of the iframe (adjust as needed)
    iframe.height = '500'; // Set the height of the iframe (adjust as needed)

    if (isDeviceRotated()) {
        iframe.width = '600'; // Set the width of the iframe (adjust as needed)
        iframe.height = '200'; // Set the height of the iframe (adjust as needed)
    }
    // Create a container div for the iframe and button
    var container = document.createElement('div');
    container.className = 'iframe-container';

    // Create a close button with an "X" icon
    var closeButton = document.createElement('button');
    closeButton.innerHTML = '&#10006;'; // HTML entity for "X"
    closeButton.onclick = function () {
        document.body.removeChild(container);
    };

    // Append the iframe and close button to the container
    container.appendChild(iframe);
    container.appendChild(closeButton);

    // Append the container to the body
    document.body.appendChild(container);

    // Center the container on the screen
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '9999';

    // Set the innerHTML of the container
    container.innerHTML = '';

    // Append the iframe and close button to the container
    container.appendChild(iframe);
    container.appendChild(closeButton);

    // Style the iframe
    iframe.style.width = '1000';
    iframe.style.height = '800';
    iframe.style.border = 'none';

    // Style the close button
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '24px'; // Adjust the font size as needed
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.color = '#000'; // Set the color of the "X"
    closeButton.style.cursor = 'pointer';
}



document.getElementById('home-btn').click();
