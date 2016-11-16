describe("if the spring data rest interceptor is not added", function () {

    var httpProvider = undefined;

    beforeEach(function () {
        module("ngResource");
        module("spring-data-rest", function ($httpProvider) {
            httpProvider = $httpProvider;
        });

        // initialize the provider by injecting it to a config block of a test module
        // and assign it to the this scope such that it is available in each test
        // (see https://jasmine.github.io/2.0/introduction.html#section-The_<code>this</code>_keyword)
        angular.module('testModule', []).config(function (SpringDataRestAdapterProvider, SpringDataRestInterceptorProvider) {
            springDataRestAdapterProvider = SpringDataRestAdapterProvider;
        });

        // initialize test module injector
        module('testModule');

        // start the injectors previously registered with calls to angular.mock.module and assign it to the
        // this scope. See above for the description.
        var httpBackendVar = undefined;
        inject(function (_SpringDataRestAdapter_, $httpBackend) {
            SpringDataRestAdapter = _SpringDataRestAdapter_;
            httpBackendVar = $httpBackend;
        });
        this.httpBackend = httpBackendVar;

        // initialize the configuration, the raw and the processed response
        this.config = springDataRestAdapterProvider.config();
        this.rawResponse = mockData();
        this.processedDataPromise = SpringDataRestAdapter.process(this.rawResponse);
    });

    it("it must not be added by default", function () {
        expect(httpProvider.interceptors).not.toContain('SpringDataRestInterceptor');
    });

    it("it must not be executed by default", function () {

        // define the link name and the correct link href url
        var linkName = "self";
        var linkHref = "http://localhost:8080/categories";
        var resourcesKey = this.config.resourcesKey;
        var embeddedItemsKey = this.config.embeddedNewKey;

        // check if the underlying $resource method is called with the correct href url
        this.httpBackend.whenGET(linkHref).respond(200, mockData());
        this.httpBackend.expectGET(linkHref);

        this.processedDataPromise.then(function (processedData) {
            var result = processedData[resourcesKey](linkName).get(function () {
                // if the interceptor is not added the resource method must not be added
                expect(result[resourcesKey]).not.toBeDefined();

                // if the interceptor is not added the _embeddedItems property must not be added
                expect(result[embeddedItemsKey]).not.toBeDefined();
            });

        });

        this.httpBackend.flush();
    });

});

describe("if the spring data rest interceptor is added", function () {

    beforeEach(function () {
        module("ngResource");
        module("spring-data-rest", function ($httpProvider) {
            httpProvider = $httpProvider;
        });

        // initialize the provider by injecting it to a config block of a test module
        // and assign it to the this scope such that it is available in each test
        // (see https://jasmine.github.io/2.0/introduction.html#section-The_<code>this</code>_keyword)
        angular.module('testModule', []).config(function (SpringDataRestAdapterProvider, SpringDataRestInterceptorProvider) {
            springDataRestAdapterProvider = SpringDataRestAdapterProvider;
            SpringDataRestInterceptorProvider.apply();
        });

        // initialize test module injector
        module('testModule');

        // start the injectors previously registered with calls to angular.mock.module and assign it to the
        // this scope. See above for the description.
        var httpBackendVar = undefined;
        inject(function (_SpringDataRestAdapter_, $httpBackend, _$http_) {
            SpringDataRestAdapter = _SpringDataRestAdapter_;
            httpBackendVar = $httpBackend;
            $http = _$http_;
        });
        this.httpBackend = httpBackendVar;

        // initialize the configuration, the raw and the processed response
        this.config = springDataRestAdapterProvider.config();
        this.rawResponse = mockData();
        this.processedDataPromise = SpringDataRestAdapter.process(this.rawResponse);
    });

    it("it must be added by default", function () {
        expect(httpProvider.interceptors).toContain('SpringDataRestInterceptor')
    });

    it("it must be executed by default", function () {

        // define the link name and the correct link href url
        var linkName = "self";
        var linkHref = "http://localhost:8080/categories";
        var resourcesKey = this.config.resourcesKey;
        var embeddedItemsKey = this.config.embeddedNewKey;

        // check if the underlying $resource method is called with the correct href url
        var response = mockData();
        this.httpBackend.whenGET(linkHref).respond(200, response);
        this.httpBackend.expectGET(linkHref);

        this.processedDataPromise.then(function (processedData) {
            var result = processedData[resourcesKey](linkName).get(function () {
                // if the interceptor is added the resource method must be added
                expect(result[resourcesKey]).toBeDefined();

                // if the interceptor is added the _embeddedItems property must be added
                expect(result[embeddedItemsKey]).toBeDefined();
            });
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it(" it must not execute when a response is of type string", function () {
        var linkHref = "http://localhost:8080/categories";
        var responseString = "<html>test</html>";
        this.httpBackend.whenGET(linkHref).respond(200, responseString);
        this.httpBackend.expectGET(linkHref);

        var data = $http.get(linkHref).then(function(response){
            data = response.data;
        });

        this.httpBackend.flush();
        expect(data).toBe(responseString);
    });

    it(" it must not execute when a response is of type array", function () {
        var linkHref = "http://localhost:8080/categories";
        var responseString = [{"test":"test"}];
        this.httpBackend.whenGET(linkHref).respond(200, responseString);
        this.httpBackend.expectGET(linkHref);

        var data = $http.get(linkHref).then(function(response){
            data = response.data;
        });

        this.httpBackend.flush();
        expect(angular.equals(data,responseString)).toBeTruthy();
    });

});
