describe("the response with the link values", function () {

    beforeEach(beforeEachFunction);

    it("must contain the 'links key' key", function () {
        expect(this.response[this.config.links.key]).toBeDefined();
    });

    it("must call the correct href url if a link name is passed to the $resource method", function () {

        // define the link name and the correct link href url
        var linkName = "self";
        var linkHref = "http://localhost:8080/categories";

        // check if the underlying $resource method is called with the correct href url
        var expectedResult = {categoryId: '123'};
        this.httpBackend.whenGET(linkHref).respond(200, expectedResult);
        this.httpBackend.expectGET(linkHref);
        var result = this.response[this.config.resourceKey](linkName).get(function() {
            expect(result.categoryId).toEqual(expectedResult.categoryId);
        });
        this.httpBackend.flush();
    });

});
