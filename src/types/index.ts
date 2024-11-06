
export interface ResponseType<T>{
    errorMessage?:string
    message?:string,
    data:T| null
    
}