// Geocoding function to get coordinates from location
async function getCoordinates(location) {
  try {
    const query = encodeURIComponent(`${location}`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (data.length === 0) {
      throw new Error("Location not found");
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    // Return default coordinates if geocoding fails
    return { lat: 22.7196, lng: 75.8577 }; // Default: Indore, India
  }
}

(async () => {
  let listing_address = document.querySelector("#listing-address");
  const {lat, lng} = await getCoordinates(listing_address.textContent)

  // Initialize map
  const map = L.map("map", {
    center: [lat, lng],
    zoom: 15,
    zoomControl: true,
    scrollWheelZoom: false, // Disable scroll zoom like Airbnb
  });

  // Coordinates for Indore, Madhya Pradesh, India

  // Add OpenStreetMap tiles
  // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '© OpenStreetMap contributors',
  //     maxZoom: 19
  // }).addTo(map);
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }
  ).addTo(map);

  // Add a circular marker (approximate location)
  const circle = L.circle([lat, lng], {
    color: "#222",
    fillColor: "#222",
    fillOpacity: 0.2,
    radius: 500, // 500 meters radius for approximate location
  }).addTo(map);

  const hotelIcon = L.divIcon({
    className: "custom-icon",
    html: '<div style="background: #e74c3c; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏨</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
  const marker = L.marker([lat, lng], { icon: hotelIcon }).addTo(map);
})();
