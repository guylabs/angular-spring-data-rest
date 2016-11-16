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

        this.rootScope.$apply();
    });

    it("must throw an exception if the data object is null", function () {
        SpringDataRestAdapter.process(null).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error).toEqual("Given data '" + null + "' is not of type object.")
        });

        this.rootScope.$apply();
    });

    it("must throw an exception if the fetch links parameter is not an array or a string", function () {
        var fetchLinkNames = 123;
        SpringDataRestAdapter.process({}, fetchLinkNames).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error).toEqual("Given fetch links '" + fetchLinkNames + "' is not of type array or string.")
        });

        var fetchLinkNames2 = {'object': 'object'};
        SpringDataRestAdapter.process({}, fetchLinkNames2).then(function () {
            throw new Error("Should not be called when the promise is rejected")
        }, function (error) {
            expect(error).toEqual("Given fetch links '" + fetchLinkNames2 + "' is not of type array or string.")
        });

        this.rootScope.$apply();
    });

    it("must only add the resource method if there is a links key in the data object", function () {
        var linksKey = this.config.linksKey;
        var resourcesKey = this.config.resourcesKey;

        this.rawResponse = mockDataWithoutLinksKey();
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // expect that the links key and the resource method is not present
            expect(processedData[linksKey]).not.toBeDefined();
            expect(processedData[resourcesKey]).not.toBeDefined();
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must only add the embedded value key if there is a embedded key in the data object", function () {
        var embeddedKey = this.config.embeddedKey;
        var embeddedNewKey = this.config.embeddedNewKey;

        this.rawResponse = mockDataWithoutEmbeddedKey();
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // expect that the embedded key and value is not present
            expect(processedData[embeddedKey]).not.toBeDefined();
            expect(processedData[embeddedNewKey]).not.toBeDefined();
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must return the original data object if no links key or embedded key is present", function () {
        var linksKey = this.config.linksKey;
        var resourcesKey = this.config.resourcesKey;
        var embeddedKey = this.config.embeddedKey;
        var embeddedNewKey = this.config.embeddedNewKey;
        var rawResponse = mockDataWithoutAnyKey();

        SpringDataRestAdapter.process(rawResponse).then(function (processedData) {

            // expect that the links key and the resource method is not present
            expect(processedData[linksKey]).not.toBeDefined();
            expect(processedData[resourcesKey]).not.toBeDefined();

            // expect that the embedded key and value is not present
            expect(processedData[embeddedKey]).not.toBeDefined();
            expect(processedData[embeddedNewKey]).not.toBeDefined();

            // check that the original response is the one which is returned
            expect(rawResponse === processedData).toBe(true);
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must only fetch link once to avoid infinite loop", function () {
        var allLinks = this.config.fetchAllKey;
        var accidentHref = 'http://localhost:8080/api/reports/00001/accident';
        var reportHref = 'http://localhost:8080/api/accidents/00001/report';

        this.httpBackend.whenGET(accidentHref).respond(200, mockDataAccident());
        this.httpBackend.expectGET(accidentHref);

        this.httpBackend.whenGET(reportHref).respond(200, mockDataReport());
        this.httpBackend.expectGET(reportHref);

        this.rawResponse = mockDataReport();
        SpringDataRestAdapter.process(this.rawResponse, allLinks, true).then(function (processedData) {
            // expect that accident will not fetched twice
            expect(processedData.accident).toBeDefined();
            expect(processedData.accident.report).toBeDefined();
            expect(processedData.accident.report.accident).not.toBeDefined();
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.rootScope.$apply();
    });

    it("must only reinitialized the map when process called twice or more", function () {
        var allLinks = this.config.fetchAllKey;
        var accidentHref = 'http://localhost:8080/api/reports/00001/accident';
        var reportHref = 'http://localhost:8080/api/accidents/00001/report';

        this.httpBackend.whenGET(accidentHref).respond(200, mockDataAccident());
        this.httpBackend.expectGET(accidentHref);

        this.httpBackend.whenGET(reportHref).respond(200, mockDataReport());
        this.httpBackend.expectGET(reportHref);

        this.rawResponse = mockDataReport();
        SpringDataRestAdapter.process(this.rawResponse, allLinks, true).then(function (processedData) {
            SpringDataRestAdapter.process(mockDataReport(), allLinks, true).then(function (processedData2) {
                // expect linkMap to be reinitialized after process method called twice
                expect(JSON.stringify(processedData)).toEqual(JSON.stringify(processedData2));
            });
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.rootScope.$apply();
    });

});

