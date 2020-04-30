import { versionSchemas, bind, combineSchemas } from '@cypress/schema-tools';
import { normalizeRequiredProperties } from './normalizeRequired';
import { formats } from './formats';

const schemaObjects = [
    require('./allPosts'),
    require('./createPost'),
    require('./updatePost')
];

const convertPlainObjectsToSchema = (arrayOfPlainObjects) => {
    const versionedSchemaArray = arrayOfPlainObjects.map((plainObject) => {
        const normalizedObject = {
            // automatically set all properties to be required
            // to avoid duplicating it every time
            schema: normalizeRequiredProperties(plainObject.schema)
        };
        Cypress._.defaults(normalizedObject, {
            version: {
                major: 1,
                minor: 0,
                patch: 0
            },
            example: {}
        });
        return versionSchemas(normalizedObject);
    });
    const schema = bind({
        schemas: combineSchemas(...versionedSchemaArray),
        formats: formats
    });
    return schema;
};

export const api = () => {
    return convertPlainObjectsToSchema(schemaObjects);
};
