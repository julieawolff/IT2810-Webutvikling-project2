describe("Search functionality", function () {
    beforeEach("Set username in local storage", function () {
        cy.window().then(function (win) {
            win.localStorage.setItem("username", "Testinge2e");
        });
        cy.visit("/home");
    });
    afterEach("Go back to default main page()", function () {
        cy.visit("/home");
    });
    it("should only show relevant cocktail cards when searching by name", function () {
        cy.get('[placeholder="Are you ready for it?"]').type("paloma");
        cy.wait(500);
        cy.get(".cocktail-card").should("contain.text", "Paloma");
        cy.get(".cocktail-card").should("contain.text", "Winter Paloma");
        cy.get(".cocktail-card").should("not.contain.text", "Orange Rosemary Collins");
    });
    it("should only show the cocktails whose name contains search text", function () {
        cy.get('[placeholder="Are you ready for it?"]').type("ca");
        cy.wait(500);
        cy.get(".cocktail-card").should("contain.text", "Elderflower Caipirinha");
        cy.get(".cocktail-card").should("contain.text", "Casino Royale");
        cy.get(".cocktail-card").should("not.contain.text", "Paloma");
    });
    it("should show the error message when search has 0 results", function () {
        cy.get('[placeholder="Are you ready for it?"]').type("yolo");
        cy.wait(500);
        cy.get(".no-results-text")
            .should("be.visible")
            .and("contain.text", "0 results - No cocktails matching your search");
        cy.get(".cocktail-card").should("not.exist");
    });
});
