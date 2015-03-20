describe("the spring data rest adapter", function () {

    beforeEach(beforeEachFunction);

    it("must process the response if a promise is given", function () {
        var testDeferred = this.q.defer();
        var testPromise = testDeferred.promise;

        var resourcesKey = this.config.resourcesKey;
        var embeddedNewKey = this.config.embeddedNewKey;

        SpringDataRestAdapter.process(testPromise).then(function (processedResponseData) {
            // expect a resource and embeddedKeys key
            expect(processedResponseData[resourcesKey]).toBeDefined();
            expect(processedResponseData[embeddedNewKey]).toBeDefined();
        });

        testDeferred.resolve(mockData());
        this.rootScope.$apply();
    });

    it("must process the response if a http promise is given", function () {
        var testDeferred = this.q.defer();
        var testPromise = testDeferred.promise;

        var resourcesKey = this.config.resourcesKey;
        var embeddedNewKey = this.config.embeddedNewKey;

        SpringDataRestAdapter.process(testPromise).then(function (processedResponseData) {
            // expect a resource and embeddedKeys key
            expect(processedResponseData[resourcesKey]).toBeDefined();
            expect(processedResponseData[embeddedNewKey]).toBeDefined();
        });

        testDeferred.resolve({data: mockData()});
        this.rootScope.$apply();
    });

    it("must not process the response if a promise is rejected", function () {
        var testDeferred = this.q.defer();
        var testPromise = testDeferred.promise;
        var errorMessage = "error";

        SpringDataRestAdapter.process(testPromise).then(
            function (processedResponseData) {
                throw new Error("Should not be called when the promise is rejected")
            },
            function (error) {
                expect(error).toBe(errorMessage);
            });

        testDeferred.reject(errorMessage);
        this.rootScope.$apply();
    });

});

