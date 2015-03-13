# Release notes of angular-spring-data-rest

## Version 0.3.2

* Tag: [0.3.2](https://github.com/guylabs/angular-spring-data-rest/tree/0.3.2)
* Release: [angular-spring-data-rest-0.3.2.zip](https://github.com/guylabs/angular-spring-data-rest/releases/download/0.3.2/angular-spring-data-rest-0.3.2.zip)

### Changes

* Add ability to have multiple embedded items. See documentation about `embeddedNamedResources` configurtion option. Thanks to Alexander and Mihai for having the idea and helping out with https://github.com/guylabs/angular-spring-data-rest/pull/4.

### Migration notes

* No migration needed.

## Version 0.3.1

* Tag: [0.3.1](https://github.com/guylabs/angular-spring-data-rest/tree/0.3.1)
* Release: [angular-spring-data-rest-0.3.1.zip](https://github.com/guylabs/angular-spring-data-rest/releases/download/0.3.1/angular-spring-data-rest-0.3.1.zip)

### Changes

* Add empty string as default parameter value when returning the available resources instead of undefined.

### Migration notes

* You will need to change the logic on your side if you use the object which is returned if the `_resources` method is called without any parameter. The parameters have now an empty string set as default value instead of `undefined`.

## Version 0.3.0

* Tag: [0.3.0](https://github.com/guylabs/angular-spring-data-rest/tree/0.3.0)
* Release: [angular-spring-data-rest-0.3.0.zip](https://github.com/guylabs/angular-spring-data-rest/releases/download/0.3.0/angular-spring-data-rest-0.3.0.zip)

### Changes

* Automatic fetching of links
* Refactor the configuration object
* Add ability to set the response as promise
* Return value of the `SpringDataRestAdapter` is an object with a `process` property which holds the core function.
* Ability to pass a promise as data object to the `SpringDataRestAdapter` to support asynchronous response handling.

### Migration notes

* You will need to change your overridden configuration objects, as the keys of the configuration objects have been changed.
* You will need to change all calls from `new SpringDataRestAdapter(responseData)` to `SpringDataRestAdapter.process(responseData)`.

## Version 0.2.0

* Tag: [0.2.0](https://github.com/guylabs/angular-spring-data-rest/tree/0.2.0)
* Release: [angular-spring-data-rest-0.2.0.zip](https://github.com/guylabs/angular-spring-data-rest/releases/download/0.2.0/angular-spring-data-rest-0.2.0.zip)

### Changes

* Add ability to exchange the *Angular* ``$resource`` method with an own implementation
* Updated source and test files structure
* Add package to bower repository

## Version 0.1.0

* Tag: [0.1.0](https://github.com/guylabs/angular-spring-data-rest/tree/0.1.0)
* Release: [angular-spring-data-rest-0.1.0.zip](https://github.com/guylabs/angular-spring-data-rest/releases/download/0.1.0/angular-spring-data-rest-0.1.0.zip)

### Changes

* Initial release of `angular-spring-data-rest`
