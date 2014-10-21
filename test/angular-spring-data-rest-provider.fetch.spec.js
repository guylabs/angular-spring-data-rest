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
        this.response = SpringDataRestAdapter.process(this.rawResponse);
    });

    it("must call the correct href url if an existing fetch link name is given", function () {

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

        this.response = SpringDataRestAdapter.process(this.rawResponse, fetchLinkName);
        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();

        // expect the fetched objects
        expect(this.response[this.config.embeddedNewKey][0][fetchLinkName]).toEqual(firstExpectedResult);
        expect(this.response[this.config.embeddedNewKey][1][fetchLinkName]).toEqual(secondExpectedResult);
    });

    it("must call all links if the fetch all link names key", function () {

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

        this.response = SpringDataRestAdapter.process(this.rawResponse, this.config.fetchAllKey);
        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();

        // expect the fetched objects
        expect(this.response['testLink']).toEqual(testLinkExpectedResult);
        expect(this.response[this.config.embeddedNewKey][0]['parentCategory']).toEqual(firstParentCategoryExpectedResult);
        expect(this.response[this.config.embeddedNewKey][1]['parentCategory']).toEqual(secondParentCategoryExpectedResult);
        expect(this.response[this.config.embeddedNewKey][1]['testCategory']).toEqual(testParentCategoryExpectedResult);
    });

    it("must call all links of the given fetch link names array", function () {

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

        this.response = SpringDataRestAdapter.process(this.rawResponse, fetchLinkNames);
        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();

        // expect the fetched objects
        expect(this.response[fetchLinkNames[0]]).toEqual(testLinkExpectedResult);
        expect(this.response[this.config.embeddedNewKey][1][fetchLinkNames[1]]).toEqual(testParentCategoryExpectedResult);
    });

    it("must process the fetched response recursively if the flag is set", function () {

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

        this.response = SpringDataRestAdapter.process(this.rawResponse, fetchLinkName, true);
        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();

        // expect the recursively fetched objects
        expect(typeof this.response[this.config.embeddedNewKey][0][fetchLinkName][this.config.resourcesKey] == 'function').
            toEqual(true);
        expect(typeof this.response[this.config.embeddedNewKey][1][fetchLinkName][this.config.resourcesKey] == 'function').
            toEqual(true);
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
    });

});

