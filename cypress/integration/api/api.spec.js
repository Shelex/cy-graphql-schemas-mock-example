context('API', () => {
    it('matches schema vs allPosts', () => {
        cy.send('allPosts').should('matchSchema', 'allPosts');
    });

    it('matches schema vs updatePost', () => {
        cy.send('updatePost').should('matchSchema', 'updatePost');
    });

    it('matches schema vs updatePost', () => {
        cy.send('createPost');
        cy.get('@createPostResponse').should('matchSchema', 'createPost');
    });
});
