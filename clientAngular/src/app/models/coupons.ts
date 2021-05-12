export interface Coupons {
    id: string,
    couponName: string,
    description: string,
    couponId: string,
    profile_Coupon: string,
    oldPrice: Number,
    newPrice: Number,
    published: Date,
    expireDate: Date, 
    ratingAvg: Number,
    numOf_rating: Number,    
    isExists: Boolean,
    lastUpdated: Date,
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
