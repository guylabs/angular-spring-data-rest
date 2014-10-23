describe("the spring data rest adapter", function () {

    beforeEach(beforeEachFunction);

    it("must process the response if a promise is given", function () {
        var testDeferred = this.q.defer();
        var testPromise = testDeferred.promise;

        var responseDataPromise = SpringDataRestAdapter.processWithPromise(testPromise);

        var config = this.config;

        responseDataPromise.then(function (processedResponseData) {

            // expect a resource and embeddedKeys key
            expect(processedResponseData[config.resourcesKey]).toBeDefined();
            expect(processedResponseData[config.embeddedNewKey]).toBeDefined();
        });

        testDeferred.resolve({data: mockData()});

        this.rootScope.$apply();
    });

    it("must not process the response if a promise is rejected", function () {
        var testDeferred = this.q.defer();
        var testPromise = testDeferred.promise;
        var errorMessage = "error";

        var responseDataPromise = SpringDataRestAdapter.processWithPromise(testPromise);

        responseDataPromise.then(
            function (processedResponseData) {
                throw new Exception("Should not be called when the promise is rejected")
            },
            function (error) {
                expect(error).toBe(errorMessage);
            });

        testDeferred.reject(errorMessage);

        this.rootScope.$apply();
    });

});

