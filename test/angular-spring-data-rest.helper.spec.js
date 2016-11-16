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
    angular.module('testModule', []).config(function (SpringDataRestAdapterProvider) {
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

    // initialize the configuration, the raw and the processed data promise
    this.config = springDataRestAdapterProvider.config();
    this.rawResponse = mockData();
    this.processedDataPromise = SpringDataRestAdapter.process(this.rawResponse);
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

var mockDataWithoutLinksKeyAndMultipleEmbeddedKeys = function () {
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
                ],
                "item": {
                    "version": 0,
                    "creationDate": 1406219870650,
                    "modificationDate": 1406219870650,
                    "name": "Test item 1",
                    "_links": {
                        "self": {
                            "href": "http://localhost:8080/item/f974f5ef-a951-43b4-9027-4d2163216e54"
                        }
                    }
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

var mockWithRawEmbeddedValueTypes = function () {
    return angular.copy(
        {
            "_embedded": {
                "timeSeries": [{
                    "id": 1400,
                    "lastDate": "1991-01-06T23:00:00.000+0000",
                    "data": [89.34576078, 90.86743282, 91.5561206, 91.52988487],
                    "tsDataType": "CLOSE",
                    "_embedded": {
                        "asset": {
                            "id": 15,
                            "ticker": "BUHY:IND",
                            "description": "Bloomberg USD High Yield Corporate Bond Index",
                            "provider": "BLOOMBERG",
                            "assetClass": "INDEX",
                            "indexType": "BOND",
                            "assetClassForType": "INDEX"
                        }
                    },
                    "_links": {
                        "self": {
                            "href": "http://localhost:8080/alphaquant-web/restdata/timeSeries/1400"
                        }
                    }
                }, {
                    "id": 52,
                    "lastDate": "2015-05-31T22:00:00.000+0000",
                    "data": [156.931961, 157.007523, 156.968109, 157.001785, 156.967865, 100.0],
                    "tsDataType": "OPEN",
                    "_embedded": {
                        "asset": {
                            "id": 15,
                            "ticker": "BUHY:IND",
                            "description": "Bloomberg USD High Yield Corporate Bond Index",
                            "provider": "BLOOMBERG",
                            "assetClass": "INDEX",
                            "indexType": "BOND",
                            "assetClassForType": "INDEX"
                        }
                    },
                    "_links": {
                        "self": {
                            "href": "http://localhost:8080/alphaquant-web/restdata/timeSeries/52"
                        }
                    }
                }]
            }
        }
    );
};

var mockDataReport = function() {
    return angular.copy({
        "reportNumber": "00001",
        "_links": {
            "self": {
                "href": "http://localhost:8080/api/reports/00001"
            },
            "accident": {
                "href": "http://localhost:8080/api/reports/00001/accident"
            }
        }
    });
};

var mockDataAccident = function() {
    return angular.copy({
        "accidentDate": "2015-07-05",
        "_links": {
            "self": {
                "href": "http://localhost:8080/api/accidents/00001"
            },
            "report": {
                "href": "http://localhost:8080/api/accidents/00001/report"
            }
        }
    });
};

var mockDataWithMultipleEmbeddedItemsAndSameLinks = function () {
    return angular.copy(
        {
            "_links": {
                "self": {
                    "href": "http://localhost:8080/categories{?page,size,sort}",
                    "templated": true
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

var mockDataWithEmptyEmbeddedItemsArray = function () {
    return angular.copy(
        {
            "_links": {
                "self": {
                    "href": "http://localhost:8080/categories{?page,size,sort}",
                    "templated": true
                }
            },
            "_embedded": {
                "categories": []
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