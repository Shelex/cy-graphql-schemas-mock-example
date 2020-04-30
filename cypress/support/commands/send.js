const { _ } = Cypress;
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
 * @example
 * cy.send('someFolder/fixtureFile',
 * { 'variables.query': 'qwerty' },
 * @returns {object} response: wraps response to alias
 * `${fixtureName}${Response}`,
 * @example `fixtureFileResponse`
 */

Cypress.Commands.add(
    'send',
    (
        fixtureName,
        updates = {},
        options = {
            assertions: true,
            url: false,
            request: false
        }
    ) => {
        cy.fixture(fixtureName).then((fixtureData) => {
            _.forIn(updates, (value, path) =>
                _.set(fixtureData.request, path, value)
            );
            const url = `${Cypress.env('apiURL')}${
                options.url || fixtureData.url
            }`;
            cy.request({
                method: 'POST',
                url: url,
                headers: {
                    'content-type': 'application/json'
                },
                body: options.request
                    ? fixtureData[options.request]
                    : fixtureData.request,
                failOnStatusCode: false
            }).then((response) => {
                options.assertions && assertResponse(response);
                return cy
                    .wrap(response.body.data)
                    .as(`${fixtureName.split('/').pop()}Response`);
            });
        });
    }
);

/**
 * Check status, statusText and errors separately
 * and then assert that request is successful
 * in case any of assertions fail - show readable message.
 */
const assertResponse = (response) => {
    const correctStatus = _.has(response, 'status') && response.status === 200;
    const correctStatusText =
        _.has(response, 'statusText') && response.statusText === 'OK';
    const errorsFound = _.has(response, 'body.errors');
    const errorMessages = null;
    if (errorsFound) {
        const apiErrors = _.get(response, 'body.errors');
        if (apiErrors.length === 1) {
            const { path, message } = apiErrors[0];
            errorMessages = `${path} > ${message}`;
        } else {
            errorMessages = JSON.stringify(apiErrors, null, 2);
        }
    }
    expect(correctStatus && correctStatusText && !errorsFound).to.be.eq(
        true,
        `ApiAssertions > status:${response.status}, statusText:${response.statusText}, errors:${errorMessages}`
    );
};
