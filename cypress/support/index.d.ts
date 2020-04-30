/// <reference types="cypress" />
declare namespace Cypress {
    type GQLRequest = {
        operationName: string,
        variables: object,
        query: string
    };

    type Mock = (graphQLRequest?: GQLRequest, ...args: any) => string | object;

    interface Chainable<Subject> {
        /**
        * Command to validate JSON Schema with Cypress schema tools
        * @param fixturePath {string} - path to fixture file
        * @param options {object} - custom options
        *  - customAlias {fixtureName}, default: null - compare response with other JSON schema
        *  - version {semver}, default: '1.0.0' - checks for specific version
        * @example
        *  cy.validateSchema('voyage-estimator/getPortsList');
        * @returns {assertions}
        *   - schema: expected Object to be truthy
        *   - expected value to match json-schema getPortsListSchema
        * @example
        *  cy.validateSchema('voyage-estimator/getPortsList',
        * {
        *      version: '1.1.0',
        *      customAlias: 'port-information/getPortList'
        * });
        */
        validateSchema(fixturePath: string, options?: cypressSchemaOptions): Chainable<any>
        /**
        * Request for GraphQL endpoint
        * @param {string} fixturePath - path to fixture file.
        *  - Fixture mandatory properties: url {string}, request {object}.
        *  - Fixture optional properties: 
        *  - schema {object} - used for JSONSchema validation
        *  - operationName {string}, response {object} - used for mocks 
        * @param {object} updates - object with updates for requestBody
        *  - key {string}  - jsonpath to variable
        *  - value {any} - value of property
        * @param {object} options - object with possible options
        *  - assertions {boolean}, default: true - checks for code, status, no 'errors', exists 'data'
        *  - retries {int}, default: 0 - number of retries, function should be provided in next arg
        *  - function {function}, default: false - function to check response if request should be retried
        *  - url {string}, default: false - override request URL
        *  - request {string}, default: 'request' - override fixture property name for request
        * `
         const checkResponse(response) {
            let passed = response.body.data.items.length === 0
            if(!passed) {
               throw new Error('response validity check failed');
            }
         }`
        *  - timeout {int}, default: 0 - time to wait between retries
        * @example
         cy.send('voyage-estimator/getPortsList', 
         { 'variables.query': 'Liep' },
         { retries: 5, function: checkResponse, timeout: 1500 })
        * @example
         cy.send('voyage-estimator/getPortsList', 
         { 'variables.query': 'Liep' })
        * @returns {object} response: wraps response to alias 
         `${fixtureName}${Response}`,
         @example `getPortsListResponse`
        */
        send(fixturePath: string, update?: Object, options?: Object): Chainable<any>
        /**
         * Syntax sugar wrapper for multiple cy chain commands
         * to avoid callback hell will multiple `.then()`
         * @param {Chainable} command - command to execute
         * @example
         * cy.all(
         * cy.get(`@alias1`),
         * cy.get(`@alias2`),
         * cy.get(Shared.dropdown.list)
         * ).spread((alias1, alias2, $dropdown) => {
         * //returned values available here
         * })
         * @returns
         * array of returned values for each chainer
         * Could be used with  
         * `.spread((c1,c2,c3) => {})`  
         * or  
         * `.then(([c1,c2,c3]) => {})`  
         */
        all(...commands: Chainable<any>[]): Chainable<any>
        /**
         * clear all mocks from `Cypress.mocks`
         */
        mockReset(): void
        /**
         * register multiple mocks at once
         * @param queryToMockMap map of mocks
         * @param args local variables to use in mocks
         */
        mockMap(queryToMockMap: { [query: string]: Mock, }, ...args: any): void
        /**
         * register mock for specific query
         * @param query - operation name or name of query to mock
         * @param Mock - function with request as argument and response with object
         * @param args - in case you have some local variables to use in mock
         * properties could be returned from mock
         * "data" - object or string
         * `errors` - array of objects with property `message`
         * `statusCode` - integer
         */
        mock(query: string, Mock: Mock, ...args: any): void
        /**
         * Remove specific mock from `Cypress.mocks`
         * @param query - operation name or name of query to mock
         */
        mockRemove(query: string): void
    }

    interface Chainer<Subject> {
        /**
         * Checks object against JSON schema
         * [Documentation](https://github.com/cypress-io/schema-tools)
         */
        (chainer: 'matchSchema',
            fixtureName: string, options?: object): Chainable<String>
    }
    interface Cypress {
        mocks: Map<String, Function>
    }
}