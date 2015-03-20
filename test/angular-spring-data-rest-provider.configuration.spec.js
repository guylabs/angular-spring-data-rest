describe("the configuration", function () {

    beforeEach(beforeEachFunction);

    it("must return the default configuration object when no parameter is given", function () {
        var defaultConfiguration = {
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
        expect(this.config).toEqual(defaultConfiguration);
    });

    it("must throw an error if the given configuration parameter is not an object", function () {
        var invalidIntegerConfig = 42;
        expect(function () {
            springDataRestAdapterProvider.config(invalidIntegerConfig)
        }).toThrowError("The given configuration '" + invalidIntegerConfig + "' is not an object.");

        var invalidStringConfig = "invalid";
        expect(function () {
            springDataRestAdapterProvider.config(invalidStringConfig)
        }).toThrowError("The given configuration '" + invalidStringConfig + "' is not an object.");
    });

    it("must return the updated configuration object when a valid configuration object is given", function () {
        var newConfiguration = {
            'linksKey': '_linksNew',
            'linksHrefKey': 'hrefNew',
            'linksSelfLinkName': 'selfNew',
            'embeddedKey': '_embeddedNew',
            'embeddedNewKey': '_embeddedItemsNew',
            'embeddedNamedResources': true,
            'resourcesKey': '_resourcesNew',
            'resourcesFunction': undefined,
            'fetchFunction': undefined,
            'fetchAllKey': '_allLinksNew'
        };

        expect(springDataRestAdapterProvider.config(newConfiguration)).toEqual(newConfiguration);
        expect(springDataRestAdapterProvider.config()).toEqual(newConfiguration);
    });

    it("must return the updated configuration object when a partial configuration object is given", function () {
        var partialConfiguration = {
            'linksKey': '_linksNew',
            'embeddedNewKey': '_embeddedItemsNew',
            'fetchAllKey': '_allLinksNew'
        };

        var newConfiguration = {
            'linksKey': '_linksNew',
            'linksHrefKey': 'href',
            'linksSelfLinkName': 'self',
            'embeddedKey': '_embedded',
            'embeddedNewKey': '_embeddedItemsNew',
            'embeddedNamedResources': false,
            'resourcesKey': '_resources',
            'resourcesFunction': undefined,
            'fetchFunction': undefined,
            'fetchAllKey': '_allLinksNew'
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

    it("must be able to add a function to the fetchFunction key", function () {
        var value = 1;

        var partialConfiguration = {
            'fetchFunction': function () {
                value = 2;
            }
        };

        // set the new configuration and check that the fetchFunction is type of function
        springDataRestAdapterProvider.config(partialConfiguration);
        expect(typeof(springDataRestAdapterProvider.config().fetchFunction) == "function").toEqual(true);

        // call the method and check the value
        springDataRestAdapterProvider.config().fetchFunction();
        expect(value).toEqual(2);
    });

    it("must throw an error if the given resourcesFunction is not a function", function () {
        var invalidResourceFunctionConfiguration = {
            'resourcesFunction': 'function'
        };

        // set the new configuration and check that the resourcesFunction is type of function
        expect(function () {
            springDataRestAdapterProvider.config(invalidResourceFunctionConfiguration)
        }).toThrowError("The given resource function 'function' is not of type function.");
    });

    it("must throw an error if the given fetchFunction is not a function", function () {
        var invalidFetchFunctionConfiguration = {
            'fetchFunction': 'function'
        };

        // set the new configuration and check that the fetchFunction is type of function
        expect(function () {
            springDataRestAdapterProvider.config(invalidFetchFunctionConfiguration)
        }).toThrowError("The given fetch function 'function' is not of type function.");
    });

});
