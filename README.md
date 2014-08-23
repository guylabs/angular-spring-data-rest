# angular-spring-data-rest

> An AngularJS module with an additional interceptor which wraps the Angular [$resource](https://docs.angularjs.org/api/ngResource/service/$resource) function and therefore eases the use with a [Spring Data REST](http://projects.spring.io/spring-data-rest) backend.

#Table of contents

- [Overview](#overview)
- [The `SpringDataRestAdapter`](#the-springdatarestadapter)
    - [Usage of `SpringDataRestAdapter`](#usage-of-springdatarestadapter)
    - [Usage of `_resources` method](#usage-of-resources-method)
        - [The `_resources` method parameters and return type](#the-resources-method-parameters-and-return-type)
            - [`_resources` usage example](#resources-usage-example)
    - [Usage of `_embeddedItems` property](#usage-of-embeddedItems-property)
        - [`_embeddedItems` usage example](#embeddedItems-usage-example)
    - [Configuration of the `SpringDataRestAdapter`](#configuration-of-the-springdatarestadapter)
- [The `SpringDataRestInterceptor`](#the-springdatarestinterceptor)
- [Dependencies](#dependencies)
- [Release notes](#release-notes)
- [Acknowledgements](#acknowledgements)
- [License](#license)


## Overview

*Spring Data REST* integrates [Spring HATEOAS](http://projects.spring.io/spring-hateoas) by default. This simplifies the creation of REST presentations which are generated with the [HATEOAS](http://en.wikipedia.org/wiki/HATEOAS) principle.

Therefore the *Spring Data REST* responses have resources and embedded resources like in the following JSON response example:

```json
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
                "name": "Test category 1",
                "_links": {
                    "self": {
                        "href": "http://localhost:8080/categories/1"
                    },
                    "parentCategory": {
                        "href": "http://localhost:8080/categories/1/parentCategory"
                    }
                }
            },
            {
                "name": "Test category 2",
                "_links": {
                    "self": {
                        "href": "http://localhost:8080/categories/2"
                    },
                    "parentCategory": {
                        "href": "http://localhost:8080/categories/2/parentCategory"
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
```
The above response is the result of calling the endpoint to get all categories(`http://localhost:8080/categories`). It contains the `_links` property which holds an object with several named resources(e.g. `self`). These resources are used to navigate to a related entity(e.g. `parentCategory`) or to a specific endpoint defined by the backend.

The `_embedded` property holds an array of the requested items, and each of the items has again a `_links` property which defines the resources for the specific item. You can find more about how the responses of *Spring Data REST* look like [here](http://projects.spring.io/spring-data-rest).

This *Angular* module provides two ways of processing a response from the *Spring Data REST* backend and ease the usage with the resources and embedded items:

1. Using a new instance of the `SpringDataRestAdapter`.
2. Add the `SpringDataRestInterceptor` to the Angular `$httpProvider.interceptors` such that all responses are processed.

## The `SpringDataRestAdapter`

The `spring-data-rest` *Angular* module provides a provider for the `SpringDataRestAdapter` object. This object is the core of the module and it processes a given response and adds the following additional properties/methods to it:

1. `_resources`: this method wraps the *Angular* `$resource` function and adds an easy way to retrieve the resources defined in the `_links` property. It is also used to retrieve all available resources of the given object. Read more about this property [here](#usage-of-_resources-property).
2. `_embeddedItems`: this property replaces the `_embedded` property and sets the named array (`categories` in the upper example response) with the embedded items as its value. Read more about this property [here](#usage-of-_embeddedItems-property).

Spring Data REST also generates an index response when you make a `GET` response to the configured base url of the dispatcher servlet. This response looks like the following example:

```javascript
{
  "_links" : {
    "users" : {
      "href" : "http://localhost:8080/users{?page,size,sort}",
      "templated" : true
    },
    "categories" : {
      "href" : "http://localhost:8080/categories{?page,size,sort}",
      "templated" : true
    },
    "accounts" : {
      "href" : "http://localhost:8080/accounts{?page,size,sort}",
      "templated" : true
    },
    ...
  }
}
```

This response shows all configured Spring Data REST repositories and the links to these resources. The `SpringDataRestAdapter` is also able to handle this response and to provide an easy method to retrieve all the available resources with the `_resources` method. Please read more about this [here](#the-_resources-method-parameters-and-return-type).

### Usage of `SpringDataRestAdapter`

To use the `SpringDataRestAdapter` object you need to include the `angular-spring-data-rest.js` file (or the minified version) and add the `spring-data-rest` module as a dependency in your module declaration:

```javascript
var myApp = angular.module("myApplication", ["ngResource", "spring-data-rest"]);
```

Now you are able to instantiate the `SpringDataRestAdapter` object and process a given response:

```javascript
var processedResponse = new SpringDataRestAdapter(response);
```

Please read on on how to use the `_resources` method and the `_embeddedItems` property to ease the handling of resources and embedded items.

### Usage of `_resources` method

The `_resources` property is added on the same level of the JSON response object where a `_links` property exists. When for example the following JSON response object is given:

```javascript
var response = {
    "_links": {
        "self": {
            "href": "http://localhost:8080/categories{?page,size,sort}",
            "templated": true
        }
    },
    "_embedded": {
        ...
    }
    ...
}
var processedResponse = new SpringDataRestAdapter(response);
```

Then the `SpringDataRestAdapter` will add the `_resources` method to the same level such that you can call it the following way:

```javascript
processedResponse._resources(linkName, paramDefaults, actions, options);
```

This `_resources` method is added recursively to all the properties of the JSON response object where a `_links` property exists.

#### The `_resources` method parameters and return type

The `_resources` method takes the following four parameters:

* `linkName`: the name of the link's `href` you want to call with the underlying *Angular* `$resource` function. You can also pass in a resource object with parameters in the following way:

```javascript
var resourceObject = {
    "name": "self",
    "parameters": {
        "size": 20,
        "sort": "asc"
    }
}
processedResponse._resources(resourceObject, paramDefaults, actions, options);
```

This will call *Angular* `$resource` method with the `href` of the `self` resource and will add the parameters `size` and `sort` as query string to the URL. If the resource object parameters and the `paramDefaults` parameters are set, then these two objects are merged such that the resource object parameters appear first in the new object and the `paramDefaults` parameters last.

* `paramDefaults`: the default values for url parameters. Read more  [here](https://docs.angularjs.org/api/ngResource/service/$resource).
* `actions`: custom action that should extend the default set of the `$resource` actions. Read more [here](https://docs.angularjs.org/api/ngResource/service/$resource).
* `options`: custom settings that should extend the default `$resourceProvider` behavior Read more [here](https://docs.angularjs.org/api/ngResource/service/$resource).

The `_resources` method returns the *Angular* resource "class" object with methods for the default set of resource actions. Read more [here](https://docs.angularjs.org/api/ngResource/service/$resource).

If no parameter is given the `_resources` method will return all available resources on the given object. When for example the following JSON response object is given:

```javascript
var response = {
    "_links": {
        "self": {
            "href": "http://localhost:8080/categories{?page,size,sort}",
            "templated": true
        },
        "parentCategory": {
            "href": "http://localhost:8080/categories/1/parentCategory"
        }
    },
    "_embedded": {
        ...
    }
    ...
}
var processedResponse = new SpringDataRestAdapter(response);
```
Then the following call to the `_resources` method without any parameter will return an array of all the resources available.

```javascript
var availableResources = processedResponse._resources();
```

The above call will result in the following return value: `['self', 'parentCategory']`. This functionality is useful if you want to first check all available resources before using the `_resources` method to retrieve the specific resource.

#### `_resources` usage example

This example refers to the JSON response in the [Overview](#overview). If you want to get the parent category of a category you would call the `_resources` method the following way:

```javascript
var processedResponse = new SpringDataRestAdapter(response);
var parentCategoryResource = processedResponse._embeddedItems[0]._resources("parentCategory");

// create a GET request, with the help of the Angular resource class, to the parent category
// url and log the response to the console
var parentCategory = parentCategoryResource.get(function() {
    console.log("Parent category name: " + parentCategory.name);
});
```

### Usage of `_embeddedItems` property

The `_embeddedItems` property is just a convention property created by the `SpringDataRestAdapter` to easily iterate over the `_emebedded` items in the response. Like with the `_resources` method, the `SpringDataRestAdapter` will recursively create an `_embeddedItems` property on the same level as a `_embedded` property exists for all the JSON response properties.

#### `_embeddedItems` usage example

This example refers to the JSON response in the [Overview](#overview). If you want to iterate over all categories in the response you would do it in the following way:

```javascript
var processedResponse = new SpringDataRestAdapter(response);

// log the name of all categories contained in the response to the console
angular.forEach(processedResponse._embeddedItems, function (category, key) {
    console.log("Category name: " + category.name);
});
```

**Be aware** that the original `_embedded` property gets deleted after the `SpringDataRestAdapter` processed the response.


### Configuration of the `SpringDataRestAdapter`

The `SpringDataRestAdapter` is designed to be configurable and you are able to configure the following properties:

* `links.key` (default: `_links`): the property name where the resources are stored.
* `embedded.key` (default: `_embedded`): the property name where the embedded items are stored.
* `embedded.value` (default: `_embeddedItems`): the property name where the array of embedded items are stored.
* `hrefKey` (default: `href`): the property name where the url is stored under each specific link.
* `resourcesKey` (default: `_resources`): the property name where the resource method is stored.

You are able to configure the `SpringDataRestAdapter` provider in a *Angular* configuration block in the following way:

```javascript
myApp.config(function (SpringDataRestAdapterProvider) {

    // set the links key to _myLinks
    SpringDataRestAdapterProvider.config({
        'links': {
            'key': '_myLinks'
        }
    });
});
```

The config method of the `SpringDataRestAdapterProvider` takes a configuration object and you are able to override each value or completely replace the whole configuration object. The default configuration object looks like this:

```json
{
    "links": {
        "key": "_links"
    },
    "embedded": {
        "key": "_embedded",
        "value': "_embeddedItems"
    },
    "hrefKey": "href",
    "resourcesKey": "_resources"
}
```


## The `SpringDataRestInterceptor`

If you want to use the `SpringDataRestAdapter` for all responses of the *Angular* `$http` service then you can add the `SpringDataRestInterceptor` to the `$httpProvider.interceptors` in an *Angular* configuration block:

```javascript
myApp.config(function (SpringDataRestInterceptorProvider) {
    SpringDataRestInterceptorProvider.apply();
});
```
The `apply` method will automatically add the `SpringDataRestInterceptor` to the `$httpProvider.interceptors`.

## Dependencies

The `spring-data-rest` *Angular* module requires the `ngResource` *Angular* module.

## Release notes

Check them here: [Release notes](https://github.com/guylabs/angular-spring-data-rest/blob/master/RELEASENOTES.md)

## Acknowledgements

When I first searched for an *Angular* module for Spring Data REST I just found the marvelous project of Jeremy which is useful if you just use [Spring HATEOAS](http://projects.spring.io/spring-hateoas). So please have a look at his [angular-hateoas](https://github.com/jmarquis/angular-hateoas) project because he gave me the full permissions to use his code base and project structure for this project here. At this point I want to thank him for his nice work.

## License

This *Angular* module is available under the MIT license.

(c) All rights reserved Guy Brûlé
