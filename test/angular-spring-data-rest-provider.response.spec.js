describe("the response", function () {

    beforeEach(beforeEachFunction);

    it("must not be the same reference", function () {
        this.processedDataPromise.then(function (processedData) {
            expect(this.rawResponse !== processedData).toBe(true);
        });

    });

    it("must be of the type object and must not be an array", function () {
        this.processedDataPromise.then(function (processedData) {
            expect(typeof processedData).toBe("object");
            expect(processedData instanceof Array).toBe(false);
        });
    });

    it("must contain a resource key which wraps the angular $resource method", function () {
        this.processedDataPromise.then(function (processedData) {
            // the resource key must be defined
            expect(processedData[this.config.resourcesKey]).toBeDefined();

            // the resource value must be a valid function with the given parameters
            expectResourceExecution(processedData, this.config.resourcesKey,
                processedData[this.config.linksKey]["self"].href, this.httpBackend, "self");
        });
    });

    it("must retain all original object properties", function () {
        this.processedDataPromise.then(function (processedData) {
            for (var key in this.rawResponse) {
                if (key !== this.config.linksKey && key !== this.config.embeddedKey) {
                    expect(processedData[key]).toEqual(this.rawResponse[key]);
                }
            }
        });
    });

});
