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
 * Extracts the url out of a resource object. If template parameters exist, they will be removed from the
 * returned url.
 *
 * @param {object} data the data object to get the resource object from
 * @param {string} resourceName the name of the resource
 * @returns {string} the url of the resource object
 */
function extractUrl(data, url, templated) {
    if (templated) {
        url = removeTemplateParameters(url)
    }
    return url;
}

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
 * Returns the template parameters of the given url as array. e.g. from this url
 * 'http://localhost:8080/categories{?page,size,sort}' it will return the following array:
 * ['page', 'size', 'sort']
 *
 * @param {string} url the url with the template parameters
 * @returns {object} the array containing the template parameters
 */
var extractTemplateParameters = function (url) {
    var templateParametersObject = {};

    var regexp = /{\?(.*)}/g;
    var templateParametersArray = regexp.exec(url)[1].split(',');

    angular.forEach(templateParametersArray, function (value) {
        templateParametersObject[value] = undefined;
    });

    return templateParametersObject;
};
