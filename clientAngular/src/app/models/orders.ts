export interface Orders {
    orderNumber: string,
    orderDate: Date,
    coupon: {
        id: string,
        couponName: string,
        description: string,
        newPrice: Number,
        profile_Coupon: string,
        couponTypeId: string,
        couponTypeName: string
    },
    branch: {
        id: string,
        shopId: string,
        branchName: string,
        shopName: string,
        profile_Branch: string
    },
    user: {
        id: string,
        firstName: string,
        lastName: string,
        userID: string,
        profile_User: string
    }
}