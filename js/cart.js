let cart;

//Récupération des destinations
let destinations = mapDestinations(JSON.parse(localStorage.getItem("destinations")));

function mapDestinations(rawDestinations) {
    let destinations = {};
    Object.entries(rawDestinations).forEach(([key, value]) => {
        destinations[key] = Object.assign(new Destination(), value);
    });
    return destinations;
}

function mapCart(rawCart) {
    cart = Object.assign(new Cart(), rawCart);
    cart.trips = cart.trips.map(obj => Object.assign(new Trip(), obj));
    return cart;
}

export function onload() {
    //Récupération du panier
    cart = (localStorage.getItem("cart") !== null) ? mapCart(JSON.parse(localStorage.getItem("cart"))) : new Cart();
    //Affichage du panier
    displayCart();
    //Ajout des listeners d'évènements
    //Suppression d'un voyage du panier
    Array.prototype.forEach.call(document.getElementsByClassName("button-delete"), element => {
        element.addEventListener("click", (e) => removeTrip(e.target.id.split("-")[1]));
    });
    //Listener ouverture modal finalisation commande
    let confirmationModal = document.getElementById("confirmation-modal");
    let confirmInput = document.getElementById("confirm");
    if (cart !== undefined && cart.trips.length !== 0) {
        document.getElementById("order-id").innerText = cart.id;
        confirmInput.addEventListener("click", element => {
            confirmationModal.style.display = "block";
        });
        //Listener inalisation commande
        document.getElementById("confirmation-form").addEventListener("submit", element => {
            //Suppression du panier
            deleteCart(cart);
            confirmationModal.style.display = "none";
        });
    } else {
        confirmInput.disabled = true;
    }
}

function displayCart() {
    let total = 0;
    let billElement = document.getElementById("bill-infos");
    let cartElement = document.getElementById("trips");
    let tripTemplate = document.getElementById("trip-template"); 
    let paymentlineTemplate = document.getElementById("paymentline-template"); 
    if (cart !== undefined) {
        cart.trips.forEach((trip, index) => {
            let tripTotal = trip.getTotal(destinations);

            let cloneTrip = document.importNode(tripTemplate.content, true); 
            cloneTrip.firstElementChild.innerHTML = cloneTrip.firstElementChild.innerHTML 
                .replace(/{{id}}/g, trip.id) 
                .replace(/{{numero}}/g, index+1) 
                .replace(/{{src}}/g, destinations[trip.destinationId].image) 
                .replace(/{{alt}}/g, destinations[trip.destinationId].label) 
                .replace(/{{startDate}}/g, trip.startDate) 
                .replace(/{{endDate}}/g, trip.endDate) 
                .replace(/{{label}}/g, destinations[trip.destinationId].label)
                .replace(/{{adults}}/g, trip.adults)
                .replace(/{{children}}/g, trip.children)
                .replace(/{{price}}/g, tripTotal);
            cloneTrip.firstElementChild.id = "trip-" + trip.id;
            cartElement.appendChild(cloneTrip);            

            let clonePaymentline = document.importNode(paymentlineTemplate.content, true); 
            clonePaymentline.firstElementChild.innerHTML = clonePaymentline.firstElementChild.innerHTML 
                .replace(/{{line-amount}}/g, tripTotal); 
            clonePaymentline.firstElementChild.id = "line-amount-" + trip.id;
            
            billElement.prepend(clonePaymentline);
            
            total += tripTotal;

        });
    }

    billElement.innerHTML = billElement.innerHTML
        .replace(/{{total}}/g, total);
}

function deleteCart(cart) {
    if (cart !== undefined) {
        cart.trips.forEach((trip) => {
            removeTrip(trip.id, false);
        });
    }
    localStorage.removeItem("cart");
}

function removeTrip(id, removeTrip = true) {
    let index;
    cart.trips.forEach((currentTrip, i) => {
        if (Number(id) === Number(currentTrip.id)) {
            index = i;
        }
    });
    
    let trip = cart.trips[index];  
    if (removeTrip) {
        cart.removeTrip(index);
    }
    localStorage.setItem("cart",JSON.stringify(cart));
    document.getElementById("trips").removeChild(document.getElementById("trip-" + id));
    document.getElementById("bill-infos").removeChild(document.getElementById("line-amount-" + id));
    document.getElementById("price").innerText = document.getElementById("price").innerText - trip.getTotal(destinations);
}