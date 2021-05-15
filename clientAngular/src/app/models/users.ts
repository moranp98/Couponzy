
export interface Users {
    id: string,
    userName:{
        firstName: string,
        lastName: string
    },
    email: string,
    userID: string,
    phoneNumber: string,
    profile_User: string,
    birthday:string,
    gender: string,
    age: number,
    maritalstatus: string,
    address:{
        city: string,
        zipcode: string,
        country: string
    },
    lat: Number,
    long: Number,
    active: Boolean,
    role: string,
    employerId: string,
    created_at: Date,
    lastUpdated: Date,
    shop: string
}