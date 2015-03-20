describe("the response with the embedded values", function () {

    beforeEach(beforeEachFunction);

    it("must not contain the 'embedded key' key anymore", function () {
        var embeddedKey = this.config.embeddedKey;

        this.processedDataPromise.then(function (processedData) {
            expect(processedData[embeddedKey]).not.toBeDefined();
        });

        this.rootScope.$apply();
    });

    it("must contain the 'embedded value key' as key", function () {
        var embeddedNewKey = this.config.embeddedNewKey;

        this.processedDataPromise.then(function (processedData) {
            expect(processedData[embeddedNewKey]).toBeDefined();
        });

        this.rootScope.$apply();
    });

    it("must be an array with the size of two", function () {
        var embeddedNewKey = this.config.embeddedNewKey;

        this.processedDataPromise.then(function (processedData) {
            // expect that the embedded key value is an array of the size 2
            expect(processedData[embeddedNewKey] instanceof Array).toBe(true);
            expect(processedData[embeddedNewKey].length).toBe(2);
        });

        this.rootScope.$apply();
    });

    it("must contain a resource key in all embedded values", function () {
        var embeddedNewKey = this.config.embeddedNewKey;
        var resourcesKey = this.config.resourcesKey;
        var linksKey = this.config.linksKey;
        var httpBackend = this.httpBackend;

        this.processedDataPromise.then(function (processedData) {
            // iterate over all entries of the embedded values and test the resource method
            for (var key in processedData[embeddedNewKey]) {

                // the resource key must be defined
                expect(processedData[embeddedNewKey][key][resourcesKey]).toBeDefined();

                // the resource value must be a valid function with the given parameters
                expectResourceExecution(processedData[embeddedNewKey][key], resourcesKey,
                    processedData[embeddedNewKey][key][linksKey]["self"].href, httpBackend, "self");
            }
        });

    });

    it("must call the correct href url if a link name is passed to the $resource method", function () {

        var embeddedNewKey = this.config.embeddedNewKey;
        var resourcesKey = this.config.resourcesKey;
        var httpBackend = this.httpBackend;

        // define the link names and the correct link href urls
        var linkNames = ["self", "parentCategory", "self", "parentCategory"];
        var linkHrefs = ["http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54",
            "http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54/parentCategory",
            "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697",
            "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/parentCategory"];

        var i = 0;
        var expectedCategoryIds = ['1230', '1231', '1232', '1233', '1234'];

        this.processedDataPromise.then(function (processedData) {
            // iterate over all entries of the embedded values and test the resource method
            for (var key in processedData[embeddedNewKey]) {

                for (var j = 0; j < 2; j++) {
                    // check if the underlying $resource method is called with the correct href url
                    var expectedResult = {categoryId: '123' + i};
                    httpBackend.whenGET(linkHrefs[i]).respond(200, expectedResult);
                    httpBackend.expectGET(linkHrefs[i]);

                    processedData[embeddedNewKey][key][resourcesKey](linkNames[i]).get().$promise.then(function (result) {
                        expect(expectedCategoryIds.indexOf(result.categoryId) > -1).toBe(true);
                    });

                    i++;
                }
            }
        });

        this.httpBackend.flush();
    });

    it("must have the named resources if the embeddedNamedResources is set to true", function () {
        var embeddedNewKey = this.config.embeddedNewKey;

        // set the new fetch function which throws an error if it is called
        springDataRestAdapterProvider.config({
            'embeddedNamedResources': true
        });
        this.processedDataPromise = SpringDataRestAdapter.process(this.rawResponse);

        this.processedDataPromise.then(function (processedData) {
            // expect that the first key of the embedded items is categories
            var key = Object.keys(processedData[embeddedNewKey])[0];
            expect(key).toBe("categories");

            // expect that the embedded key value is an array of the size 2
            expect(processedData[embeddedNewKey]['categories'] instanceof Array).toBe(true);
            expect(processedData[embeddedNewKey]['categories'].length).toBe(2);
        });

        this.rootScope.$apply();
    });

    it("must have multiple named resources if the embeddedNamedResources is set to true", function () {
        var embeddedNewKey = this.config.embeddedNewKey;

        // set the new fetch function which throws an error if it is called
        springDataRestAdapterProvider.config({
            'embeddedNamedResources': true
        });
        this.processedDataPromise = SpringDataRestAdapter.process(mockDataWithoutLinksKeyAndMultipleEmbeddedKeys());

        this.processedDataPromise.then(function (processedData) {
            // expect that the first key of the embedded items is categories
            var key = Object.keys(processedData[embeddedNewKey])[0];
            expect(key).toBe("categories");

            // expect that the second key of the embedded items is item
            var secondKey = Object.keys(processedData[embeddedNewKey])[1];
            expect(secondKey).toBe("item");

            // expect that the first embedded key value is an array of the size 2
            expect(processedData[embeddedNewKey]['categories'] instanceof Array).toBe(true);
            expect(processedData[embeddedNewKey]['categories'].length).toBe(2);

            // expect that the second embedded key value is an object
            expect(processedData[embeddedNewKey]['item'] instanceof Object).toBe(true);
            expect(processedData[embeddedNewKey]['item'].name).toBe('Test item 1');
        });

        this.rootScope.$apply();
    });

});
