import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC9v97BBHaQMuYuHdZKGxYVIgH5m8EPvRM",
  authDomain: "college-bus-tracker-1949b.firebaseapp.com",
  databaseURL: "https://college-bus-tracker-1949b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "college-bus-tracker-1949b",
  storageBucket: "college-bus-tracker-1949b.appspot.com",
  messagingSenderId: "744043439629",
  appId: "1:744043439629:web:c723aed45b2b1d00651744",
  measurementId: "G-8FX7KZ9DC4"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

// 🚌 Define Stops
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

// ✅ Global initMap
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: stops[0],
    zoom: 15,
  });

  // 📌 Stop markers
  stops.forEach(stop => {
    new google.maps.Marker({
      position: { lat: stop.lat, lng: stop.lng },
      map: map,
      title: stop.name,
    });
  });

  // 🚌 Bus marker
  busMarker = new google.maps.Marker({
    position: stops[0],
    map: map,
    title: "College Bus",
    icon: {
      url: "https://cdn-icons-png.flaticon.com/512/61/61088.png",
      scaledSize: new google.maps.Size(30, 30),
    },
  });

  // 🔄 Start Firebase listener
  listenForBusLocation();
};

// 📡 Firebase listener
function listenForBusLocation() {
  const locationRef = ref(db, "bus/location");

  onValue(locationRef, snapshot => {
    const data = snapshot.val();
    console.log("📡 Firebase update received:", data);

    if (data && data.latitude && data.longitude) {
      const busLatLng = { lat: data.latitude, lng: data.longitude };
      busMarker.setPosition(busLatLng);
      map.panTo(busLatLng);

      // Update UI
      document.getElementById("currentStop").textContent = getNearestStop(busLatLng);
      document.getElementById("nextStop").textContent = "Live tracking";
      document.getElementById("eta").textContent = "--";
      document.getElementById("alert").textContent = "Bus is moving...";
    }
  });
}

// 📍 Nearest stop
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

// 📐 Distance calc
function getDistance(loc1, loc2) {
  const dx = loc1.lat - loc2.lat;
  const dy = loc1.lng - loc2.lng;
  return Math.sqrt(dx * dx + dy * dy);
}
