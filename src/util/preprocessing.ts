import { EnvSchema, MapType } from "../types";


export function standardConfig<T>(rawConfig:MapType<string>, schema:EnvSchema<T>){
    const config:MapType<any> = {};

    for(const key in schema) {
        const preprocessing = schema[key].preprocessing;
        const value = process.env[key] || rawConfig[key];

        if(preprocessing){
            config[key] = preprocessing(value);
        }
        else {
            config[key] = value;
        }
    }

    return config;
}