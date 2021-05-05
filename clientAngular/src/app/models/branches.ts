export interface Branches {
    id: string,
    branchName: string,
    profile_Branch: string,
    address:{
        city: string,
        street: string,
        country: string
    },
    phoneNumber: string,
    lat: Number,
    long: Number,
    isOpen: Boolean,
    stateOpen: string, 
    lastUpdated: Date, 
    shop:{
        id: string,
        profile_Shop: string,
        shopName: string
    },
    sellers: Array<any>
}
