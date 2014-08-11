describe("the response", function () {

    beforeEach(beforeEachFunction);

    it("must not be the same reference", function () {
        expect(this.rawResponse !== this.response).toBe(true);
    });

    it("must be of the type object and must not be an array", function () {
        expect(typeof this.response).toBe("object");
        expect(this.response instanceof Array).toBe(false);
    });

    it("must contain a resource key which wraps the angular $resource method", function () {

        // the resource key must be defined
        expect(this.response[this.config.resourceKey]).toBeDefined();

        // the resource value must be a valid function with the given parameters
        spyOnResourceExecution(this.response, this.config.resourceKey);
    });

    it("must retain all original object properties", function () {
        for (var key in this.rawResponse) {
            if (key !== this.config.links.key && key !== this.config.embedded.key) {
                expect(this.response[key]).toEqual(this.rawResponse[key]);
            }
        }
    });

});
