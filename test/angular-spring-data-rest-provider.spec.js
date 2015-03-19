describe("the spring data rest adapter", function () {

    beforeEach(beforeEachFunction);

    it("must throw an exception if the data object is not an object", function () {
        var array = [1, 2, 3];
        SpringDataRestAdapter.process(array).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error).toEqual("Given data '" + array + "' is not of type object.")
        });

        var integer = 123;
        SpringDataRestAdapter.process(integer).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error).toEqual("Given data '" + integer + "' is not of type object.")
        });

        var string = "123";
        SpringDataRestAdapter.process(string).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error).toEqual("Given data '" + string + "' is not of type object.")
        });
    });

    it("must throw an exception if the data object is null", function () {
        SpringDataRestAdapter.process(null).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error).toEqual("Given data '" + null + "' is not of type object.")
        });
    });

    it("must throw an exception if the fetch links parameter is not an array or a string", function () {
        var fetchLinkNames = 123;
        SpringDataRestAdapter.process({}, fetchLinkNames).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error).toEqual("Given fetch links '" + fetchLinkNames + "' is not of type array or string.")
        });

        fetchLinkNames = {'object': 'object'};
        SpringDataRestAdapter.process({}, fetchLinkNames).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error).toEqual("Given fetch links '" + fetchLinkNames + "' is not of type array or string.")
        });
    });

    it("must only add the resource method if there is a links key in the data object", function () {
        this.rawResponse = mockDataWithoutLinksKey();
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // expect that the links key and the resource method is not present
            expect(processedData[this.config.linksKey]).not.toBeDefined();
            expect(processedData[this.config.resourcesKey]).not.toBeDefined();
        });
    });

    it("must only add the embedded value key if there is a embedded key in the data object", function () {
        this.rawResponse = mockDataWithoutEmbeddedKey();
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // expect that the embedded key and value is not present
            expect(processedData[this.config.embeddedKey]).not.toBeDefined();
            expect(processedData[this.config.embeddedNewKey]).not.toBeDefined();
        });
    });

    it("must return the original data object if no links key or embedded key is present", function () {
        this.rawResponse = mockDataWithoutAnyKey();
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {

            // expect that the links key and the resource method is not present
            expect(processedData[this.config.linksKey]).not.toBeDefined();
            expect(processedData[this.config.resourcesKey]).not.toBeDefined();

            // expect that the embedded key and value is not present
            expect(processedData[this.config.embeddedKey]).not.toBeDefined();
            expect(processedData[this.config.embeddedNewKey]).not.toBeDefined();

            // check that the original response is the one which is returned
            expect(this.rawResponse === processedData).toBe(true);
        });
    });

});

