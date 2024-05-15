class Destination {

    static lastId = 0;

    constructor(city, country, label, description, pricePerAdult, breakfast, petsAllowed, image, openWeatherMapId){
        Destination.lastId++;
        this._id = Destination.lastId;
        this._city = city;
        this._country = country;
        this._label = label;
        this._description = description;
        this._pricePerAdult = pricePerAdult;
        this._breakfast = breakfast;
        this._petsAllowed = petsAllowed;
        this._image = image;
        this._openWeatherMapId = openWeatherMapId;
    }

    get id(){
        return this._id;
    }

    get city(){
        return this._city;
    }

    get country(){
        return this._country;
    }

    get label(){
        return this._label;
    }
    
    get description(){
        return this._description;
    }

    get pricePerAdult(){
        return this._pricePerAdult;
    }

    get petsAllowed(){
        return this._petsAllowed;
    }

    get image(){
        return this._image;
    }

    get openWeatherMapId(){
        return this._openWeatherMapId;
    }

    set city(city){
        this._city = city;
    }

    set country(country){
        this._country = country;
    }

    set label(label){
        this._label = label;
    }

    set description(description){
        this._description = description;
    }

    set pricePerAdult(pricePerAdult){
        this._pricePerAdult = pricePerAdult;
    }

    set petsAllowed(petsAllowed){
        this._petsAllowed = petsAllowed;
    }

    set image(image){
        this._image = image;
    }

    set openWeatherMapId(openWeatherMapId){
        this._openWeatherMapId = openWeatherMapId;
    }
}