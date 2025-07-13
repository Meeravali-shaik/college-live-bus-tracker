// Firebase imports (only needed if using <script type="module">)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase config (use yours)
const firebaseConfig = {
  apiKey: "AIzaSyD8fdxhK4N5TZtwxNzrejFPZ1mWtYT5VMQ",
  authDomain: "college-bus-tracker-1949b.firebaseapp.com",
  databaseURL: "https://college-bus-tracker-1949b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "college-bus-tracker-1949b",
  storageBucket: "college-bus-tracker-1949b.appspot.com",
  messagingSenderId: "744048439629",
  appId: "1:744048439629:web:example"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Bus stop locations
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

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: stops[0],
    zoom: 15,
  });

  // Show all stop markers
  stops.forEach((stop) => {
    new google.maps.Marker({
      position: { lat: stop.lat, lng: stop.lng },
      map: map,
      title: stop.name,
    });
  });

  // Add bus marker
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

function listenForBusLocation() {
  const locationRef = ref(db, "bus/location");

  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.latitude && data.longitude) {
      const busLatLng = { lat: data.latitude, lng: data.longitude };

      busMarker.setPosition(busLatLng);
      map.panTo(busLatLng);

      // Update status
      document.getElementById("currentStop").textContent = getNearestStop(busLatLng);
      document.getElementById("nextStop").textContent = "Live tracking";
      document.getElementById("eta").textContent = "--";
      document.getElementById("alert").textContent = `Bus is moving...`;
    }
  });
}

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

function getDistance(loc1, loc2) {
  const dx = loc1.lat - loc2.lat;
  const dy = loc1.lng - loc2.lng;
  return Math.sqrt(dx * dx + dy * dy);
}
