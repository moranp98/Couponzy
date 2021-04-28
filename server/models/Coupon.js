class Coupon {
  constructor(id, name, description, couponId, pictureName, oldPrice, newPrice,
    published, expireDate, lastUpdated, couponType, Shop){
      this.id = id;
      this.name = name;
      this.description = description;
      this.couponId = couponId;
      this.pictureName = pictureName;
      this.oldPrice = oldPrice;
      this.newPrice = newPrice;
      this.published = published;
      this.expireDate = expireDate;
      this.lastUpdated = lastUpdated;
      this.couponType = couponType;
      this.Shop = Shop;
    }
}

module.exports = Coupon;
