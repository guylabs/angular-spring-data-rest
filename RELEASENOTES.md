# Release notes of angular-spring-data-rest

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
