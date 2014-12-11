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
function moveArray(object, sourceKey, destinationKey) {
    var embeddedObject = object[sourceKey];
    if (embeddedObject) {
        var key = Object.keys(embeddedObject)[0];
        var processedData = {};
        processedData[destinationKey] = embeddedObject[key];

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
