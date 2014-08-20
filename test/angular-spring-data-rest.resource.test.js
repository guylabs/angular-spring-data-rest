describe("the resource property", function () {

    beforeEach(beforeEachFunction);

    it("must return the resources of the object", function () {
        this.rawResponse = mockData();
        this.response = new SpringDataRestAdapter(this.rawResponse);

        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // expect that the resource method returns the available resources on the object
        expect(this.response[this.config.resourcesKey]()).toEqual(['self']);
    });

    it("must return the resources of the index response", function () {
        this.rawResponse = mockIndexData();
        this.response = new SpringDataRestAdapter(this.rawResponse);

        // expect that the resources method is present
        expect(this.response[this.config.resourcesKey]).toBeDefined();

        // expect that the resource method returns the available resources on the index response
        expect(this.response[this.config.resourcesKey]()).toEqual(['users', 'categories', 'accounts']);
    });

});

