export interface Reviews {
    id: string,
    coupon:{
        id: string,
        couponName: string,
        profile_Coupon: string
    },
    user:{
        id: string,
        firstName: string,
        lastName: string,
        profile_User: string
    },
    review_text: string,
    published_date: Date
}