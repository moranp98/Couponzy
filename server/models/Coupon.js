class Coupon {
  constructor(
    id,
    couponName,
    description,
    couponId,
    profile_Coupon,
    oldPrice,
    newPrice,
    published,
    expireDate,
    ratingAvg,
    numOf_rating,
    isExists,
    lastUpdated,
    couponType,
    shop
  ) {
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
    this.isExists = isExists;
    this.lastUpdated = lastUpdated;
    this.couponType = couponType;
    this.shop = shop;
  }
}

module.exports = Coupon;
