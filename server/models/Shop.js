class Shop {
  constructor(id, shopName, profile_Shop, isExists, lastUpdated, coupons=[], branches=[], shopManagers=[]) {
    this.id = id;
    this.shopName = shopName;
    this.profile_Shop = profile_Shop;
    this.isExists = isExists;
    this.lastUpdated = lastUpdated;
    this.coupons = coupons;
    this.branches = branches;
    this.shopManagers = shopManagers;
  }
}

module.exports = Shop;
