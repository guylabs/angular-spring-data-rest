/**
 * @module spring-data-rest
 * @version 0.1.0
 *
 * An AngularJS module for using `$resource` with a Spring Data REST backend.
 */

'use strict';

angular.module("spring-data-rest", ["ngResource"])

    .provider("SpringDataRestAdapter", function () {

        /**
         * Default configuration for spring data rest defaults
         */
        var config = {
            'links': {
                'key': '_links'
            },
            'embedded': {
                'key': '_embedded',
                'value': '_embeddedItems'
            },
            'hrefKey': 'href',
            'resourcesKey': '_resources'
        };


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
                        throw new Error("The given configuration " + newConfig + " is not an object.");
                    }
                    // override the default configuration properties with the given new configuration
                    config = deepExtend(config, newConfig);
                }
                return config;
            },

            $get: ["$injector", function ($injector) {

                /**
                 * Moves a key with an array value to the destination key.
                 *
                 * @param {object} object the object in which the source key exists and destination key is created
                 * @param {string} sourceKey the source key from which the array is moved
                 * @param {string} destinationKey the destination key to which the array is moved
                 * @returns {object} the processed object
                 */
                var moveArray = function (object, sourceKey, destinationKey) {
                    var embeddedObject = object[sourceKey];
                    if (embeddedObject) {
                        var key = Object.keys(embeddedObject)[0];
                        var processedData = {};
                        processedData[destinationKey] = embeddedObject[key];

                        object = angular.extend(object, processedData);
                        delete object[sourceKey];
                    }
                    return object;
                };

                /**
                 * Wraps the angular $resource method and adds the ability to call the endpoint of a link name. If no
                 * parameter is given it will return an array with the available resources in this object.
                 *
                 * @param {string} linkName the link name to be called
                 * @param {object} paramDefaults optional $resource method parameter defaults
                 * @param {object} actions optional $resource method actions
                 * @param {object} options additional $resource method options
                 * @returns {object|array} the result of the $resource method or the available resources as an array
                 *
                 * @see https://docs.angularjs.org/api/ngResource/service/$resource
                 */
                var resources = function (linkName, paramDefaults, actions, options) {
                    if (linkName in this[config.links.key]) {
                        var url = this[config.links.key][linkName][config.hrefKey];
                        if (this[config.links.key][linkName].templated) {
                            url = removeTemplateParameters(url)
                        }
                        return $injector.get("$resource")(url, paramDefaults, actions, options);
                    } else {
                        var resources = [];
                        angular.forEach(this[config.links.key], function (value, key) {
                            resources.push(key);
                        });
                        return resources;
                    }
                };

                /**
                 * Removes the template parameters of the given url. e.g. from this url
                 * 'http://localhost:8080/categories{?page,size,sort}' it will remove the curly braces
                 * and everything within.
                 *
                 * @param {string} url the url with the template parameters
                 * @returns {string} the url without the template parameters
                 */
                var removeTemplateParameters = function (url) {
                    return url.replace(/{.*}/g, '');
                };

                /**
                 * The actual adapter method which processes the given JSON data object and adds
                 * the wrapped resource property to all embedded elements where links are available.
                 *
                 * @param {object} data the given JSON data
                 * @returns {object} the processed JSON data
                 */
                var SpringDataRestAdapter = function (data) {

                    // throw an exception if given data parameter is not of type object
                    if (!angular.isObject(data) || data instanceof Array) {
                        throw new Error("Given data '" + data + "' is not of type object.");
                    }

                    var processedData = undefined;

                    // only add the resource method to the object if the links key is present
                    if (config.links.key in data) {

                        // add angular resources property to object
                        var resourceObject = {};
                        resourceObject[config.resourcesKey] = resources;
                        processedData = angular.extend(this, angular.copy(data), resourceObject);
                    }

                    // only move the embedded values to a top level property if the embedded key is present
                    if (config.embedded.key in data) {

                        // make a defensive copy if the processedData variable is undefined
                        if (!processedData) {
                            processedData = angular.copy(data);
                        }

                        // process the embedded key and move it to an embedded value key
                        processedData = moveArray(processedData, config.embedded.key, config.embedded.value);

                        // recursively process all contained objects in the embedded value array
                        angular.forEach(processedData[config.embedded.value], function (value, key) {
                            processedData[config.embedded.value][key] = new SpringDataRestAdapter(value);
                        });
                    }

                    // return the original data object if no processing is done
                    return processedData ? processedData : data;
                };
                return SpringDataRestAdapter;
            }]
        };

    })

    .provider("SpringDataRestInterceptor", ["$httpProvider", "SpringDataRestAdapterProvider", function ($httpProvider, SpringDataRestAdapterProvider) {
        return {

            apply: function () {
                $httpProvider.interceptors.push("SpringDataRestInterceptor");
            },

            $get: ["SpringDataRestAdapter", "$q", function (SpringDataRestAdapter, $q) {

                return {
                    response: function (response) {
                        if (response && angular.isObject(response.data)) {
                            response.data = new SpringDataRestAdapter(response.data);
                        }
                        return response || $q.when(response);
                    }
                };
            }]

        };

    }]);
