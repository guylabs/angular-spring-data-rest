describe("the response", function () {

    beforeEach(beforeEachFunction);

    it("must not be the same reference", function () {
        this.processedDataPromise.then(function (processedData) {
            expect(this.rawResponse !== processedData).toBe(true);
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must be of the type object and must not be an array", function () {
        this.processedDataPromise.then(function (processedData) {
            expect(typeof processedData).toBe("object");
            expect(processedData instanceof Array).toBe(false);
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must contain a resource key which wraps the angular $resource method", function () {
        var resourcesKey = this.config.resourcesKey;
        var linksKey = this.config.linksKey;
        var httpBackend = this.httpBackend;

        this.processedDataPromise.then(function (processedData) {
            // the resource key must be defined
            expect(processedData[resourcesKey]).toBeDefined();

            // the resource value must be a valid function with the given parameters
            expectResourceExecution(processedData, resourcesKey,
                processedData[linksKey]["self"].href, httpBackend, "self");
        }, function (error) {
            fail(error)
        });
    });

    it("must retain all original object properties", function () {
        var linksKey = this.config.linksKey;
        var embeddedKey = this.config.embeddedKey;
        var rawResponse = this.rawResponse;

        this.processedDataPromise.then(function (processedData) {
            for (var key in rawResponse) {
                if (key !== linksKey && key !== embeddedKey) {
                    expect(processedData[key]).toEqual(rawResponse[key]);
                }
            }
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

});
