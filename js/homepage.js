//Déclaration des constantes
const openWeatherMapKey = "2d1f9837d4ba0ce65be806f1e2b898f0";

//Récupération des destinations
let destinations = mapDestinations(JSON.parse(localStorage.getItem("destinations")));

function mapDestinations(rawDestinations) {
    let destinations = {};
    Object.entries(rawDestinations).forEach(([key, value]) => {
        destinations[key] = Object.assign(new Destination(), value);
    });
    return destinations;
}

export function onload() {
    loadDestinationGrid();
    //On ajoute les listener pour les filtres
    document.getElementById("applyFilters").addEventListener('input', applyFilters);
    Array.prototype.forEach.call(document.getElementsByClassName("filters"), filter => {
        filter.addEventListener('input', applyFilters);
    });
}

//Remplissage de la grille de destinations
//Récupération de la température
async function getWeather(cityId) {
    return await fetch('http://api.openweathermap.org/data/2.5/forecast?id=' + cityId+ '&appid=' + openWeatherMapKey)
        .then(function(response) {
            return response.json();
        })    
        .then(function(response) {
            return Math.round(parseFloat(response.list[0].main.temp)-273.15);
        })
        .catch(function(err) {  
            console.log('Failed to fetch page: ', err);  
        });
}

//Chargement des destinations
async function loadDestinationGrid(){
    
    let template, destinationsContainer;

    destinationsContainer = document.getElementById("destinations");

    template = document.getElementById("destination-template"); 

    for(let destinationId in destinations){

        let currentDestinationNode = document.importNode(template.content, true);

        currentDestinationNode.firstElementChild.id = "destination-" + destinations[destinationId].id;

        currentDestinationNode.firstElementChild.innerHTML = currentDestinationNode.firstElementChild.innerHTML
            .replace(/{{ville}}/g, destinations[destinationId].city)
            .replace(/{{pays}}/g, destinations[destinationId].country)
            .replace(/{{temperature}}/g, await getWeather(destinations[destinationId].openWeatherMapId) + '&deg;')
            .replace(/{{prix}}/g, destinations[destinationId].pricePerAdult)
            .replace(/{{src}}/g, destinations[destinationId].image)
            .replace(/{{href}}/g, "#/reservation?id=" + destinations[destinationId].id);

            destinationsContainer.appendChild(currentDestinationNode);
    }

    return;
}

//Filtrage des destinations
function applyFilters() {

    let filtersOn = document.getElementById("applyFilters");
    let destinationCards = document.getElementsByClassName("destination-card");

    if (!filtersOn.checked) {
        Array.prototype.forEach.call(destinationCards, destinationCard => {
            destinationCard.style.display = "block";
        });
        return;
    }

    let filters = document.getElementsByClassName("filters");

    Array.prototype.forEach.call(destinationCards, destinationCard => {

        let destinationId = destinationCard.id.split('-')[1]

        if (destinationId === "template") {
            return;
        }
        
        let display = true;
        Array.prototype.forEach.call(filters, filter => {
            switch (filter.id) {
                case "petsAllowed":
                    if (filter.checked !== destinations[destinationId].petsAllowed) {
                        display = false;
                    }
                    break;
                case "breakfast":
                    if (filter.checked !== destinations[destinationId].breakfast) {
                        display = false;
                    }
                    break;
                case "minPrice":
                    if (destinations[destinationId].pricePerAdult < filter.value) {
                        display = false;
                    }
                    break;
                case "maxPrice":
                    if (destinations[destinationId].pricePerAdult > filter.value) {
                        display = false;
                    }
                    break;
                default:
                  console.log("Unknown filter.");
              }

        });

        destinationCard.style.display = (display) ? "block" : "none";

    })
}