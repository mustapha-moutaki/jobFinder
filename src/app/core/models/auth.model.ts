import { iterator } from "rxjs/internal/symbol/iterator"

export interface RegisterRequest{
    id?:number,
    firstName: string,
    lastName:string,
    email: string,
    password: string
}

export interface LoginRequest{
    email: string,
    password: string
}

export interface UserResponse{
     id?:number,
    firstName: string,
    lastName:string,
    email: string,
}