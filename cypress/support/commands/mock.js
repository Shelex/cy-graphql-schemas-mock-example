Cypress.Commands.add('mockReset', () => {
    Cypress.mocks.clear();
    Cypress.log({
        name: `MOCK`,
        message: `ALL RESET`
    });
});

Cypress.Commands.add('mockMap', (mocks, ...args) => {
    for (const [query, func] of Object.entries(mocks)) {
        cy.mock(query, func, ...args);
    }
});

Cypress.Commands.add('mock', (query, func, ...args) => {
    Cypress.mocks.set(query, {
        mock: func.toString(),
        args: args
    });
    Cypress.log({
        name: `MOCK`,
        message: `QUERY: ${query}`,
        consoleProps: () => ({
            query: query,
            mock: func,
            args: args
        })
    });
});

Cypress.Commands.add('mockRemove', (query) => {
    Cypress.mocks.delete(query);
    Cypress.log({
        name: `MOCK`,
        message: `REMOVED QUERY: ${query}`
    });
});

Cypress.on('window:before:load', (win) => {
    win.fetch = null;
    const { open } = win.XMLHttpRequest.prototype;
    if (!win.open) {
        win.open = open;
    }

    win.XMLHttpRequest.prototype.open = function (method, url) {
        if (
            method !== 'POST' ||
            !url.includes(Cypress.env('apiURL')) ||
            Cypress.mocks.size === 0
        ) {
            open.call(this, method, url);
            return;
        }
        this.mocked = false;
        this.addEventListener('readystatechange', (event) => {
            if (event.target.readyState !== 4) {
                return;
            }
            if (this.mocked) {
                return;
            }

            const query = event.target.graphQLQuery;
            let { response } = event.target;

            try {
                const jResponse = JSON.parse(response);
                if (jResponse.data) {
                    response = JSON.stringify(jResponse.data);
                }
            } catch (e) {
                response = '<mocked Data>';
            }
        });

        const { send } = this;
        this.send = (x) => {
            try {
                const request = JSON.parse(x.replace(/\n/g, ' '));
                if (!request.operationName && request.query.includes('{')) {
                    /**
                     * parse query in case we have no operationName
                     * {"operationName":null,"variables":{},"query":"{\n  ranks {\n  ...}
                     * will take `ranks` here
                     */
                    const query = request.query.split('{')[1].trim();
                    const queryName = query.includes('(')
                        ? query.split('(').shift()
                        : query;
                    this.graphQLQuery = queryName;
                } else {
                    this.graphQLQuery = request.operationName;
                }

                const mockItem = Cypress.mocks.get(this.graphQLQuery);

                if (!mockItem) {
                    send.call(this, x);
                    return;
                }
                const { mock, args } = mockItem;

                Object.defineProperty(this, 'response', { writable: true });
                Object.defineProperty(this, 'responseText', {
                    writable: true
                });
                Object.defineProperty(this, 'status', { writable: true });
                Object.defineProperty(this, 'readyState', {
                    writable: true
                });
                // add request argument if needed
                mock.includes('(request') && args.unshift(request);
                const { data, errors, statusCode } = eval(`(${mock})`)(...args);

                const mockedResponse = {
                    data: data,
                    loading: false,
                    networkStatus: 7,
                    stale: false
                };
                errors && (mockedResponse.errors = errors);

                this.response = this.responseText = JSON.stringify(
                    mockedResponse
                );
                this.status = statusCode || 200;
                this.readyState = 4;
                this.mocked = true;
                this.dispatchEvent(new CustomEvent('loadstart'));
                this.dispatchEvent(new CustomEvent('progress'));
                this.dispatchEvent(new CustomEvent('load'));
                this.dispatchEvent(new CustomEvent('loadend'));
                Cypress.log({
                    name: `MOCKED`,
                    message: `QUERY: ${this.graphQLQuery}`,
                    consoleProps: () => ({
                        request: request,
                        response: mockedResponse,
                        code: this.status
                    })
                });
            } catch (e) {
                console.info('Could not parse graphQL request. Asking API.');
                console.error(e);
                send.call(this, x);
            }
        };
        open.call(this, method, url);
    };
});
