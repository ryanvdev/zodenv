import { ZodTypeAny } from "zod";

export type MapType<V, Keys extends (string|number|symbol) = string|number|symbol> = {
    [K in Keys]: V
}

export type CommonObject = {
    [k:string]:any;
}


export type EnvSchema<T> = {
    [k in keyof T]: {
        preprocessing?: (v:string) => any,
        validator: ZodTypeAny,
    }
}