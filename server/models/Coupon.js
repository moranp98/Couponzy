class Coupon {
  constructor(id, name, description, couponCode, pictureName, oldPrice, newPrice,
    published, expireDate, lastUpdated, couponType, shop){
      this.id = id;
      this.name = name;
      this.description = description;
      this.couponCode = couponCode;
      this.pictureName = pictureName;
      this.oldPrice = oldPrice;
      this.newPrice = newPrice;
      this.published = published;
      this.expireDate = expireDate;
      this.lastUpdated = lastUpdated;
      this.couponType = couponType;
      this.shop = shop;
    }
}

module.exports = Coupon;