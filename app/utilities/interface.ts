export interface Movie  {
 name: String
 genre: String
 length: Number
}

export interface Customer  {
 name: String
 phone: String
 isGold: Boolean
}

export interface Genre {
 name: String
 
}

export interface Rental {
 movieId: Number
 customerId: Number
}

export interface User {
 name: String
 email: String
 password: String
}