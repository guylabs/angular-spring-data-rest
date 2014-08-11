describe("the spring data rest adapter", function () {

    beforeEach(beforeEachFunction);

    it("must throw an exception if the data object is not an object", function () {
        var array = [1, 2, 3];
        expect(function () {
            new SpringDataRestAdapter(array)
        }).toThrow("Given data '" + array + "' is not of type object.");

        var integer = 123;
        expect(function () {
            new SpringDataRestAdapter(integer)
        }).toThrow("Given data '" + integer + "' is not of type object.");

        var string = "123";
        expect(function () {
            new SpringDataRestAdapter(string)
        }).toThrow("Given data '" + string + "' is not of type object.");
    });

    it("must throw an exception if the data object is null", function () {
        expect(function () {
            new SpringDataRestAdapter(null)
        }).toThrow("Given data '" + null + "' is not of type object.");
    });

    it("must only add the resource method if there is a links key in the data object", function () {
        this.rawResponse = mockDataWithoutLinksKey();
        this.response = new SpringDataRestAdapter(this.rawResponse);

        // expect that the links key and the resource method is not present
        expect(this.response[this.config.links.key]).not.toBeDefined();
        expect(this.response[this.config.resourceKey]).not.toBeDefined();
    });

    it("must only add the embedded value key if there is a embedded key in the data object", function () {
        this.rawResponse = mockDataWithoutEmbeddedKey();
        this.response = new SpringDataRestAdapter(this.rawResponse);

        // expect that the embedded key and value is not present
        expect(this.response[this.config.embedded.key]).not.toBeDefined();
        expect(this.response[this.config.embedded.value]).not.toBeDefined();
    });

    it("must return the original data object if no links key or embedded key is present", function () {
        this.rawResponse = mockDataWithoutAnyKey();
        this.response = new SpringDataRestAdapter(this.rawResponse);

        // expect that the links key and the resource method is not present
        expect(this.response[this.config.links.key]).not.toBeDefined();
        expect(this.response[this.config.resourceKey]).not.toBeDefined();

        // expect that the embedded key and value is not present
        expect(this.response[this.config.embedded.key]).not.toBeDefined();
        expect(this.response[this.config.embedded.value]).not.toBeDefined();

        // check that the original response is the one which is returned
        expect(this.rawResponse === this.response).toBe(true);
    });

});

