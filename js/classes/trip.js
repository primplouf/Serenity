class Trip {
    static lastId = 0;

    constructor(adults, children, breakfast, startDate, endDate, destinationId){
        Trip.lastId++;
        this._id = Trip.lastId;
        this._adults = adults;
        this._children = children;
        this._breakfast = breakfast;
        this._startDate = startDate;
        this._endDate = endDate;
        this._destinationId = destinationId;
    }

    get id() {
        return this._id;
    }

    get adults() {
        return this._adults;
    }

    get children() {
        return this._children;
    }

    get breakfast() {
        return this._breakfast;
    }

    get startDate() {
        return this._startDate;
    }

    get endDate() {
        return this._endDate;
    }

    get destinationId() {
        return this._destinationId;
    }

    set id(id) {
        this._id = id;
    }

    set adults(adults) {
        this._adults = adults;
    }

    set children(children) {
        this._children = children;
    }

    set breakfast(breakfast) {
        this._breakfast = breakfast;
    }

    set startDate(startDate) {
        this._startDate = startDate;
    }

    set endDate(endDate) {
        this._endDate = endDate;
    }

    set destinationId(destinationId) {
        this._destinationId = destinationId;
    }

    incrementId() {
        Trip.lastId++;
        this.id = Trip.lastId;
    }

    getTotal(destinations){
        return (Trip.compareDates(this.startDate, this.endDate) * (this.adults * (destinations[this.destinationId].pricePerAdult + 15* this.breakfast) + (destinations[this.destinationId].pricePerAdult * 0.4 + 15* this.breakfast) * this.children));
    }

    //Cette fonction renvoie la différence en jours entre date1 et date2
    static compareDates(date1, date2) {
        return Math.ceil((new Date(date2).getTime() - new Date(date1).getTime()) / (1000 * 3600 * 24));
    }
};