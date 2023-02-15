import fs from 'node:fs';
import { parse } from 'dotenv';
import { MapType } from '../types';

export function loadDotEnvFiles(filepaths?:string[]):MapType<string> {
    if(!filepaths || filepaths.length === 0){
        return {};
    }

    const config:MapType<string> = {};
    for(const envFilepath of filepaths){
        const data = fs.readFileSync(envFilepath, {encoding: 'utf-8'});
        Object.assign(config, parse(data));
    }

    return config;
}