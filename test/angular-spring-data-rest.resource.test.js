describe("the resources property", function () {

    beforeEach(beforeEachFunction);

    it("must contain the 'links key' key", function () {
        expect(this.response[this.config.links.key]).toBeDefined();
    });

    it("must call the correct href url if a resource name is passed to the $resource method", function () {

        // define the resource name and the correct resource href url
        var resourceName = "self";
        var resourceHref = "http://localhost:8080/categories";

        // check if the underlying $resource method is called with the correct href url
        var expectedResult = {categoryId: '123'};
        this.httpBackend.whenGET(resourceHref).respond(200, expectedResult);
        this.httpBackend.expectGET(resourceHref);
        var result = this.response[this.config.resourcesKey](resourceName).get(function () {
            expect(result.categoryId).toEqual(expectedResult.categoryId);
        });
        this.httpBackend.flush();
    });

    it("must call the correct href url if a resource object is passed to the $resource method", function () {

        // define the resource object and the correct link href url
        var resourceObject = {
            'name': 'self'
        };
        var resourceHref = "http://localhost:8080/categories";

        // check if the underlying $resource method is called with the correct href url
        var expectedResult = {categoryId: '123'};
        this.httpBackend.whenGET(resourceHref).respond(200, expectedResult);
        this.httpBackend.expectGET(resourceHref);
        var result = this.response[this.config.resourcesKey](resourceObject).get(function () {
            expect(result.categoryId).toEqual(expectedResult.categoryId);
        });
        this.httpBackend.flush();
    });

    it("must throw an exception if a wrong resource object is given", function () {
        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        var thisResponse = this.response;
        var thisResourceKey = this.config.resourcesKey;
        var thisHttpBackend = this.httpBackend;

        // it must throw an exception if a wrong resource object is given
        expect(function () {
            expectResourceExecution(thisResponse, thisResourceKey,
                "expectedUrl", thisHttpBackend, {'wrongPropertyName': 'value'});
        }).toThrow("The provided resource object must contain a name property.");
    });

    it("must not use any parameters if the resource object is a string and no parameters are given", function () {
        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // the parameters must not be used in the resources method
        expectResourceExecution(this.response, this.config.resourcesKey,
            this.response[this.config.links.key]["self"].href, this.httpBackend, "self")
    });

    it("must use the given parameters if the resource object is a string", function () {
        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // the given parameters must be used in the resources method
        expectResourceExecution(this.response, this.config.resourcesKey,
                this.response[this.config.links.key]["self"].href + "?parameterName=parameterValue", this.httpBackend, "self",
            {'parameterName': 'parameterValue'});
    });

    it("must use the resource name if the correct resource object is given", function () {
        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // the given resource name must be used
        expectResourceExecution(this.response, this.config.resourcesKey,
            this.response[this.config.links.key]["self"].href, this.httpBackend, {'name': 'self'})
    });

    it("must use the correct resource object name and the given parameters", function () {
        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // the given parameters must be used in the resources method
        expectResourceExecution(this.response, this.config.resourcesKey,
                this.response[this.config.links.key]["self"].href + "?parameterName=parameterValue",
            this.httpBackend, {'name': 'self'}, {'parameterName': 'parameterValue'})
    });

    it("must use the correct resource object name and parameters", function () {
        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // the given parameters must be used in the resources method
        expectResourceExecution(this.response, this.config.resourcesKey,
                this.response[this.config.links.key]["self"].href + "?parameterName=parameterValue",
            this.httpBackend, {'name': 'self', 'parameters': {'parameterName': 'parameterValue'}})
    });

    it("must use the correct resource object name and merge the  resource object parameters with the given parameters", function () {
        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // the given parameters must be used in the resources method
        expectResourceExecution(this.response, this.config.resourcesKey,
                this.response[this.config.links.key]["self"].href + "?objectParameterName=objectParameterValue&parameterName=parameterValue",
            this.httpBackend, {'name': 'self', 'parameters': {'objectParameterName': 'objectParameterValue'}},
            {'parameterName': 'parameterValue'})
    });

    it("must return the resources of the object", function () {
        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // expect that the resource method returns the available resources on the object
        expect(this.response[this.config.resourcesKey]()).toEqual(['self']);
    });

    it("must return the resources of the index response", function () {
        this.rawResponse = mockIndexData();
        this.response = new SpringDataRestAdapter(this.rawResponse);

        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // expect that the resource method returns the available resources on the index response
        expect(this.response[this.config.resourcesKey]()).toEqual(['users', 'categories', 'accounts']);
    });

});

