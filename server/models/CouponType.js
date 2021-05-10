class CouponType {
    constructor(id, couponTypeName, countOf_Coupons, isExists, lastUpdated){
        this.id = id;
        this.couponTypeName = couponTypeName;
        this.countOf_Coupons = countOf_Coupons;
        this.isExists = isExists;
        this.lastUpdated = lastUpdated;
      }
  }
  
  module.exports = CouponType;