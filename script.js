// ✅ Import Firebase modules (modular SDK from CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ✅ Your latest Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC9v97BBHaQMuYuHdZKGxYVIgH5m8EPvRM",
  authDomain: "college-bus-tracker-1949b.firebaseapp.com",
  projectId: "college-bus-tracker-1949b",
  storageBucket: "college-bus-tracker-1949b.firebasestorage.app",
  messagingSenderId: "744043439629",
  appId: "1:744043439629:web:2707394ed748b413651744",
  measurementId: "G-WTXQS89VBX"
};

// ✅ Initialize Firebase & Realtime Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Define all bus stops
const stops = [
  { name: "Allen Solley", lat: 16.059417, lng: 79.740333 },
  { name: "Satya", lat: 16.058472, lng: 79.739917 },
  { name: "Vellaturu Turning", lat: 16.056861, lng: 79.739389 },
  { name: "Bus Stand", lat: 16.055333, lng: 79.739694 },
  { name: "Stupam", lat: 16.049861, lng: 79.740583 },
  { name: "Suresh Mahal Road", lat: 16.052389, lng: 79.744389 },
  { name: "Sai Baba Temple", lat: 16.055722, lng: 79.747556 }
];

let map, busMarker;

// ✅ Google Maps initialization
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: stops[0],
    zoom: 15,
  });

  // Show all stops as markers
  stops.forEach((stop) => {
    new google.maps.Marker({
      position: { lat: stop.lat, lng: stop.lng },
      map: map,
      title: stop.name,
    });
  });

  // Initial bus marker
  busMarker = new google.maps.Marker({
    position: stops[0],
    map: map,
    title: "College Bus",
    icon: {
      url: "https://cdn-icons-png.flaticon.com/512/61/61088.png",
      scaledSize: new google.maps.Size(30, 30),
    },
  });

  listenForBusLocation();
}

// ✅ Real-time listener for GPS updates
function listenForBusLocation() {
  const locationRef = ref(db, "bus/location");

  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.latitude && data.longitude) {
      const busLatLng = { lat: data.latitude, lng: data.longitude };

      busMarker.setPosition(busLatLng);
      map.panTo(busLatLng);

      // Update UI
      document.getElementById("currentStop").textContent = getNearestStop(busLatLng);
      document.getElementById("nextStop").textContent = "Tracking...";
      document.getElementById("eta").textContent = "--";
      document.getElementById("alert").textContent = "🚌 Bus is moving live.";
    } else {
      document.getElementById("alert").textContent = "⚠️ No GPS data available.";
    }
  });
}

// ✅ Utility to get nearest stop name
function getNearestStop(current) {
  let nearest = stops[0];
  let minDist = getDistance(current, stops[0]);

  for (let i = 1; i < stops.length; i++) {
    const dist = getDistance(current, stops[i]);
    if (dist < minDist) {
      minDist = dist;
      nearest = stops[i];
    }
  }

  return nearest.name;
}

// ✅ Calculate distance between 2 coordinates
function getDistance(loc1, loc2) {
  const dx = loc1.lat - loc2.lat;
  const dy = loc1.lng - loc2.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

// ✅ Expose initMap for Google Maps to call
window.initMap = initMap;
