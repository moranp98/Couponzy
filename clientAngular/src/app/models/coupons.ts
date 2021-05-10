export interface Coupons {
    id: string,
    couponName: string,
    description: string,
    profile_Coupon: string,
    oldPrice: Number,
    newPrice: Number,
    published: Date,
    expireDate: Date, 
    isExpired: Boolean,
    ratingAvg: Number,
    numOf_rating: Number,    
    lastUpdated: Number,
    couponType:{
        id: string,
        couponTypeName: string
    }
    shop:{
        id: string,
        shopName: string,
        profile_Shop: string
    }
}
