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
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // the resource value must be a valid function with the given parameters
        expectResourceExecution(this.response, this.config.resourcesKey, this.response[this.config.linksKey]["self"].href, this.httpBackend, "self");
    });

    it("must retain all original object properties", function () {
        for (var key in this.rawResponse) {
            if (key !== this.config.linksKey && key !== this.config.embeddedKey) {
                expect(this.response[key]).toEqual(this.rawResponse[key]);
            }
        }
    });

});
