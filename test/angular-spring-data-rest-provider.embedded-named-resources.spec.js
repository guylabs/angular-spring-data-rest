describe("the response with the embedded values", function () {

    beforeEach(function () {
        module('ngResource');
        module('spring-data-rest');

        // initialize the provider by injecting it to a config block of a test module
        // and assign it to the this scope such that it is available in each test
        // (see https://jasmine.github.io/2.0/introduction.html#section-The_<code>this</code>_keyword)
        angular.module('testModule', function () {
        }).config(function (SpringDataRestAdapterProvider) {
            SpringDataRestAdapterProvider.config({
                'embeddedNamedResources': true
            });
            springDataRestAdapterProvider = SpringDataRestAdapterProvider;
        });

        // initialize test module injector
        module('testModule');

        inject(function (_SpringDataRestAdapter_) {
            SpringDataRestAdapter = _SpringDataRestAdapter_;
        });

        // initialize the configuration, the raw and the processed response
        this.config = springDataRestAdapterProvider.config();
        this.rawResponse = mockData();
        this.response = SpringDataRestAdapter.process(this.rawResponse);
    });

    it("must have the named resources if the embeddedNamedResources is set to true", function () {
        // expect that the first key of the embedded items is categories
        var key = Object.keys(this.response[this.config.embeddedNewKey])[0];
        expect(key).toBe("categories");

        // expect that the embedded key value is an array of the size 2
        expect(this.response[this.config.embeddedNewKey]['categories'] instanceof Array).toBe(true);
        expect(this.response[this.config.embeddedNewKey]['categories'].length).toBe(2);
    });

});
