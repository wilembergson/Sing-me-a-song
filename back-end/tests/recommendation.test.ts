import supertest from "supertest"

import app from "../src/app.js"
import { createRecommendation, createRecommendationWithoutLink, createRecommendationWithoutName, createRecommendationWithoutYoutubeLink, deleteAll } from "./factories/recommendationFactory.js"
const agent = supertest(app)
describe("POST /", () => {
    beforeEach(async ()=>{
        await deleteAll()
    })
    it("Nova recomendação criada - deve retornar 201", async () => {
        const recommendation = await createRecommendation()
        const response = await agent.post('/recommendations').send(recommendation);
        expect(response.status).toBe(201);
    });
    it("Recomendação já criada com o mesmo nome - deve retornar 409", async () => {
        const recommendation = await createRecommendation()
        await supertest.agent(app).post('/recommendations').send(recommendation);
        const response = await agent.post('/recommendations').send(recommendation);
        expect(response.status).toBe(409);
    });
    it("Recomendação não enviada - deve retornar 422", async () => {
        const recommendation = undefined
        const response = await agent.post('/recommendations').send(recommendation);
        expect(response.status).toBe(422);
    });
    it("Recomendação enviada sem o nome - deve retornar 422", async () => {
        const recommendation = await createRecommendationWithoutName()
        const response = await agent.post('/recommendations').send(recommendation);
        expect(response.status).toBe(422);
    });
    it("Recomendação enviada sem o link - deve retornar 422", async () => {
        const recommendation = await createRecommendationWithoutLink()
        const response = await agent.post('/recommendations').send(recommendation);
        expect(response.status).toBe(422);
    });
    it("Recomendação enviada sem o link do youtube válido - deve retornar 422", async () => {
        const recommendation = await createRecommendationWithoutYoutubeLink()
        const response = await agent.post('/recommendations').send(recommendation);
        expect(response.status).toBe(422);
    });
})