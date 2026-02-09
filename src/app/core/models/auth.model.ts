import { iterator } from "rxjs/internal/symbol/iterator"

export interface RegisterRequest{
    firstName: string,
    lastName:string,
    email: string,
    password: string
}

export interface LoginRequest{
    email: string,
    password: string
}