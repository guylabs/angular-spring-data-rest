describe("the resources property", function () {

    beforeEach(beforeEachFunction);

    it("must contain the 'links key' key", function () {
        var linksKey = this.config.linksKey;

        this.processedDataPromise.then(function (processedData) {
            expect(processedData[linksKey]).toBeDefined();
        });

        this.rootScope.$apply();
    });

    it("must call the correct href url if a resource name is passed to the $resource method", function () {

        var resourcesKey = this.config.resourcesKey;

        // define the resource name and the correct resource href url
        var resourceName = "self";
        var resourceHref = "http://localhost:8080/categories";

        // check if the underlying $resource method is called with the correct href url
        var expectedResult = {categoryId: '123'};
        this.httpBackend.whenGET(resourceHref).respond(200, expectedResult);
        this.httpBackend.expectGET(resourceHref);

        this.processedDataPromise.then(function (processedData) {
            var result = processedData[resourcesKey](resourceName).get(function () {
                expect(result.categoryId).toEqual(expectedResult.categoryId);
            });
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
    });

    it("must call the correct href url if a resource object is passed to the $resource method", function () {

        var resourcesKey = this.config.resourcesKey;

        // define the resource object and the correct link href url
        var resourceObject = {
            'name': 'self'
        };
        var resourceHref = "http://localhost:8080/categories";

        // check if the underlying $resource method is called with the correct href url
        var expectedResult = {categoryId: '123'};
        this.httpBackend.whenGET(resourceHref).respond(200, expectedResult);
        this.httpBackend.expectGET(resourceHref);

        this.processedDataPromise.then(function (processedData) {
            var result = processedData[resourcesKey](resourceObject).get(function () {
                expect(result.categoryId).toEqual(expectedResult.categoryId);
            });
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
    });

    it("must call the correct href url with parameters if a resource object with parameters is passed to the $resource method", function () {

        var resourcesKey = this.config.resourcesKey;

        // define the resource object and the correct link href url
        var resourceObject = {
            'name': 'self',
            'parameters': {
                'parameter1': '1',
                'parameter2': '2'
            }
        };
        var resourceHref = "http://localhost:8080/categories?parameter1=1&parameter2=2";

        // check if the underlying $resource method is called with the correct href url
        var expectedResult = {categoryId: '123'};
        this.httpBackend.whenGET(resourceHref).respond(200, expectedResult);
        this.httpBackend.expectGET(resourceHref);

        this.processedDataPromise.then(function (processedData) {
            var result = processedData[resourcesKey](resourceObject).get(function () {
                expect(result.categoryId).toEqual(expectedResult.categoryId);
            });
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
    });

    it("must call the correct href url without parameters if a resource object with empty parameters is passed to the $resource method", function () {

        var resourcesKey = this.config.resourcesKey;

        // define the resource object and the correct link href url
        var resourceObject = {
            'name': 'self',
            'parameters': {
                'parameter1': "",
                'parameter2': ""
            }
        };
        var resourceHref = "http://localhost:8080/categories";

        // check if the underlying $resource method is called with the correct href url
        var expectedResult = {categoryId: '123'};
        this.httpBackend.whenGET(resourceHref).respond(200, expectedResult);
        this.httpBackend.expectGET(resourceHref);

        this.processedDataPromise.then(function (processedData) {
            var result = processedData[resourcesKey](resourceObject).get(function () {
                expect(result.categoryId).toEqual(expectedResult.categoryId);
            });
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
    });

    it("it must call the overridden resource function with the given resource name", function () {
        var resourcesKey = this.config.resourcesKey;
        var url = undefined, paramDefaults = undefined, actions = undefined, options = undefined;
        var resourcesFunctionConfiguration = {
            'resourcesFunction': function (inUrl, inParamDefaults, inActions, inOptions) {
                url = inUrl;
                paramDefaults = inParamDefaults;
                actions = inActions;
                options = inOptions;
                return 'foo';
            }
        };

        // define the resource name and the correct resource href url
        var resourceName = "self";
        var resourceHref = "http://localhost:8080/categories";

        // set the new resource function with the given parameters
        springDataRestAdapterProvider.config(resourcesFunctionConfiguration);
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // call the new resource method and expect the response and the call to the method
            var resourceResponse = processedData[resourcesKey](resourceName, 'paramDefaults', 'actions', 'options');
            expect(resourceResponse).toEqual('foo');
            expect(url).toEqual(resourceHref);
            expect(paramDefaults).toEqual('paramDefaults');
            expect(actions).toEqual('actions');
            expect(options).toEqual('options');
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("it must call the overridden resource function with the given resource object", function () {
        var resourcesKey = this.config.resourcesKey;
        var url = undefined, paramDefaults = undefined, actions = undefined, options = undefined;
        var resourcesFunctionConfiguration = {
            'resourcesFunction': function (inUrl, inParamDefaults, inActions, inOptions) {
                url = inUrl;
                paramDefaults = inParamDefaults;
                actions = inActions;
                options = inOptions;
                return 'foo';
            }
        };

        // define the resource name and the correct resource href url
        var resourceObject = {
            'name': 'self'
        };
        var resourceHref = "http://localhost:8080/categories";

        // set the new resource function with the given parameters
        springDataRestAdapterProvider.config(resourcesFunctionConfiguration);
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // call the new resource method and expect the response and the call to the method
            var resourceResponse = processedData[resourcesKey](resourceObject, 'paramDefaults', 'actions', 'options');
            expect(resourceResponse).toEqual('foo');
            expect(url).toEqual(resourceHref);
            expect(paramDefaults).toEqual('paramDefaults');
            expect(actions).toEqual('actions');
            expect(options).toEqual('options');
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must throw an exception if a wrong resource object is given", function () {
        var resourcesKey = this.config.resourcesKey;
        var httpBackend = this.httpBackend;
        this.processedDataPromise.then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // it must throw an exception if a wrong resource object is given
            expect(function () {
                expectResourceExecution(processedData, resourcesKey,
                    "expectedUrl", httpBackend, {'wrongPropertyName': 'value'});
            }).toThrowError("The provided resource object must contain a name property.");
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must not use any parameters if the resource object is a string and no parameters are given", function () {
        var resourcesKey = this.config.resourcesKey;
        var linksKey = this.config.linksKey;
        var httpBackend = this.httpBackend;
        this.processedDataPromise.then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // the parameters must not be used in the resources method
            expectResourceExecution(processedData, resourcesKey,
                processedData[linksKey]["self"].href, httpBackend, "self")
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must use the given parameters if the resource object is a string", function () {
        var resourcesKey = this.config.resourcesKey;
        var linksKey = this.config.linksKey;
        var httpBackend = this.httpBackend;
        this.processedDataPromise.then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // the given parameters must be used in the resources method
            expectResourceExecution(processedData, resourcesKey,
                processedData[linksKey]["self"].href + "?parameterName=parameterValue", httpBackend, "self",
                {'parameterName': 'parameterValue'});
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must use the resource name if the correct resource object is given", function () {
        var resourcesKey = this.config.resourcesKey;
        var linksKey = this.config.linksKey;
        var httpBackend = this.httpBackend;
        this.processedDataPromise.then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // the given resource name must be used
            expectResourceExecution(processedData, resourcesKey,
                processedData[linksKey]["self"].href, httpBackend, {'name': 'self'})
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must use the correct resource object name and the given parameters", function () {
        var resourcesKey = this.config.resourcesKey;
        var linksKey = this.config.linksKey;
        var httpBackend = this.httpBackend;
        this.processedDataPromise.then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // the given parameters must be used in the resources method
            expectResourceExecution(processedData, resourcesKey,
                processedData[linksKey]["self"].href + "?parameterName=parameterValue",
                httpBackend, {'name': 'self'}, {'parameterName': 'parameterValue'})
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must use the correct resource object name and parameters", function () {
        var resourcesKey = this.config.resourcesKey;
        var linksKey = this.config.linksKey;
        var httpBackend = this.httpBackend;
        this.processedDataPromise.then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // the given parameters must be used in the resources method
            expectResourceExecution(processedData, resourcesKey,
                processedData[linksKey]["self"].href + "?parameterName=parameterValue",
                httpBackend, {'name': 'self', 'parameters': {'parameterName': 'parameterValue'}})
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must use the correct resource object name and merge the resource object parameters with the given parameters", function () {
        var resourcesKey = this.config.resourcesKey;
        var linksKey = this.config.linksKey;
        var httpBackend = this.httpBackend;
        this.processedDataPromise.then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // the given parameters must be used in the resources method
            expectResourceExecution(processedData, resourcesKey,
                processedData[linksKey]["self"].href + "?objectParameterName=objectParameterValue&parameterName=parameterValue",
                httpBackend, {'name': 'self', 'parameters': {'objectParameterName': 'objectParameterValue'}},
                {'parameterName': 'parameterValue'})
        }, function (error) {
            fail(error)
        });

        this.httpBackend.flush();
        this.httpBackend.verifyNoOutstandingRequest();
        this.httpBackend.verifyNoOutstandingExpectation();
    });

    it("must return the resources of the object", function () {
        var resourcesKey = this.config.resourcesKey;
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // expect that the resource method returns the available resources on the object
            expect(processedData[resourcesKey]()).toEqual([
                    {
                        name: 'self',
                        parameters: {
                            page: "",
                            size: "",
                            sort: ""
                        }
                    },
                    {
                        name: 'testLink'
                    }
                ]
            );
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must return the resources of the object with empty parameters if the templated property is false", function () {
        var resourcesKey = this.config.resourcesKey;
        this.rawResponse = mockWithoutTemplateParametersData();
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // expect that the resource method returns the available resources on the object
            expect(processedData[resourcesKey]()).toEqual([
                    {
                        name: 'users'
                    },
                    {
                        name: 'categories'
                    }
                ]
            );
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must return the resources of the index response", function () {
        var resourcesKey = this.config.resourcesKey;
        this.rawResponse = mockIndexData();
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // expect that the resource method returns the available resources on the index response
            expect(processedData[resourcesKey]()).toEqual([
                    {
                        name: 'users',
                        parameters: {
                            page: "",
                            size: "",
                            sort: ""
                        }
                    },
                    {
                        name: 'categories',
                        parameters: {
                            page: "",
                            size: "",
                            sort: ""
                        }
                    },
                    {
                        name: 'accounts',
                        parameters: {
                            page: "",
                            size: "",
                            sort: ""
                        }
                    }
                ]
            );
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must throw an exception if the href property is empty", function () {
        var resourcesKey = this.config.resourcesKey;
        this.rawResponse = mockWithEmptyHrefPropertyData();
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // expect that the resource method with the specified resource name throws an exception
            expect(function () {
                processedData[resourcesKey]("self")
            }).toThrowError("The provided resource name 'self' has no valid URL in the 'href' property.");

            // expect that the resource method with the specified resource object throws an exception
            expect(function () {
                processedData[resourcesKey]({'name': 'self'})
            }).toThrowError("The provided resource name 'self' has no valid URL in the 'href' property.");
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("must throw an exception if the href property is not present", function () {
        var resourcesKey = this.config.resourcesKey;
        this.rawResponse = mockWithoutHrefPropertyData();
        this.response = SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // expect that the resources method is present
            expect(processedData[resourcesKey]).toBeDefined();

            // expect that the resource method with the specified resource name throws an exception
            expect(function () {
                processedData[resourcesKey]("self")
            }).toThrowError("The provided resource name 'self' has no valid URL in the 'href' property.");

            // expect that the resource method with the specified resource object throws an exception
            expect(function () {
                processedData[resourcesKey]({'name': 'self'})
            }).toThrowError("The provided resource name 'self' has no valid URL in the 'href' property.");
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

    it("it must extract the URL templates and add it as suffix to the proper URL", function () {
        var resourcesKey = this.config.resourcesKey;
        var url = undefined;
        var resourcesFunctionConfiguration = {
            'resourcesFunction': function (inUrl) {
                url = inUrl;
                return 'foo';
            }
        };

        // define the resource name and the correct resource href url
        var resourceObject = "self/:id";
        var resourceHref = "http://localhost:8080/categories";

        // set the new resource function with the given parameters
        springDataRestAdapterProvider.config(resourcesFunctionConfiguration);
        SpringDataRestAdapter.process(this.rawResponse).then(function (processedData) {
            // call the new resource method and expect the response and the call to the method
            var resourceResponse = processedData[resourcesKey](resourceObject);
            expect(resourceResponse).toEqual('foo');
            expect(url).toEqual(resourceHref + '/:id');
        }, function (error) {
            fail(error)
        });

        this.rootScope.$apply();
    });

});

