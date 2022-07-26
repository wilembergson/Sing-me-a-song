
const url = "http://localhost:3000";

describe("Recomendações", () => {
    it("Deve adicionar uma recomendação; deve aumentar um ponto e diminuir na sequencia", () => {

        const recommendation = {
            name: "Duro igual concreto3",
            youtubeUrl: "https://www.youtube.com/watch?v=vTKP99Kll5E&ab_channel=1KiloOficial"
        }
        cy.visit(url);
        cy.get("#new-name").type(recommendation.name);
        cy.get("#new-youtubeUrl").type(recommendation.youtubeUrl);
        cy.get("#new-createButton").click();
        cy.get("#upvote").click();
        cy.get("#downvote").click();
    });
});