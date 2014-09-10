/**
 * @module spring-data-rest
 * @version <%= pkg.version %>
 *
 * Provider for the SpringDataRestAdapter which is the core of this module.
 */
angular.module("spring-data-rest").provider("SpringDataRestAdapter", function () {

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
        'resourcesKey': '_resources',
        'resourcesFunction': undefined
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
            function callBackend(url, paramDefaults, actions, options) {
                if (config.resourcesFunction == undefined) {
                    return $injector.get("$resource")(url, paramDefaults, actions, options);
                } else {
                    return config.resourcesFunction(url, paramDefaults, actions, options);
                }
            }

            /**
             * The actual adapter method which processes the given JSON data object and adds
             * the wrapped resource property to all embedded elements where resources are available.
             *
             * @param {object} data the given JSON data
             * @returns {object} the processed JSON data
             */
            var SpringDataRestAdapter = function (data) {

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
                    var resources = this[config.links.key];
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

                        return processUrlAndCallBackend(resourceObject.name, parameters, actions, options);

                    } else if (resourceObject in resources) {
                        return processUrlAndCallBackend(resourceObject, parameters, actions, options);
                    }

                    // return the available resources as resource object array if the resource object parameter is not set
                    var availableResources = [];
                    angular.forEach(resources, function (value, key) {
                        if (value.templated) {
                            var templateParameters = extractTemplateParameters(value[config.hrefKey]);
                            availableResources.push({"name": key, "parameters": templateParameters});
                        } else {
                            availableResources.push({"name": key});
                        }
                    });
                    return availableResources;

                    function processUrlAndCallBackend(resourceName, parameters, actions, options) {
                        // get the raw URL out of the resource name and check if it is valid
                        var rawUrl = checkUrl(data[config.links.key][resourceName][config.hrefKey], resourceName,
                            config.hrefKey);

                        // extract the template parameters of the raw URL
                        var url = extractUrl(rawUrl, data[config.links.key][resourceName].templated);

                        // call the backend method with the processed URL, parameters, actions and options
                        return callBackend(url, parameters, actions, options);
                    }
                };

                // throw an exception if given data parameter is not of type object
                if (!angular.isObject(data) || data instanceof Array) {
                    throw new Error("Given data '" + data + "' is not of type object.");
                }

                var processedData = undefined;

                // only add the resource method to the object if the links key is present
                if (config.links.key in data) {

                    // add Angular resources property to object
                    var resourcesObject = {};
                    resourcesObject[config.resourcesKey] = resources;
                    processedData = angular.extend(this, angular.copy(data), resourcesObject);
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

});
