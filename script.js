// Coordinates of stops (replace with real ones)
const stops = [
  { name: "Allen Solley", lat: 16.059417, lng: 79.740333 },
  { name: "Satya", lat: 16.058472, lng: 79.739917 },
  { name: "Vellaturu Turning", lat: 16.056861, lng: 79.739389 },
  { name: "Bus Stand", lat: 16.055333, lng: 79.739694 },
  { name: "Stupam", lat: 16.049861, lng: 79.740583 },
  { name: "Suresh Mahal Road", lat: 16.052389, lng: 79.744389 },
  { name: "Sai Baba Temple", lat: 16.055722, lng: 79.747556 }
];


let map;
let busMarker;
let currentIndex = 0;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: stops[0],
    zoom: 13,
  });

  // Add stop markers
  stops.forEach((stop) => {
    new google.maps.Marker({
      position: stop,
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

  updateBusPosition();
}

function updateBusPosition() {
  const current = stops[currentIndex];
  const next = stops[currentIndex + 1];

  busMarker.setPosition(current);
  document.getElementById("currentStop").textContent = current.name;
  document.getElementById("nextStop").textContent = next ? next.name : "Last Stop";
  document.getElementById("eta").textContent = "2–3 mins";
  document.getElementById("alert").textContent = `Bus is at ${current.name}`;

  if (next) {
    currentIndex++;
    setTimeout(updateBusPosition, 4000); // simulate movement
  } else {
    document.getElementById("alert").textContent = "✅ Bus reached final stop.";
  }
}
