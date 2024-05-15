class Cart {
    static lastId = 0;

    constructor(trips = []) {
        Cart.lastId++;
        this._id = Cart.lastId;
        this._trips = trips;
    }

    get id() {
        return this._id;
    }

    get trips() {
        return this._trips;
    }

    set id(id) {
        this._id = id;
    }

    set trips(trips) {
        this._trips = trips;
    }

    addTrip(trip) {
        this._trips.push(trip);
    }

    removeTrip(index) {
        this._trips.splice(index,1);
    }
}