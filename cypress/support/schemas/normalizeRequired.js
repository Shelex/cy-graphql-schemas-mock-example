const { _ } = Cypress;

export const normalizeRequiredProperties = (schema) => {
    if (schema.required !== false) {
        if (schema.properties) {
            const findRequiredProperties = (schema) =>
                _.reduce(schema.properties, reducer, []);
            const reducer = (memo, obj, key) => {
                if (obj) {
                    // object
                    if (
                        obj.type === 'object' &&
                        obj.properties &&
                        obj.required !== false
                    ) {
                        obj.required = findRequiredProperties(obj);
                    }
                    // array
                    else if (
                        obj.type === 'array' &&
                        _.get(obj.items, 'type') === 'object'
                    ) {
                        obj.items.required = findRequiredProperties(obj.items);
                    }
                    // default
                    else if (obj.required !== false) {
                        memo.push(key);
                    }
                }
                return memo;
            };

            schema.required = findRequiredProperties(schema);
        } else {
            schema.required = [];
        }
    }
    return schema;
};
