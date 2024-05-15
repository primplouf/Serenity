//Déclaration des constantes
const routesStorage = '../ressources/routes.json'
const content = "page-content";

//Routeur dynamique

//On va stocker nos routes dans un tableau associatif ()
let routes = {};

//Ajouter un élément de navigation au menu
function addNavlink(name, endpoint) {
    let template = document.getElementById("navlink");
    let clone = document.importNode(template.content, true); 
    clone.firstElementChild.innerHTML = clone.firstElementChild.innerHTML 
        .replace(/{{href}}/g, '#' + endpoint) 
        .replace(/{{name}}/g, name);
    document.getElementById("navmenu").appendChild(clone);
    return;
}

//Récupération dynamique des routes dans la bdd (json)
async function loadRoutes(){
    
    let json = await fetch(routesStorage)
        .then(function(response) {
            return response.json();
        })
        .catch(function(err) {  
            console.log('Failed to fetch page: ', err);  
        });
    let responseText, parser, html, template, javascript;
    let loadedRoutes = {};
    
    parser = new DOMParser();
        
    for(let route of json.routes){
        responseText = await fetch('../' + route.templatePath)
            .then(function(response) {
                return response.text()
            })
            .catch(function(err) {  
                console.log('Failed to fetch page: ', err);  
            });

        //Récupération du contenu HTML du template
        html = parser.parseFromString(responseText, "text/html");

        template = html.getElementById(route.templateId); 

        //Récupération du javascript associé
        if(route.javascriptPath !== "") {
            javascript = await import(route.javascriptPath);
        } else {
            javascript = undefined;
        }
        
        loadedRoutes[route.endpoint] = new Route(
            route.name,
            route.endpoint,
            html.importNode(template.content, true).firstElementChild.innerHTML,
            javascript);

        //On ajoute l'élément de navigation au menu
        if (route.appendNavlink){
            addNavlink(route.name, route.endpoint);
        }
    }

    return loadedRoutes;
}

//Récupération du point de termianison URL puis résolution de la route
function router() {
    let url = window.location.hash.slice(1) || "/";
    let endpoint = url.split('?')[0]
    resolveRoute(endpoint);
};

//Résolution de la route en fonction du point de terminaison URL
function resolveRoute(route) {
    try {
        replaceTemplate(routes[route].template);
        if(routes[route].javascript !== undefined) {
           routes[route].javascript.onload(); 
        }   
    } catch (error) {
        throw new Error("Error while loading route : " + error);
    }
    
    return;
};

//Remplacement du corps HTML en fonction de la route récupérée
function replaceTemplate(template){
    let myDiv = document.getElementById(content);
    myDiv.innerHTML = template;

    return;
}

loadRoutes().then(resultRoutes => {
    routes = resultRoutes;
    //Enfin, on effectue le routage initial
    router()
}) 

//On ajoute un évènement sur les modifications d'URL
window.addEventListener('hashchange', router);