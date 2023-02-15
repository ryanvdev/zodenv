import {z} from 'zod';
import { loadDotEnvFiles } from "./util/load";
import { standardConfig } from "./util/preprocessing";
import { envSchemaToZodSchema } from "./util/convert";
import { EnvSchema } from './types';

const zOptions = z.object({
    assignToProcessEnv: z.boolean().default(true),
    paths: z.array(z.string()).optional(),
});

export type EnvSchemaOptions = z.infer<typeof zOptions>;

export function envSchema
// Declare types
<
    Schema extends EnvSchema<Schema>
>
// Arguments
(
    schema:Schema,
    options?: Partial<EnvSchemaOptions>,
):
// Return type
{
    [k in keyof Schema]: z.infer<Schema[k]['validator']>
}
// ==========================================================
{
    const {
        paths,
        assignToProcessEnv
    } = zOptions.parse(options || {});

    const config = standardConfig(
        loadDotEnvFiles(paths),
        schema
    );

    const zSchema = envSchemaToZodSchema(schema);
    
    try{
        const result = zSchema.parse(config);

        if(assignToProcessEnv){
            Object.assign(process.env, result);
        }

        return result as any;
    }
    catch(e){
        if(e instanceof z.ZodError){
            throw new Error([
                'Invalid Environment:',
                '- Files: ',
                paths ? '    + ' + paths.join('\n    + ') : '',
                e.message
            ].join('\n'));
        }
        else{
            throw e;
        }
    }
}
