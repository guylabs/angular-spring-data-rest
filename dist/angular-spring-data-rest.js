(function () {

'use strict';

/**
 * @module spring-data-rest
 * @version 0.3.2
 *
 * An AngularJS module to ease the work with a Spring Data REST backend.
 */
angular.module("spring-data-rest", ["ngResource"]);

/**
 * @module spring-data-rest
 * @version 0.3.2
 *
 * Provider for the SpringDataRestAdapter which is the core of this module.
 */
angular.module("spring-data-rest").provider("SpringDataRestAdapter", function () {

    /**
     * Default configuration for spring data rest defaults
     */
    var config = {
        'linksKey': '_links',
        'linksHrefKey': 'href',
        'linksSelfLinkName': 'self',
        'embeddedKey': '_embedded',
        'embeddedNewKey': '_embeddedItems',
        'embeddedNamedResources': false,
        'resourcesKey': '_resources',
        'resourcesFunction': undefined,
        'fetchFunction': undefined,
        'fetchAllKey': '_allLinks'
    };

    return {

        /**
         * Sets and gets the configuration object.
         *
         * @param {object} newConfig the new configuration to be set
         * @returns {object} the configuration object
         */
        config: function (newConfig) {
            // if the configuration object is 'undefined' then return the configuration object
            if (typeof newConfig !== 'undefined') {
                // throw an error if the given configuration is not an object
                if (!angular.isObject(newConfig)) {
                    throw new Error("The given configuration '" + newConfig + "' is not an object.");
                }

                // check if the given resource function is not undefined and is of type function
                if (newConfig.resourcesFunction != undefined && typeof(newConfig.resourcesFunction) != "function") {
                    throw new Error("The given resource function '" + newConfig.resourcesFunction + "' is not of type function.")
                }

                // check if the given fetch function is not undefined and is of type function
                if (newConfig.fetchFunction != undefined && typeof(newConfig.fetchFunction) != "function") {
                    throw new Error("The given fetch function '" + newConfig.fetchFunction + "' is not of type function.")
                }

                // override the default configuration properties with the given new configuration
                config = deepExtend(config, newConfig);
            }
            return config;
        },

        $get: ["$injector", function ($injector) {

            /**
             * Returns the Angular $resource method which is configured with the given parameters.
             *
             * @param {string} url the url at which the resource is available
             * @param {object} paramDefaults optional $resource method parameter defaults
             * @param {object} actions optional $resource method actions
             * @param {object} options additional $resource method options
             * @returns {*}
             */
            function resourcesFunction(url, paramDefaults, actions, options) {
                if (config.resourcesFunction == undefined) {
                    return $injector.get("$resource")(url, paramDefaults, actions, options);
                } else {
                    return config.resourcesFunction(url, paramDefaults, actions, options);
                }
            }

            /**
             * Fetches the given URL and adds the response to the given data object as a property
             * with the name of the given key.
             *
             * @param {string} url the url at which the resource is available
             * @param {string} key the key inside the data object where to store the returned response
             * @param {object} data the data object reference in which the response is stored
             * @param {[string]|string} fetchLinkNames the fetch link names to allow to process the fetched response
             * @param {boolean} recursive true if the fetched response should be processed recursively with the
             * adapter, false otherwise
             */
            function fetchFunction(url, key, data, fetchLinkNames, recursive) {
                if (config.fetchFunction == undefined) {
                    $injector.get("$http").get(url)
                        .success(function (responseData) {

                            // wrap the response again with the adapter if the recursive flag is set
                            data[key] = recursive ? processData(responseData, fetchLinkNames, true) : responseData;
                        })
                        .error(function (data, status) {
                            throw new Error("There was an error (" + status + ") retrieving the data from '" + url + "'");
                        });
                } else {
                    config.fetchFunction(url, key, data, fetchLinkNames, recursive);
                }
            }

            /**
             * The actual adapter method which processes the given JSON data object and adds
             * the wrapped resource property to all embedded elements where resources are available.
             *
             * @param {object} data the given JSON data
             * @param {object|string} fetchLinkNames the link names to be fetched automatically or the
             * 'fetchAllLinkNamesKey' key from the config object to fetch all links except the 'self' key.
             * @param {boolean} recursive true if the automatically fetched response should be processed recursively with the
             * adapter, false otherwise
             * @returns {object} the processed JSON data
             */
            var processData = function processDataFunction(data, fetchLinkNames, recursive) {

                /**
                 * Wraps the Angular $resource method and adds the ability to retrieve the available resources. If no
                 * parameter is given it will return an array with the available resources in this object.
                 *
                 * @param {string|object} resourceObject the resource name to be retrieved or an object which holds the
                 * resource name and the parameters
                 * @param {object} paramDefaults optional $resource method parameter defaults
                 * @param {object} actions optional $resource method actions
                 * @param {object} options additional $resource method options
                 * @returns {object} the result of the $resource method or the available resources as a resource object array
                 *
                 * @see https://docs.angularjs.org/api/ngResource/service/$resource
                 */
                var resources = function (resourceObject, paramDefaults, actions, options) {
                    var resources = this[config.linksKey];
                    var parameters = paramDefaults;

                    // if a resource object is given process it
                    if (angular.isObject(resourceObject)) {
                        if (!resourceObject.name) {
                            throw new Error("The provided resource object must contain a name property.");
                        }

                        var resourceObjectParameters = resourceObject.parameters;

                        // if the default parameters and the resource object parameters are objects, then merge these two objects
                        // if not use the objects themselves as parameters
                        if (paramDefaults && angular.isObject(paramDefaults)) {
                            if (resourceObjectParameters && angular.isObject(resourceObjectParameters)) {
                                parameters = angular.extend(angular.copy(paramDefaults), angular.copy(resourceObjectParameters));
                            } else {
                                parameters = angular.copy(paramDefaults);
                            }
                        } else {
                            if (resourceObjectParameters && angular.isObject(resourceObjectParameters)) {
                                parameters = angular.copy(resourceObjectParameters);
                            }
                        }

                        // remove parameters which have an empty string as value
                        angular.forEach(parameters, function (value, key) {
                            if (value === "") {
                                delete parameters[key];
                            }
                        });

                        // process the url and call the resources function with the given parameters
                        return resourcesFunction(getProcessedUrl(data, resourceObject.name), parameters, actions, options);
                    } else if (resourceObject in resources) {

                        // process the url and call the resources function with the given parameters
                        return resourcesFunction(getProcessedUrl(data, resourceObject), parameters, actions, options);
                    }

                    // return the available resources as resource object array if the resource object parameter is not set
                    var availableResources = [];
                    angular.forEach(resources, function (value, key) {

                        // if the URL is templated add the available template parameters to the returned object
                        if (value.templated) {
                            var templateParameters = extractTemplateParameters(value[config.linksHrefKey]);
                            availableResources.push({"name": key, "parameters": templateParameters});
                        } else {
                            availableResources.push({"name": key});
                        }
                    });
                    return availableResources;
                };

                // throw an exception if given data parameter is not of type object
                if (!angular.isObject(data) || data instanceof Array) {
                    throw new Error("Given data '" + data + "' is not of type object.");
                }

                // throw an exception if given fetch links parameter is not of type array or string
                if (fetchLinkNames != undefined && !(fetchLinkNames instanceof Array || typeof fetchLinkNames === "string")) {
                    throw new Error("Given fetch links '" + fetchLinkNames + "' is not of type array or string.");
                }

                var processedData = undefined;

                // only add the resource method to the object if the links key is present
                if (config.linksKey in data) {

                    // add Angular resources property to object
                    var resourcesObject = {};
                    resourcesObject[config.resourcesKey] = resources;
                    processedData = angular.extend(angular.copy(data), resourcesObject);

                    // if there are links to fetch, then process and fetch them
                    if (fetchLinkNames != undefined) {

                        // make a defensive copy if the processedData variable is undefined
                        if (!processedData) {
                            processedData = angular.copy(data);
                        }

                        // process all links
                        angular.forEach(data[config.linksKey], function (linkValue, linkName) {

                            // if the link name is not 'self' then process the link name
                            if (linkName != config.linksSelfLinkName) {

                                // check if:
                                // 1. the all link names key is given then fetch the link
                                // 2. the given key is equal
                                // 3. the given key is inside the array
                                if (fetchLinkNames == config.fetchAllKey ||
                                    (typeof fetchLinkNames === "string" && linkName == fetchLinkNames) ||
                                    (fetchLinkNames instanceof Array && fetchLinkNames.indexOf(linkName) >= 0)) {
                                    fetchFunction(getProcessedUrl(data, linkName), linkName,
                                        processedData, fetchLinkNames, recursive);
                                }
                            }
                        });
                    }
                }

                // only move the embedded values to a top level property if the embedded key is present
                if (config.embeddedKey in data) {

                    // make a defensive copy if the processedData variable is undefined
                    if (!processedData) {
                        processedData = angular.copy(data);
                    }

                    // process the embedded key and move it to an embedded value key
                    processedData = moveArray(processedData, config.embeddedKey, config.embeddedNewKey, config.embeddedNamedResources);

                    // recursively process all contained objects in the embedded value array
                    angular.forEach(processedData[config.embeddedNewKey], function (value, key) {

                        // if the embeddedResourceName config variable is set to true, process each resource name array
                        if (value instanceof Array) {
                            var processedDataArray = [];
                            angular.forEach(value, function (arrayValue, arrayKey) {
                                processedDataArray[arrayKey] = processDataFunction(arrayValue, fetchLinkNames, recursive);
                            });
                            processedData[config.embeddedNewKey][key] = processedDataArray;
                        }
                        else {
                            // single objects are processed directly
                            processedData[config.embeddedNewKey][key] = processDataFunction(value, fetchLinkNames, recursive);
                        }
                    });
                }

                // return the original data object if no processing is done
                return processedData ? processedData : data;

                /**
                 * Gets the processed URL of the given resource name form the given data object.
                 * @param {object} data the given data object
                 * @param {string} resourceName the resource name from which the URL is retrieved
                 * @returns {string} the processed url
                 */
                function getProcessedUrl(data, resourceName) {
                    // get the raw URL out of the resource name and check if it is valid
                    var rawUrl = checkUrl(data[config.linksKey][resourceName][config.linksHrefKey], resourceName,
                        config.linksHrefKey);

                    // extract the template parameters of the raw URL
                    return extractUrl(rawUrl, data[config.linksKey][resourceName].templated);
                }
            };

            /**
             * The actual adapter method which processes the given promise object and adds
             * the wrapped resource property to all embedded elements where resources are available.
             *
             * @param {promise} promise the given promise which resolves with a promise data object which holds a data
             * property with the given response
             * @param {object|string} fetchLinkNames the link names to be fetched automatically or the
             * 'fetchAllLinkNamesKey' key from the config object to fetch all links except the 'self' key.
             * @param {boolean} recursive true if the automatically fetched response should be processed recursively with the
             * adapter, false otherwise
             * @returns {object} the processed JSON data
             */
            var processDataWithPromise = function processDataFunction(promise, fetchLinkNames, recursive) {

                // convert the given promise to a $q promise
                var qPromise = $injector.get("$q").when(promise);
                var deferred = $injector.get("$q").defer();

                qPromise.then(function (promiseData) {
                    // process the given promiseData and resolve the promise with the processed data
                    var processedData = processData(promiseData.data, fetchLinkNames, recursive);
                    deferred.resolve(processedData);
                }, function (error) {
                    deferred.reject(error);

                    // reject the error because we do not handle the error here
                    return $injector.get("$q").reject(error);
                });

                // return the promise
                return deferred.promise;
            };

            // return an object with the processData function
            return { process: processData, processWithPromise: processDataWithPromise };
        }]
    };

});

/**
 * @module spring-data-rest
 * @version 0.3.2
 *
 * Provider for the interceptor which wraps the SpringDataRestAdapter around the response object.
 */
angular.module("spring-data-rest").provider("SpringDataRestInterceptor",
    ["$httpProvider", "SpringDataRestAdapterProvider",
        function ($httpProvider) {
            return {

                apply: function () {
                    $httpProvider.interceptors.push("SpringDataRestInterceptor");
                },

                $get: ["SpringDataRestAdapter", "$q", function (SpringDataRestAdapter, $q) {

                    return {
                        response: function (response) {
                            if (response && angular.isObject(response.data)) {
                                response.data = SpringDataRestAdapter.process(response.data);
                            }
                            return response || $q.when(response);
                        }
                    };
                }]

            };

        }]
);

/**
 * Makes a deep extend of the given destination object and the source objects.
 *
 * @param {object} destination the destination object
 * @returns {object} a copy of the extended destination object
 */
function deepExtend(destination) {
    angular.forEach(arguments, function (obj) {
        if (obj !== destination) {
            angular.forEach(obj, function (value, key) {
                if (destination[key] && destination[key].constructor && destination[key].constructor === Object) {
                    deepExtend(destination[key], value);
                } else {
                    destination[key] = value;
                }
            });
        }
    });
    return angular.copy(destination);
}

/**
 * Moves a key with an array value to the destination key. It is also possible to specify to use the value of the
 * first key of the object[sourceKey] object instead of the same object.
 *
 * @param {object} object the object in which the source key exists and destination key is created
 * @param {string} sourceKey the source key from which the array is moved
 * @param {string} destinationKey the destination key to which the array is moved
 * @param {boolean} useSameObject true if the same object is used for the destinationKey, false if the value of the
 * first key is used
 * @returns {object} the processed object
 */
function moveArray(object, sourceKey, destinationKey, useSameObject) {
    var embeddedObject = object[sourceKey];
    if (embeddedObject) {
        var processedData = {};
        processedData[destinationKey] = {};

        if (useSameObject === true) {
            // loop over all items in the embedded object and add them to the processed data
            angular.forEach(Object.keys(embeddedObject), function (key) {
                processedData[destinationKey][key] = embeddedObject[key];
            });
        } else {
            // remove the key and replace it with the value of it
            var key = Object.keys(embeddedObject)[0];
            processedData[destinationKey] = embeddedObject[key];
        }

        object = angular.extend(object, processedData);
        delete object[sourceKey];
    }
    return object;
}

/**
 * Extracts the url out of a url string. If template parameters exist, they will be removed from the
 * returned url.
 *
 * @param {string} url the url string from which to extract the url
 * @param {boolean} templated true if the url is templated
 * @returns {string} the url of the resource object
 */
function extractUrl(url, templated) {
    if (templated) {
        url = removeTemplateParameters(url)
    }
    return url;
}

/**
 * Checks the given URL if it is valid and throws a parameterized exception containing the resource name and the
 * URL property name.
 *
 * @param {string} url the URL to check
 * @param {string} resourceName the name of the resource
 * @param {string} hrefKey the URL property key
 * @returns {string} the URL if it is valid
 * @throws Error if the URL is not valid
 */
function checkUrl(url, resourceName, hrefKey) {
    if (url == undefined || !url) {
        throw new Error("The provided resource name '" + resourceName + "' has no valid URL in the '" +
        hrefKey + "' property.");
    }
    return url
}

/**
 * Removes the template parameters of the given url. e.g. from this url
 * 'http://localhost:8080/categories{?page,size,sort}' it will remove the curly braces
 * and everything within.
 *
 * @param {string} url the url with the template parameters
 * @returns {string} the url without the template parameters
 */
function removeTemplateParameters(url) {
    return url.replace(/{.*}/g, '');
}

/**
 * Returns the template parameters of the given url as object. e.g. from this url
 * 'http://localhost:8080/categories{?page,size,sort}' it will return the following object:
 * {'page': "", 'size': "", 'sort': ""}
 *
 * @param {string} url the url with the template parameters
 * @returns {object} the object containing the template parameters
 */
function extractTemplateParameters(url) {
    var templateParametersObject = {};

    var regexp = /{\?(.*)}/g;
    var templateParametersArray = regexp.exec(url)[1].split(',');

    angular.forEach(templateParametersArray, function (value) {
        templateParametersObject[value] = "";
    });

    return templateParametersObject;
}

})();