/* eslint-disable no-invalid-this */
// how to add a custom Chai assertion to Cypress
// see "Adding Chai Assertions" recipe in
// https://github.com/cypress-io/cypress-example-recipes
import { api } from './schemas';

const isFollowingSchema = (_chai, utils) => {
    function assertFollowingSchema(fixturePath, schemaVersion = '1.0.0') {
        const fixtureName = fixturePath.split('/').pop();
        this.assert(
            api().assertSchema(fixtureName, schemaVersion)(this._obj),
            `expected subject to follow schema **${fixtureName}@${schemaVersion}**`,
            `expected subject NOT to follow schema **${fixtureName}@${schemaVersion}**`,
            this._obj
        );
    }

    _chai.Assertion.addMethod('matchSchema', assertFollowingSchema);
};
chai.use(isFollowingSchema);
