module.exports = {
    schema: {
        title: 'updatePost',
        type: 'object',
        additionalProperties: false,
        properties: {
            updatePost: {
                type: 'object',
                properties: {
                    votes: {
                        type: 'integer',
                        minimum: 0
                    },
                    id: {
                        type: 'string'
                    },
                    __typename: {
                        type: 'string',
                        enum: ['Post']
                    }
                }
            }
        }
    }
};
