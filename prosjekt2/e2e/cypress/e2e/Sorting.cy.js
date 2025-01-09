describe("Sorting functionality", function () {
    beforeEach("Set username and route from landing page to main page", function () {
        cy.window().then(function (win) {
            win.localStorage.setItem("username", "Testinge2e");
        });
        cy.visit("/");
        cy.contains("Get Started").click();
    });
    it("should show relevant cocktail when sorting from A to Z", function () {
        cy.contains("Rating High-Low").click();
        cy.contains("Name A-Z").click();
        cy.get(".cocktail-card").should("contain.text", "A. J.");
        cy.get(".cocktail-card").should("contain.text", "A1");
        cy.get(".cocktail-card").should("contain.text", "ABC");
        cy.get(".cocktail-card").should("contain.text", "ACID");
        cy.get(".cocktail-card").should("not.contain.text", "Zorro");
        cy.scrollTo("bottom");
        cy.get(".cocktail-card").should("contain.text", "Affinity");
        cy.get(".cocktail-card").should("contain.text", "Afterglow");
        cy.get(".cocktail-card").should("contain.text", "Alexander");
        cy.get(".cocktail-card").should("contain.text", "Algonquin");
        cy.get(".cocktail-card").should("not.contain.text", "Zombie");
    });
    it("should show relevant cocktail when sorting from Z to A", function () {
        cy.contains("Rating High-Low").click();
        cy.contains("Name Z-A").click();
        cy.get(".cocktail-card").should("contain.text", "Zorro");
        cy.get(".cocktail-card").should("contain.text", "Zorbatini");
        cy.get(".cocktail-card").should("contain.text", "Zombie");
        cy.get(".cocktail-card").should("contain.text", "Zoksel");
        cy.get(".cocktail-card").should("not.contain.text", "A. J.");
        cy.scrollTo("bottom");
        cy.get(".cocktail-card").should("contain.text", "Zambeer");
        cy.get(".cocktail-card").should("contain.text", "Yoghurt Cooler");
        cy.get(".cocktail-card").should("contain.text", "Yellow Bird");
        cy.get(".cocktail-card").should("contain.text", "Winter Rita");
        cy.get(".cocktail-card").should("not.contain.text", "ACID");
    });
    it("should show decreasing rating when sorting from high to low", function () {
        cy.contains("Rating High-Low").click();
        cy.get('[data-testid="card-0"]')
            .find('[data-testid="rating-number"]')
            .invoke("text")
            .then(function (rating0) {
            cy.get('[data-testid="card-1"]')
                .find('[data-testid="rating-number"]')
                .invoke("text")
                .then(function (rating1) {
                cy.get('[data-testid="card-2"]')
                    .find('[data-testid="rating-number"]')
                    .invoke("text")
                    .then(function (rating2) {
                    var r0 = parseFloat(rating0.replace(/[()]/g, ""));
                    var r1 = parseFloat(rating1.replace(/[()]/g, ""));
                    var r2 = parseFloat(rating2.replace(/[()]/g, ""));
                    expect(r0).to.be.at.least(r1);
                    expect(r1).to.be.at.least(r2);
                    expect(r0).to.be.at.least(r2);
                });
            });
        });
    });
    it("should show increasing rating when sorting from low to high", function () {
        cy.contains("Rating High-Low").click();
        cy.contains("Rating Low-High").click();
        cy.get('[data-testid="card-0"]')
            .find('[data-testid="rating-number"]')
            .invoke("text")
            .then(function (rating0) {
            cy.get('[data-testid="card-1"]')
                .find('[data-testid="rating-number"]')
                .invoke("text")
                .then(function (rating1) {
                cy.get('[data-testid="card-2"]')
                    .find('[data-testid="rating-number"]')
                    .invoke("text")
                    .then(function (rating2) {
                    var r0 = parseFloat(rating0.replace(/[()]/g, ""));
                    var r1 = parseFloat(rating1.replace(/[()]/g, ""));
                    var r2 = parseFloat(rating2.replace(/[()]/g, ""));
                    expect(r0).to.at.most(r1);
                    expect(r1).to.at.most(r2);
                    expect(r0).to.at.most(r2);
                });
            });
        });
    });
    it("should check that sorting works togheter with filtering", function () {
        //Sort on Low to High
        cy.contains("Rating High-Low").click();
        cy.contains("Rating Low-High").click();
        //Add filter
        cy.get("[data-testid=filtering-options]").click();
        cy.contains("Gin").click();
        cy.get("body").click(10, 10); // Click at the bacground to remove filter box
        cy.get('[data-testid="card-0"]')
            .find('[data-testid="rating-number"]')
            .invoke("text")
            .then(function (rating0) {
            cy.get('[data-testid="card-1"]')
                .find('[data-testid="rating-number"]')
                .invoke("text")
                .then(function (rating1) {
                cy.get('[data-testid="card-2"]')
                    .find('[data-testid="rating-number"]')
                    .invoke("text")
                    .then(function (rating2) {
                    var r0 = parseFloat(rating0.replace(/[()]/g, ""));
                    var r1 = parseFloat(rating1.replace(/[()]/g, ""));
                    var r2 = parseFloat(rating2.replace(/[()]/g, ""));
                    expect(r0).to.at.most(r1);
                    expect(r1).to.at.most(r2);
                    expect(r0).to.at.most(r2);
                });
            });
        });
        //Check that filter work
        cy.get('[data-testid="card-0"]').click();
        cy.get(".ingredients-card").should("contain.text", "Gin");
    });
    it("should check that sorting works togheter with search and filtering", function () {
        //Add search
        cy.get('[placeholder="Are you ready for it?"]').type("lemon");
        //Sort on Low to High
        cy.contains("Rating High-Low").click();
        cy.contains("Rating Low-High").click();
        //Add filter
        cy.get("[data-testid=filtering-options]").click();
        cy.contains("Vodka").click();
        cy.get("body").click(10, 10); // Click at the background to remove filter box
        //Check that rating work
        cy.get('[data-testid="card-0"]')
            .find('[data-testid="rating-number"]')
            .invoke("text")
            .then(function (rating0) {
            cy.get('[data-testid="card-1"]')
                .find('[data-testid="rating-number"]')
                .invoke("text")
                .then(function (rating1) {
                cy.get('[data-testid="card-2"]')
                    .find('[data-testid="rating-number"]')
                    .invoke("text")
                    .then(function (rating2) {
                    var r0 = parseFloat(rating0.replace(/[()]/g, ""));
                    var r1 = parseFloat(rating1.replace(/[()]/g, ""));
                    var r2 = parseFloat(rating2.replace(/[()]/g, ""));
                    expect(r0).to.at.most(r1);
                    expect(r1).to.at.most(r2);
                    expect(r0).to.at.most(r2);
                });
            });
        });
        //Check that filter and search work
        cy.get('[data-testid="card-0"]').click();
        cy.contains("Lemon").should("exist");
        cy.get(".cocktail-title-and-heart").should("contain.text", "Lemon");
        cy.get(".ingredients-card").should("contain.text", "Vodka");
        //Reset searchPrefix
        cy.window().then(function (win) {
            win.localStorage.setItem("searchPrefix", "");
        });
    });
});
