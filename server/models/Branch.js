class Branch { 
    constructor(id, branchName, profile_Branch, address, phoneNumber, lat, long, isOpen, lastUpdated, shop, sellers=[]){
        this.id = id;
        this.branchName = branchName;
        this.profile_Branch = profile_Branch;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.lat = lat;
        this.long = long;
        this.isOpen = isOpen;
        this.lastUpdated = lastUpdated;
        this.shop = shop;
        this.sellers = sellers;
    }
}
  
module.exports = Branch;