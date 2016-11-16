describe("the fetch function", function () {

    beforeEach(beforeEachFunction);

    it("must not call any href url of a link if no fetch link names are given", function () {
        var fetchFunctionConfiguration = {
            'fetchFunction': function () {
                throw new Error("The method must not be called.")
            }
        };

        // set the new fetch function which throws an error if it is called
        springDataRestAdapterProvider.config(fetchFunctionConfiguration);
        this.processedDataPromise = SpringDataRestAdapter.process(this.rawResponse);
    });

    it("must call the correct href url if an existing fetch link name is given", function () {

        var embeddedNewKey = this.config.embeddedNewKey;
        var fetchLinkName = 'parentCategory';

        // the correct link href url
        var firstParentCategoryHref = 'http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54/parentCategory';
        var secondParentCategoryHref = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/parentCategory';

        // check if the underlying fetch function is called with the correct href url
        var firstExpectedResult = {parentCategory: '1'};
        var secondExpectedResult = {parentCategory: '2'};

        this.httpBackend.whenGET(firstParentCategoryHref).
            respond(200, firstExpectedResult);
        this.httpBackend.expectGET(firstParentCategoryHref);

        this.httpBackend.whenGET(secondParentCategoryHref).
            respond(200, secondExpectedResult);
        this.httpBackend.expectGET(secondParentCategoryHref);

        SpringDataRestAdapter.process(this.rawResponse, fetchLinkName).then(function (processedData) {
            // expect the fetched objects
            expect(processedData[embeddedNewKey][0][fetchLinkName]).toEqual(firstExpectedResult);
            expect(processedData[embeddedNewKey][1][fetchLinkName]).toEqual(secondExpectedResult);
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must call all links if the fetch all link names key", function () {

        var embeddedNewKey = this.config.embeddedNewKey;

        // the correct link href url
        var testLinkHref = 'http://localhost:8080/categories/testLink';
        var firstParentCategoryHref = 'http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54/parentCategory';
        var secondParentCategoryHref = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/parentCategory';
        var testParentCategoryHref = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/testCategory';

        // check if the underlying fetch function is called with the correct href
        var testLinkExpectedResult = {testLink: 'test'};
        var firstParentCategoryExpectedResult = {parentCategory: '1'};
        var secondParentCategoryExpectedResult = {parentCategory: '2'};
        var testParentCategoryExpectedResult = {testCategory: 'test'};

        this.httpBackend.whenGET(testLinkHref).
            respond(200, testLinkExpectedResult);
        this.httpBackend.expectGET(testLinkHref);

        this.httpBackend.whenGET(firstParentCategoryHref).
            respond(200, firstParentCategoryExpectedResult);
        this.httpBackend.expectGET(firstParentCategoryHref);

        this.httpBackend.whenGET(secondParentCategoryHref).
            respond(200, secondParentCategoryExpectedResult);
        this.httpBackend.expectGET(secondParentCategoryHref);

        this.httpBackend.whenGET(testParentCategoryHref).
            respond(200, testParentCategoryExpectedResult);
        this.httpBackend.expectGET(testParentCategoryHref);

        SpringDataRestAdapter.process(this.rawResponse, this.config.fetchAllKey).then(function (processedData) {
            // expect the fetched objects
            expect(processedData['testLink']).toEqual(testLinkExpectedResult);
            expect(processedData[embeddedNewKey][0]['parentCategory']).toEqual(firstParentCategoryExpectedResult);
            expect(processedData[embeddedNewKey][1]['parentCategory']).toEqual(secondParentCategoryExpectedResult);
            expect(processedData[embeddedNewKey][1]['testCategory']).toEqual(testParentCategoryExpectedResult);
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must call all links of the given fetch link names array", function () {

        var embeddedNewKey = this.config.embeddedNewKey;
        var fetchLinkNames = ['testLink', 'testCategory'];

        // the correct link href url
        var testLinkHref = 'http://localhost:8080/categories/testLink';
        var testParentCategoryHref = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/testCategory';

        // check if the underlying fetch function is called with the correct href
        var testLinkExpectedResult = {testLink: 'test'};
        var testParentCategoryExpectedResult = {testCategory: 'test'};

        this.httpBackend.whenGET(testLinkHref).
            respond(200, testLinkExpectedResult);
        this.httpBackend.expectGET(testLinkHref);

        this.httpBackend.whenGET(testParentCategoryHref).
            respond(200, testParentCategoryExpectedResult);
        this.httpBackend.expectGET(testParentCategoryHref);

        SpringDataRestAdapter.process(this.rawResponse, fetchLinkNames).then(function (processedData) {
            // expect the fetched objects
            expect(processedData[fetchLinkNames[0]]).toEqual(testLinkExpectedResult);
            expect(processedData[embeddedNewKey][1][fetchLinkNames[1]]).toEqual(testParentCategoryExpectedResult);
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must call all links with the same name of the given fetch link names array", function () {

        var embeddedNewKey = this.config.embeddedNewKey;
        var fetchLinkNames = ['testCategory'];

        // the correct link href url
        var testTestCategoryHref = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/testCategory';
        var testTestCategory2Href = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/testCategory2';

        // check if the underlying fetch function is called with the correct href
        var testTestCategoryExpectedResult = {
            "version": 0,
            "creationDate": 1406219870650,
            "modificationDate": 1406219870650,
            "name": "Test category 1",
            "_links": {
                "self": {
                    "href": "http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54"
                },
                "testCategory": {
                    "href": "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/testCategory2"
                }
            }
        };
        var testTestCategory2ExpectedResult = {testCategory: 'test'};

        this.httpBackend.whenGET(testTestCategoryHref).
        respond(200, testTestCategoryExpectedResult);
        this.httpBackend.expectGET(testTestCategoryHref);

        this.httpBackend.whenGET(testTestCategory2Href).
        respond(200, testTestCategory2ExpectedResult);
        this.httpBackend.expectGET(testTestCategory2Href);

        SpringDataRestAdapter.process(mockDataWithMultipleEmbeddedItemsAndSameLinks(), fetchLinkNames, true, true).then(function (processedData) {
            // expect the fetched objects
            expect(processedData[embeddedNewKey][0][fetchLinkNames[0]].name).toEqual("Test category 1");
            expect(processedData[embeddedNewKey][0][fetchLinkNames[0]][fetchLinkNames[0]].testCategory).toEqual("test");
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must process the fetched response recursively if the flag is set", function () {

        var embeddedNewKey = this.config.embeddedNewKey;
        var resourcesKey = this.config.resourcesKey;
        var fetchLinkName = 'parentCategory';

        // the correct link href url
        var firstParentCategoryHref = 'http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54/parentCategory';
        var secondParentCategoryHref = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/parentCategory';

        // check if the underlying fetch function is called with the correct href url
        var firstExpectedResult = mockDataWithoutEmbeddedKey();
        var secondExpectedResult = mockDataWithoutEmbeddedKey();

        this.httpBackend.whenGET(firstParentCategoryHref).
            respond(200, firstExpectedResult);
        this.httpBackend.expectGET(firstParentCategoryHref);

        this.httpBackend.whenGET(secondParentCategoryHref).
            respond(200, secondExpectedResult);
        this.httpBackend.expectGET(secondParentCategoryHref);

        SpringDataRestAdapter.process(this.rawResponse, fetchLinkName, true).then(function (processedData) {
            // expect the recursively fetched objects
            expect(typeof processedData[embeddedNewKey][0][fetchLinkName][resourcesKey] == 'function').
                toEqual(true);
            expect(typeof processedData[embeddedNewKey][1][fetchLinkName][resourcesKey] == 'function').
                toEqual(true);
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("it must call the overridden fetch function with the given resource name", function () {

        // define the fetch link name
        var fetchLinkName = 'parentCategory';

        // define the new fetch function
        var i = 0, localConfig = this.config;
        var fetchFunctionConfiguration = {
            'fetchFunction': function (inUrl, inKey, inData, inFetchLinkNames, inRecursive) {
                if (i == 0) {
                    expect(inUrl).toEqual("http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54/parentCategory");
                    expect(inKey).toEqual(fetchLinkName);
                    expect(inData[localConfig.linksKey][localConfig.linksSelfLinkName][localConfig.linksHrefKey]).
                        toEqual("http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54");
                    expect(inFetchLinkNames).toEqual(fetchLinkName);
                    expect(inRecursive).toEqual(undefined);
                    i++;
                } else if (i == 1) {
                    expect(inUrl).toEqual("http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/parentCategory");
                    expect(inKey).toEqual(fetchLinkName);
                    expect(inData[localConfig.linksKey][localConfig.linksSelfLinkName][localConfig.linksHrefKey]).
                        toEqual("http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697");
                    expect(inFetchLinkNames).toEqual(fetchLinkName);
                    expect(inRecursive).toEqual(undefined);
                    i++;
                } else if (i > 1) {
                    throw new Error("The method must not be called three times");
                }
            }
        };

        // set the new fetch function and create a new spring data rest adapter
        springDataRestAdapterProvider.config(fetchFunctionConfiguration);
        this.response = SpringDataRestAdapter.process(this.rawResponse, fetchLinkName);

        this.rootScope.$apply();
    });

    it("must reject the promise if the status code is not between 200 - 299 and not a 404", function () {

        var fetchLinkName = 'testCategory';

        // the correct link href url
        var testCategoryHref = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/testCategory';

        this.httpBackend.whenGET(testCategoryHref).
            respond(300, "error");
        this.httpBackend.expectGET(testCategoryHref);

        SpringDataRestAdapter.process(this.rawResponse, fetchLinkName).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error.status).toBe(300);
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must not reject the promise if the status code is a 404", function () {

        var embeddedNewKey = this.config.embeddedNewKey;
        var fetchLinkName = 'testCategory';

        // the correct link href url
        var testCategoryHref = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/testCategory';
        var firstExpectedResult = {parentCategory: '1'};

        this.httpBackend.whenGET(testCategoryHref).
            respond(200, firstExpectedResult);
        this.httpBackend.expectGET(testCategoryHref);

        SpringDataRestAdapter.process(this.rawResponse, fetchLinkName).then(function (processedData) {
            expect(processedData[embeddedNewKey][1][fetchLinkName]).toEqual(firstExpectedResult);

        }, function () {
            fail("Should not be called when the promise is rejected")
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must process the fetched responses as all the other responses", function () {

        var embeddedNewKey = this.config.embeddedNewKey;
        var fetchLinkName = 'parentCategory';

        // the correct link href url
        var firstParentCategoryHref = 'http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54/parentCategory';
        var secondParentCategoryHref = 'http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/parentCategory';

        // check if the underlying fetch function is called with the correct href url
        var firstExpectedResult = mockData();
        var secondExpectedResult = mockData();

        this.httpBackend.whenGET(firstParentCategoryHref).
            respond(200, firstExpectedResult);
        this.httpBackend.expectGET(firstParentCategoryHref);

        this.httpBackend.whenGET(secondParentCategoryHref).
            respond(200, secondExpectedResult);
        this.httpBackend.expectGET(secondParentCategoryHref);

        SpringDataRestAdapter.process(this.rawResponse, fetchLinkName).then(function (processedData) {
            // expect the fetched objects
            expect(processedData[embeddedNewKey][0][fetchLinkName][embeddedNewKey][0]['name']).toEqual('Test category 1');
            expect(processedData[embeddedNewKey][1][fetchLinkName][embeddedNewKey][1]['name']).toEqual('Test category 2');
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

});

