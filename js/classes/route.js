class Route {
    constructor(name, endpoint, template, javascript) {
        this._name = name;
        this._endpoint = endpoint;
        this._template = template;
        this._javascript = javascript;
    }

    get name(){
        return this._name;
    }

    get endpoint(){
        return this._endpoint;
    }

    get template(){
        return this._template;
    }

    get javascript(){
        return this._javascript;
    }
}