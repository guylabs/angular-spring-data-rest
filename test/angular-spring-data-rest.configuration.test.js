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
            'resourcesKey': '_resources'
        };
        expect(this.config).toEqual(defaultConfiguration);
    });

    it("must throw an error if the given configuration parameter is not an object", function () {
        var invalidIntegerConfig = 42;
        expect(function () {
            springDataRestAdapterProvider.config(invalidIntegerConfig)
        }).toThrow("The given configuration " + invalidIntegerConfig + " is not an object.");

        var invalidStringConfig = "invalid";
        expect(function () {
            springDataRestAdapterProvider.config(invalidStringConfig)
        }).toThrow("The given configuration " + invalidStringConfig + " is not an object.");
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
            'resourcesKey': 'resourcesNew'
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
            'resourcesKey': '_resources'
        };

        expect(springDataRestAdapterProvider.config(partialConfiguration)).toEqual(newConfiguration);
        expect(springDataRestAdapterProvider.config()).toEqual(newConfiguration);
    });

});
