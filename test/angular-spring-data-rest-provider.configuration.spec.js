describe("the configuration", function () {

    beforeEach(beforeEachFunction);

    it("must return the default configuration object when no parameter is given", function () {
        var defaultConfiguration = {
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
        expect(this.config).toEqual(defaultConfiguration);
    });

    it("must throw an error if the given configuration parameter is not an object", function () {
        var invalidIntegerConfig = 42;
        expect(function () {
            springDataRestAdapterProvider.config(invalidIntegerConfig)
        }).toThrow("The given configuration '" + invalidIntegerConfig + "' is not an object.");

        var invalidStringConfig = "invalid";
        expect(function () {
            springDataRestAdapterProvider.config(invalidStringConfig)
        }).toThrow("The given configuration '" + invalidStringConfig + "' is not an object.");
    });

    it("must return the updated configuration object when a valid configuration object is given", function () {
        var newConfiguration = {
            'links': {
                'key': '_linksNew'
            },
            'embedded': {
                'key': '_embeddedNew',
                'value': 'embeddedNew'
            },
            'hrefKey': 'hrefNew',
            'resourcesKey': 'resourcesNew',
            'resourcesFunction': undefined
        };

        expect(springDataRestAdapterProvider.config(newConfiguration)).toEqual(newConfiguration);
        expect(springDataRestAdapterProvider.config()).toEqual(newConfiguration);
    });

    it("must return the updated configuration object when a partial configuration object is given", function () {
        var partialConfiguration = {
            'links': {
                'key': '_linksNew'
            },
            'embedded': {
                'value': 'embeddedNew'
            },
            'hrefKey': 'hrefNew'
        };

        var newConfiguration = {
            'links': {
                'key': '_linksNew'
            },
            'embedded': {
                'key': '_embedded',
                'value': 'embeddedNew'
            },
            'hrefKey': 'hrefNew',
            'resourcesKey': '_resources',
            'resourcesFunction': undefined
        };

        expect(springDataRestAdapterProvider.config(partialConfiguration)).toEqual(newConfiguration);
        expect(springDataRestAdapterProvider.config()).toEqual(newConfiguration);
    });

    it("must be able to add a function to the resourcesFunction key", function () {
        var value = 1;

        var partialConfiguration = {
            'resourcesFunction': function () {
                value = 2;
            }
        };

        // set the new configuration and check that the resourcesFunction is type of function
        springDataRestAdapterProvider.config(partialConfiguration);
        expect(typeof(springDataRestAdapterProvider.config().resourcesFunction) == "function").toEqual(true);

        // call the method and check the value
        springDataRestAdapterProvider.config().resourcesFunction();
        expect(value).toEqual(2);
    });

    it("must throw an error if the given resourcesFunction is not a function", function () {
        var invalidResourceFunctionConfiguration = {
            'resourcesFunction': 'function'
        };

        // set the new configuration and check that the resourcesFunction is type of function
        expect(function () {
            springDataRestAdapterProvider.config(invalidResourceFunctionConfiguration)
        }).toThrow("The given resource function 'function' is not of type function.");
    });

});
