import supertest from "supertest"

import app from "../src/app.js"
import { createRecommendation, deleteAll } from "./factories/recommendationFactory.js"
const agent = supertest(app)
describe("POST /", () => {
    beforeAll(async ()=>{
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
})