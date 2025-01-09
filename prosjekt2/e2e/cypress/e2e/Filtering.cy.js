describe("Filtering functionality", function () {
    beforeEach("Set username in local storage", function () {
        cy.window().then(function (win) {
            win.localStorage.setItem("username", "Testinge2e");
        });
        cy.visit("/home");
        cy.contains("Rating High-Low").click();
        cy.contains("Name A-Z").click();
    });
    afterEach("Go back to default main page", function () {
        cy.visit("/home");
    });
    it("checks that all cocktails are shown when no filter is chosen", function () {
        cy.get(".cocktail-number-text")
            .should("be.visible")
            .and("contain.text", "426");
    });
    it("should return the correct number of cocktails when filtering", function () {
        cy.get("[data-testid=filtering-options]").should("exist").click();
        cy.contains("Gin").should("exist").click();
        cy.get(".cocktail-number-text")
            .should("be.visible")
            .and("contain.text", "82");
    });
    it("should make sure that the cocktails contains chosen alcohol", function () {
        cy.get("[data-testid=filtering-options]").click();
        cy.contains("Gin").click();
        cy.get("body").click(10, 10); // Click at the bacground to remove filter box
        cy.get(".cocktail-card").should("contain.text", "A1");
        cy.contains("A1").click();
        cy.get(".ingredients-card").should("contain.text", "Gin");
    });
    it("checks that cocktails without chosen alcohol isn't shown", function () {
        cy.get("[data-testid=filtering-options]").click();
        cy.contains("Gin").click();
        cy.get(".cocktail-card").should("not.contain.text", "A. J.");
    });
    it("checks that multiple filters work together", function () {
        // Only filter on Brandy
        cy.get("[data-testid=filtering-options]").click();
        cy.contains("li", "Brandy").click();
        cy.get("body").click(10, 10); // Click at the bacground to remove filter box
        cy.get(".cocktail-card").should("contain.text", "City Slicker");
        cy.get(".cocktail-card").should("not.contain.text", "Chocolate Milk");
        cy.visit("/home");
        // Add Amaretto to filter as well as Brandy
        cy.get("[data-testid=filtering-options]").click();
        cy.contains("li", "Amaretto").click();
        cy.get("body").click(10, 10); // Click at the bacground to remove filter box
        cy.get(".cocktail-card").should("contain.text", "City Slicker");
        cy.get(".cocktail-card").should("contain.text", "Chocolate Milk");
        cy.visit("/home");
        // Remove Brandy from filter
        cy.get("[data-testid=filtering-options]").click();
        cy.contains("li", "Brandy").click();
        cy.get("body").click(10, 10); // Click at the bacground to remove filter box
        cy.get(".cocktail-card").should("not.contain.text", "City Slicker");
        cy.get(".cocktail-card").should("contain.text", "Chocolate Milk");
    });
    it("checks that it works to filter and search", function () {
        // Filtering on Tequila
        cy.get("[data-testid=filtering-options]").click();
        cy.contains("li", "Tequila").click();
        cy.get("body").click(10, 10); // Click at the bacground to remove filter box
        cy.get(".cocktail-card").should("contain.text", "Margarita");
        cy.get(".cocktail-card").should("contain.text", "Long Island Tea");
        // Searching on "long"
        cy.get('[placeholder="Are you ready for it?"]').type("long");
        cy.get(".cocktail-card").should("not.contain.text", "Margarita");
        cy.get(".cocktail-card").should("contain.text", "Long Island Tea");
    });
});
