module.exports = {
    schema: {
        title: 'createPost',
        type: 'object',
        additionalProperties: false,
        properties: {
            createPost: {
                type: 'object',
                properties: {
                    votes: {
                        type: 'integer',
                        minimum: 0
                    },
                    url: {
                        type: 'string'
                    },
                    id: {
                        type: 'string'
                    },
                    title: {
                        type: 'string'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time'
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
