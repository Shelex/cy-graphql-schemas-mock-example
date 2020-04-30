# Example of using cypress schema-tools and graphql mocking

-   [Test-app](https://next-with-apollo.now.sh/) has dynamic url for API, for now it is `simple/v1/cixmkt2ul01q00122mksg82pn` but last part will be changed, so all fixtures should be updated with new ID.

## API

-   [api](cypress/integration/api/api.spec.js) tests are validating responses against [JSON schemas](cypress/support/schemas).
-   Schemas are stored as js files which should be included into [schemas/index](cypress/support/schemas/index.js)
-   Custom JSON schema formats described in [schemas/formats](cypress/support/schemas/formats.js)
-   In order to avoid setting all properties as required in JSON shema - [normalizeRequired](cypress/support/schemas/normalizeRequired.js) script will set it all automatically, now you should explicitly set `required: false` to property is not required. Example:

```js
properties: {
                       votes: {
                           type: 'integer',
                           minimum: 0,
                           required: false
                       },
}
```

-   GraphQL requests are stored as fixture files
-   Schema title should match fixture fileName

## UI

-   [ui](cypress/integration/ui/ui.spec.js) tests are validating UI change with mocked graphql endpoint.
-   In case you are using some external data im mock object, you should pass it as argument
-   Mock could also have first argument `request` which will obviously match outgoing request.

## How to run:

-   clone this repo
-   install deps `yarn`
-   run tests: `yarn test`
