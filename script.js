// Daten laden
let trips = JSON.parse(localStorage.getItem('trips')) || [];
let selectedTripIndex = null;

const form = document.getElementById("addTripForm");
const tripInput = document.getElementById("tripName");
const tripList = document.getElementById("trips");

const placeSection = document.getElementById("place-section");
const selectedTripName = document.getElementById("selected-trip-name");
const placeForm = document.getElementById("addPlaceForm");
const placeName = document.getElementById("placeName");
const placeTopic = document.getElementById("placeTopic");
const placeLink = document.getElementById("placeLink");
const placesList = document.getElementById("places");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const tripNameValue = tripInput.value.trim();
  if (tripNameValue === "") return;

  trips.push({ name: tripNameValue, places: [] });
  tripInput.value = "";
  saveTrips();
  renderTrips();
});

function saveTrips(){
  localStorage.setItem('trips', JSON.stringify(trips));
}

function renderTrips() {
  tripList.innerHTML = "";
  trips.forEach((trip, index) => {
    const li = document.createElement("li");

    // Reise-Name (klickbar zum Öffnen)
    const tripNameSpan = document.createElement("span");
    tripNameSpan.textContent = trip.name;
    tripNameSpan.style.cursor = "pointer";
    tripNameSpan.addEventListener("click", () => {
      selectedTripIndex = index;
      showPlaces(trip);
    });
    li.appendChild(tripNameSpan);

    // Löschen-Button für Reise
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Verhindert, dass Reise auch geöffnet wird
      if(confirm(`Reise "${trip.name}" wirklich löschen?`)){
        trips.splice(index, 1);
        saveTrips();
        renderTrips();
        placeSection.style.display = "none"; // Ort-Details verstecken
      }
    });
    li.appendChild(deleteBtn);

    tripList.appendChild(li);
  });
}

// Direkt Trips anzeigen, wenn Daten vorhanden sind
if(trips.length > 0){
  renderTrips();
}

function showPlaces(trip) {
  placeSection.style.display = "block";
  selectedTripName.textContent = `📌 Orte für: ${trip.name}`;
  renderPlaces(trip.places);
}

placeForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (selectedTripIndex === null) return;

  const newPlace = {
    name: placeName.value.trim(),
    topic: placeTopic.value.trim(),
    link: placeLink.value.trim()
  };

  if (newPlace.name === "") return;

  trips[selectedTripIndex].places.push(newPlace);

  placeName.value = "";
  placeTopic.value = "";
  placeLink.value = "";

  saveTrips();
  renderPlaces(trips[selectedTripIndex].places);
});

function renderPlaces(places) {
  placesList.innerHTML = "";
  places.forEach((place, index) => {
    const li = document.createElement("li");

    li.innerHTML = `<strong>${place.name}</strong> (${place.topic || "Kein Thema"}) 
      <br><a href="${place.link}" target="_blank">📍 Google Maps</a>`;

    // Löschen-Button für Ort
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", () => {
      if(confirm(`Ort "${place.name}" wirklich löschen?`)){
        trips[selectedTripIndex].places.splice(index, 1);
        saveTrips();
        renderPlaces(trips[selectedTripIndex].places);
      }
    });
    li.appendChild(deleteBtn);

    placesList.appendChild(li);
  });
}
