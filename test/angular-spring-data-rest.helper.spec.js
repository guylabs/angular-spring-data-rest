/**
 * Before each function which is used in all tests to setup the angular modules, the SprinDataRestAdapter and the
 * configuration, raw and processed response.
 */
var beforeEachFunction = function () {
    module('ngResource');
    module('spring-data-rest');

    // initialize the provider by injecting it to a config block of a test module
    // and assign it to the this scope such that it is available in each test
    // (see https://jasmine.github.io/2.0/introduction.html#section-The_<code>this</code>_keyword)
    angular.module('testModule', function () {
    }).config(function (SpringDataRestAdapterProvider) {
        springDataRestAdapterProvider = SpringDataRestAdapterProvider;
    });

    // initialize test module injector
    module('testModule');

    var httpBackendVar = undefined;
    var qVar = undefined;
    var rootScope = undefined;
    inject(function (_SpringDataRestAdapter_, $httpBackend, $q, $rootScope) {
        SpringDataRestAdapter = _SpringDataRestAdapter_;
        httpBackendVar = $httpBackend;
        qVar = $q;
        rootScope = $rootScope;
    });
    this.httpBackend = httpBackendVar;
    this.q = qVar;
    this.rootScope = rootScope;

    // initialize the configuration, the raw and the processed response
    this.config = springDataRestAdapterProvider.config();
    this.rawResponse = mockData();
    this.response = SpringDataRestAdapter.process(this.rawResponse);
};

/**
 * Executes the spied resource method and validate the call and the parameters.
 *
 * @param {object} data the data object in which the resource key exists
 * @param {string} resourcesKey the resource key
 * @param {string} expectedUrl the expected url
 * @param {object} httpBackend the angular http backend object
 * @param {string|object} inResourceName the resource name or the resource object
 * @param {object} parameters the parameter object
 */
var expectResourceExecution = function (data, resourcesKey, expectedUrl, httpBackend, inResourceName, parameters) {
    // create resource name and parameters
    var resourceName = (inResourceName == undefined) ? "self" : inResourceName;

    // remove template parameters from url
    expectedUrl = expectedUrl.replace(/{.*}/g, '');

    // expect the url
    httpBackend.whenGET(expectedUrl).respond(200);
    httpBackend.expectGET(expectedUrl);

    // call the resource method
    data[resourcesKey](resourceName, parameters).get();
    httpBackend.flush();
};

var mockData = function () {
    return angular.copy(
        {
            "_links": {
                "self": {
                    "href": "http://localhost:8080/categories{?page,size,sort}",
                    "templated": true
                },
                "testLink": {
                    "href": "http://localhost:8080/categories/testLink"
                }
            },
            "_embedded": {
                "categories": [
                    {
                        "version": 0,
                        "creationDate": 1406219870650,
                        "modificationDate": 1406219870650,
                        "name": "Test category 1",
                        "_links": {
                            "self": {
                                "href": "http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54"
                            },
                            "parentCategory": {
                                "href": "http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54/parentCategory"
                            }
                        }
                    },
                    {
                        "version": 0,
                        "creationDate": 1406219884502,
                        "modificationDate": 1406219884502,
                        "name": "Test category 2",
                        "_links": {
                            "self": {
                                "href": "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697"
                            },
                            "parentCategory": {
                                "href": "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/parentCategory"
                            },
                            "testCategory": {
                                "href": "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/testCategory"
                            }
                        }
                    }
                ]
            },
            "page": {
                "size": 20,
                "totalElements": 2,
                "totalPages": 1,
                "number": 0
            }
        }
    );
};

var mockDataWithoutLinksKey = function () {
    return angular.copy(
        {
            "_embedded": {
                "categories": [
                    {
                        "version": 0,
                        "creationDate": 1406219870650,
                        "modificationDate": 1406219870650,
                        "name": "Test category 1",
                        "_links": {
                            "self": {
                                "href": "http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54"
                            },
                            "parentCategory": {
                                "href": "http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54/parentCategory"
                            }
                        }
                    },
                    {
                        "version": 0,
                        "creationDate": 1406219884502,
                        "modificationDate": 1406219884502,
                        "name": "Test category 2",
                        "_links": {
                            "self": {
                                "href": "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697"
                            },
                            "parentCategory": {
                                "href": "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/parentCategory"
                            }
                        }
                    }
                ]
            },
            "page": {
                "size": 20,
                "totalElements": 2,
                "totalPages": 1,
                "number": 0
            }
        }
    );
};

var mockDataWithoutEmbeddedKey = function () {
    return angular.copy(
        {
            "_links": {
                "self": {
                    "href": "http://localhost:8080/categories{?page,size,sort}",
                    "templated": true
                }
            },
            "page": {
                "size": 20,
                "totalElements": 2,
                "totalPages": 1,
                "number": 0
            }
        }
    );
};

var mockDataWithoutAnyKey = function () {
    return angular.copy(
        {
            "page": {
                "size": 20,
                "totalElements": 2,
                "totalPages": 1,
                "number": 0
            }
        }
    );
};

var mockIndexData = function () {
    return angular.copy(
        {
            "_links": {
                "users": {
                    "href": "http://localhost:8080/users{?page,size,sort}",
                    "templated": true
                },
                "categories": {
                    "href": "http://localhost:8080/categories{?page,size,sort}",
                    "templated": true
                },
                "accounts": {
                    "href": "http://localhost:8080/accounts{?page,size,sort}",
                    "templated": true
                }
            }
        }
    );
};

var mockWithoutTemplateParametersData = function () {
    return angular.copy(
        {
            "_links": {
                "users": {
                    "href": "http://localhost:8080/users",
                    "templated": false
                },
                "categories": {
                    "href": "http://localhost:8080/categories",
                    "templated": false
                }
            }
        }
    );
};

var mockWithEmptyHrefPropertyData = function () {
    return angular.copy(
        {
            "_links": {
                "self": {
                    "href": "",
                    "templated": false
                }
            }
        }
    );
};

var mockWithoutHrefPropertyData = function () {
    return angular.copy(
        {
            "_links": {
                "self": {
                    "templated": false
                }
            }
        }
    );
};

