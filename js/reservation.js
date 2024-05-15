//Récupération des destinations
let trip = new Trip();

let destinations = mapDestinations(JSON.parse(localStorage.getItem("destinations")));

function mapDestinations(rawDestinations) {
    let destinations = {};
    Object.entries(rawDestinations).forEach(([key, value]) => {
        destinations[key] = Object.assign(new Destination(), value);
    });
    return destinations;
}

export function onload() {
    let destinationId = getCurrentIdDestination();
    let reservation = document.getElementById("reservation");
    reservation.style.backgroundImage = "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 34%, rgba(84,84,84,0.4) 52%, rgba(0,0,0,0.4) 100%), url('" + destinations[destinationId].image + "')"; 
    reservation.innerHTML = reservation.innerHTML
        .replace(/{{pays}}/g, destinations[destinationId].country)
        .replace(/{{ville}}/g, destinations[destinationId].city)
        .replace(/{{label}}/g, destinations[destinationId].label)
        .replace(/{{description}}/g, destinations[destinationId].description)
    Array.prototype.forEach.call(
        document.getElementsByClassName("price-factors"),
        function(priceFactor) {    
            priceFactor.addEventListener('input', function(e) { 
                reservationOnInput()
            })
        }
    );
    document.getElementById("reset-reservation").addEventListener("click", setDefaultReservation);
    setDefaultReservation();
    document.getElementById("add-to-cart").addEventListener("click",addToCart); 
}

function getCurrentIdDestination() {
    return new URLSearchParams(window.location.hash.slice(1).split('?')[1]).get("id");
}

function getStartDateElem(){
    return document.getElementById("start-date");
}

function getEndDateElem(){
    return document.getElementById("end-date");
}

function getAdultsElem(){
    return document.getElementById("adults");
}

function getChildrenElem(){
    return document.getElementById("children");
}

function getBreakfastElem(){
    return document.getElementById("breakfast");
}

function getPriceElem(){
    return document.getElementById("price");
}

function checkConstraints() {
    let startDateElem = getStartDateElem()
    let endDateElem = getEndDateElem()
    let constraintViolation = "";
    switch(true){
        case (Trip.compareDates(startDateElem.value, endDateElem.value) <= 0):
            constraintViolation ="La date de retour doit obligatoirement être postérieure à la date de départ !";
            break;
        case (Trip.compareDates((new Date()), startDateElem.value) < 0):
            constraintViolation = "La date de départ ne peut pas être antérieure à la date du jour !";
            break;
    }
    return constraintViolation;
}

function updatePrice() {
    trip.destinationId = getCurrentIdDestination()
    trip.startDate = getStartDateElem().value
    trip.endDate = getEndDateElem().value
    trip.children = getChildrenElem().value
    trip.adults = getAdultsElem().value
    trip.breakfast = getBreakfastElem().checked
    getPriceElem().innerText = trip.getTotal(destinations)
}

function setDate(elem, date) {
    elem.valueAsDate = date;
}

function setDefaultReservation() {
    getBreakfastElem().checked = false;
    getAdultsElem().value = 1;
    getChildrenElem().value = 0;
    let currentDate = new Date();
    setDate(getStartDateElem(), currentDate);
    setDate(getEndDateElem(), new Date(currentDate.setDate(currentDate.getDate()+1)));
    reservationOnInput()
}

function reservationOnInput() {
    let constraintViolation = checkConstraints() 
    if (constraintViolation === ""){
        document.getElementById("reservation-constraints").innerText = ""
        document.getElementById("add-to-cart").disabled = false;
        updatePrice();
    } else {
        document.getElementById("reservation-constraints").innerText = constraintViolation
        document.getElementById("add-to-cart").disabled = true;
    }
}

function addToCart() {
    let json = localStorage.getItem("cart");
    let cart = new Cart();
    if (json === null) {
        cart = new Cart();
    } else {
        Object.assign(cart, JSON.parse(json));
    }
    //On incrémente l'id du voyage vu qu'on utilise toujours le même objet
    trip.incrementId();
    cart.addTrip(trip);
    localStorage.setItem("cart",JSON.stringify(cart));  
}