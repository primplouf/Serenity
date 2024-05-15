//Déclaration et initialisation des constantes
const destinationsStorage = '../ressources/destinations.json'

//Chargement des destinations dans le localStorage
loadDestinations().then((destinations) => {
    localStorage.setItem("destinations", JSON.stringify(destinations));
})

async function loadDestinations() {
    let destinationList = {};
    let json = await fetch(destinationsStorage)
    .then(function(response) {
        return response.json();
    })
    .catch(function(err) {  
        console.log('Failed to fetch page: ', err);  
    });
    let destinationObj;
    for(let destination of json.destinations) {
            destinationObj = Object.assign(new Destination(), destination);
            destinationList[destinationObj.id] = destinationObj;
        }
    return destinationList;
}