
export interface ResponseType<T>{
    errorMessage?:string
    data:T| undefined
}