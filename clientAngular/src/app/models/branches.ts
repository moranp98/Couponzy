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
    lon: Number,
    isOpen: Boolean,
    stateOpen: string,
    isExists: boolean, 
    lastUpdated: Date, 
    shop:{
        id: string,
        shopName: string,
        profile_Shop: string
    },
    sellers: Array<any>
}