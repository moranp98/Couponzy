class Branch { 
    constructor(id, branchName, profile_Branch, address, phoneNumber, lat, lon, isOpen, isExists, lastUpdated, shop, sellers=[]){
        this.id = id;
        this.branchName = branchName;
        this.profile_Branch = profile_Branch;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.lat = lat;
        this.lon = lon;
        this.isOpen = isOpen;
        this.isExists = isExists;
        this.lastUpdated = lastUpdated;
        this.shop = shop;
        this.sellers = sellers;
    }
}
  
module.exports = Branch;