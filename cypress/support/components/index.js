const ui = {
    form: {
        root: `form`,
        get submit() {
            return `${this.root} > button:contains("Submit")`;
        },
        get title() {
            return `${this.root} input[name="title"]`;
        },
        get url() {
            return `${this.root} input[name="url"]`;
        }
    },
    items: {
        all: `section ul li`,
        get first() {
            return `${this.all}:first`;
        },
        get counter() {
            return `div > span`;
        },
        get title() {
            return `div > a`;
        },
        get vote() {
            return `div > button`;
        }
    },
    showMore: `button:contains("Show More")`
};

export { ui };
