import path from 'node:path';
import { describe, test, expect } from 'vitest';
import { z } from 'zod';
import envSchema from '../lib';


describe('schema', () => {
    const convertStringToInteger = (v:string):number|undefined => {
        const tmp = parseInt(v);
        return isFinite(tmp) ? tmp : undefined;
    }

    const config = envSchema({
        PORT: {
            preprocessing: convertStringToInteger,
            validator: z.number().default(80),
        },
        DB_PORT: {
            preprocessing: convertStringToInteger,
            validator: z.number().finite().int().min(1).max(2**16 - 1),
        },
        DB_NAME: {
            validator: z.string()
        },
        DB_PASSWORD: {
            validator: z.string(),
        },
        ACCEPT_EXTENSIONS: {
            validator: z.string().transform((v) => {
                return v.split(';').map(item => item.trim());
            })
        },
        NODE_ENV: {
            validator: z.enum(['development', 'production', 'test']).default('test'), 
        }
    }, {
        paths: [
            path.join(__dirname, './.test.env'),
            path.join(__dirname, '././.test..env.development'), 
        ]
    });


    test('Basic', () => {
        expect(config).toEqual({
            PORT: 80,
            DB_PORT: 9999,
            DB_NAME: 'my_db',
            DB_PASSWORD: 'my_password',
            ACCEPT_EXTENSIONS: ['jpg', 'jpeg', 'png'],
            NODE_ENV: 'test',
        } as typeof config);
    });


    test('Process env', () => {
        expect(process.env.DB_PASSWORD).toBe('my_password')
    });
});