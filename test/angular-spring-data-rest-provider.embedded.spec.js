describe("the response with the embedded values", function () {

    beforeEach(beforeEachFunction);

    it("must not contain the 'embedded key' key anymore", function () {
        expect(this.response[this.config.embeddedKey]).not.toBeDefined();
    });

    it("must contain the 'embedded value key' as key", function () {
        expect(this.response[this.config.embeddedNewKey]).toBeDefined();
    });

    it("must be an array with the size of two", function () {

        // expect that the embedded key value is an array of the size 2
        expect(this.response[this.config.embeddedNewKey] instanceof Array).toBe(true);
        expect(this.response[this.config.embeddedNewKey].length).toBe(2);
    });

    it("must contain a resource key in all embedded values", function () {

        // iterate over all entries of the embedded values and test the resource method
        for (var key in this.response[this.config.embeddedNewKey]) {

            // the resource key must be defined
            expect(this.response[this.config.embeddedNewKey][key][this.config.resourcesKey]).toBeDefined();

            // the resource value must be a valid function with the given parameters
            expectResourceExecution(this.response[this.config.embeddedNewKey][key], this.config.resourcesKey,
                this.response[this.config.embeddedNewKey][key][this.config.linksKey]["self"].href, this.httpBackend, "self");
        }
    });

    it("must call the correct href url if a link name is passed to the $resource method", function () {

        // define the link names and the correct link href urls
        var linkNames = ["self", "parentCategory", "self", "parentCategory"];
        var linkHrefs = ["http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54",
            "http://localhost:8080/categories/f974f5ef-a951-43b4-9027-4d2163216e54/parentCategory",
            "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697",
            "http://localhost:8080/categories/b5ba38d5-98d3-4579-8709-a28549406697/parentCategory"];

        var i = 0;

        // iterate over all entries of the embedded values and test the resource method
        for (var key in this.response[this.config.embeddedNewKey]) {

            for (var j = 0; j < 2; j++) {
                // check if the underlying $resource method is called with the correct href url
                var expectedResult = {categoryId: '123' + i};
                this.httpBackend.whenGET(linkHrefs[i]).respond(200, expectedResult);
                this.httpBackend.expectGET(linkHrefs[i]);

                var result = this.response[this.config.embeddedNewKey][key][this.config.resourcesKey](linkNames[i]).get(function () {
                    expect(result.categoryId).toEqual(expectedResult.categoryId);
                });
                this.httpBackend.flush();
                i++;
            }
        }
    });

});
