class Shop {
  constructor(id, shopName, pictureName, coupons, branches, shopManagers) {
    this.id = id;
    this.shopName = shopName;
    this.pictureName = pictureName;
    this.coupons = coupons;
    this.branches = branches;
    this.shopManagers = shopManagers;
  }
}

module.exports = Shop;
