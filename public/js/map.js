// Wait for the map to load before adding the marker
document.addEventListener('DOMContentLoaded', function() {
    // Check if coordinates exist and are valid
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
        console.error('Invalid coordinates:', coordinates);
        document.getElementById('map').innerHTML = '<p>Location data not available</p>';
        return;
    }

    // Set your API key
    maptilersdk.config.apiKey = mapKey;

    // Create a new map
    const map = new maptilersdk.Map({
      container: 'map', 
      style: maptilersdk.MapStyle.STREETS, 
      center: coordinates, 
      zoom: 8,
    });

    // Add marker after map loads
    map.on('load', function() {
        const popup = new maptilersdk.Popup({ offset: 25 }) // 'offset' moves it up
        .setText('Exact location is provided after booking');

   
    const marker = new maptilersdk.Marker({color : "red"})
        .setLngLat(coordinates) 
        .setPopup(popup) 
        .addTo(map);
    });

    // Handle map errors
    map.on('error', function(e) {
        console.error('Map error:', e);
        document.getElementById('map').innerHTML = '<p>Error loading map</p>';
    });
});