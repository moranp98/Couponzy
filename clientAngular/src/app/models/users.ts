
export interface Users {
    id: string,
    active: Boolean,
    address:{
        city: string,
        street: string,
        country: string
    },
    age: number,
    birthday:string,
    lastUpdated: Date,
    created_at: Date,
    employerid: string,
    gender: string,
    lat: string,
    long: string,
    maritalstatus: string,
    role: string,
    userid: string,
    email: string,
    username:{
        firstname: string,
        lastname: string
    },
    phoneNumber: string,
    orders: string,
    shop:string    
}