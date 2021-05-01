class CouponType {
    constructor(id, couponTypeName, countOf_Coupons, lastUpdated){
        this.id = id;
        this.couponTypeName = couponTypeName;
        this.countOf_Coupons = countOf_Coupons;
        this.lastUpdated = lastUpdated;
      }
  }
  
  module.exports = CouponType;