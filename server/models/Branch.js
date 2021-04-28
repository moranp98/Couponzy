class Branch { 
    constructor(id, name, address, phoneNumber, lat, long, isOpen, sellers){
        this.id = id;
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.lat = lat;
        this.long = long;
        this.isOpen = isOpen;
        this.sellers = sellers;
    }
}
  
module.exports = Branch;