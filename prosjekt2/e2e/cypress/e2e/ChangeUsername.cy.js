describe("Change of username", function () {
    beforeEach(function () {
        cy.window().then(function (win) {
            win.localStorage.setItem("username", "Testinge2e");
        });
        cy.visit("/user/Testinge2e");
    });
    it("checks that the username changes on user page and front page", function () {
        cy.get('[data-testid="EditIcon"]').click();
        cy.focused().clear().type("NewUserForTest");
        cy.get('[data-testid="EditIcon"]').click();
        cy.get("h4").should("contain.text", "NewUserForTest");
        cy.get("button").contains("Go back").click();
        cy.get(".welcome-text").should("contain.text", "Good to see you NewUserForTest");
        cy.visit("/user/NewUserForTest");
        cy.get('[data-testid="EditIcon"]').click();
        cy.focused().clear().type("Testinge2e");
        cy.get('[data-testid="EditIcon"]').click();
        cy.wait(1000);
    });
    it("checks that the username changes in url", function () {
        cy.get('[data-testid="EditIcon"]').click();
        cy.focused().clear().type("NewUserForTest");
        cy.get('[data-testid="EditIcon"]').click();
        cy.url().should("include", "/user/NewUserForTest");
        cy.get('[data-testid="EditIcon"]').click();
        cy.focused().clear().type("Testinge2e");
        cy.get('[data-testid="EditIcon"]').click();
        cy.wait(1000);
    });
    it("should show the error message when new username is already in use", function () {
        cy.get('[data-testid="EditIcon"]').click();
        cy.focused().clear().type("Julie");
        cy.get('[data-testid="EditIcon"]').click();
        cy.get(".MuiFormHelperText-root")
            .should("be.visible")
            .and("contain.text", "Username is already taken");
    });
});
