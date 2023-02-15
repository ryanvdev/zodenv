import { CommonObject, EnvSchema } from "../types";
import {z} from 'zod';

export function envSchemaToZodSchema<T>(schema:EnvSchema<T>):z.ZodTypeAny{
    const shape:CommonObject = {} as any;

    for(const key in schema){
        shape[key] = schema[key].validator;
    }

    return z.object(shape);
}