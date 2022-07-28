import { faker } from "@faker-js/faker"
import supertest from "supertest"

import app from "../src/app.js"
import { createRecommendation, createRecommendationWithoutLink, createRecommendationWithoutName, createRecommendationWithoutYoutubeLink, deleteAll, findById, getExistingRecommendation, lessFiveRecomendation } from "./factories/recommendationFactory.js"
const agent = supertest(app)
describe("POST /recommendations", () => {
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

describe("POST /recommendations/:id/upvote", () => {
    beforeEach(async ()=>{
        await deleteAll()
    })
    it("Adiciona ponto a recomendação - deve retornar 200", async () => {
        const recommendation = await getExistingRecommendation()
        const id = recommendation.id
        const response = await agent.post(`/recommendations/${id}/upvote`);
        expect(response.status).toBe(200);
    });
    it("Não encontra recomendação com o ID informado - deve retornar 404", async () => {
        const id = faker.datatype.number()
        const response = await agent.post(`/recommendations/${id}/upvote`);
        expect(response.status).toBe(404);
    });
})

describe("POST /recommendations/:id/downvote", () => {
    beforeEach(async ()=>{
        await deleteAll()
    })
    it("Subtrai ponto da recomendação - deve retornar 200", async () => {
        const recommendation = await getExistingRecommendation()
        const id = recommendation.id
        const response = await agent.post(`/recommendations/${id}/downvote`);
        expect(response.status).toBe(200);
    });
    it("Não encontra recomendação com o ID informado - deve retornar 404", async () => {
        const id = faker.datatype.number()
        const response = await agent.post(`/recommendations/${id}/upvote`);
        expect(response.status).toBe(404);
    });
    it("Deleta a recomendação que tiver pontuação abaixo de (-5) - deve retornar 200", async () => {
        const id = await lessFiveRecomendation()
        const response = await agent.post(`/recommendations/${id}/downvote`);
        const recommendation = await findById(id)
        expect(recommendation).toBeNull()
        expect(response.status).toBe(200);
    });
})