/// <reference types="cypress" />
import { ui } from '../../support/components';

before(() => {
    Cypress.mocks = new Map();
});

context('Actions', () => {
    beforeEach(() => {
        // get all posts to receive first item id
        cy.send('allPosts')
            .then((res) => res.allPosts.shift())
            .then((firstPost) => {
                // set first item id to mock
                cy.mock(
                    'updatePost',
                    (firstPost) => ({
                        data: {
                            updatePost: {
                                __typename: 'Post',
                                id: firstPost.id,
                                votes: 10000000
                            }
                        }
                    }),
                    firstPost
                );
            });

        cy.visit('https://next-with-apollo.now.sh');
    });

    it('can show updated votes counter', () => {
        cy.get(ui.items.first)
            .find(ui.items.vote)
            .click()
            .invoke('text')
            .then((t) => parseInt(t))
            .should('be.eq', 10000000);
    });
});
