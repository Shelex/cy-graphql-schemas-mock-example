module.exports = {
    schema: {
        title: 'allPosts',
        type: 'object',
        additionalProperties: false,
        properties: {
            allPosts: {
                type: 'array',
                items: {
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
            },
            _allPostsMeta: {
                __typename: {
                    type: 'string',
                    enum: ['_QueryMeta']
                },
                count: {
                    type: 'integer',
                    minimum: 0
                }
            }
        }
    }
};
