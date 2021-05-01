class Coupon {
  constructor(id, couponName, description, couponId, profile_Coupon, oldPrice, newPrice,
    published, expireDate, ratingAvg, numOf_rating, lastUpdated, couponType, Shop){
      this.id = id;
      this.couponName = couponName;
      this.description = description;
      this.couponId = couponId;
      this.profile_Coupon = profile_Coupon;
      this.oldPrice = oldPrice;
      this.newPrice = newPrice;
      this.published = published;
      this.expireDate = expireDate;
      this.ratingAvg = ratingAvg;
      this.numOf_rating = numOf_rating;
      this.lastUpdated = lastUpdated;
      this.couponType = couponType;
      this.Shop = Shop;
    }
}

module.exports = Coupon;
