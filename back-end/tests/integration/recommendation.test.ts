import { faker } from "@faker-js/faker"
import supertest from "supertest"

import app from "../../src/app.js"
import { create10Recommendations, createDataRecommendation, createRecommendation, createRecommendationWithoutLink, createRecommendationWithoutName, createRecommendationWithoutYoutubeLink, deleteAll, findById, getExistingRecommendation, lessFiveRecomendation, orderedRecommendations } from "./factories/recommendationFactory.js"

const agent = supertest(app)

describe("/recommendations", () => {
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
    it("Retorna lista das ultimas 10 recomendações - deve retornar 200", async () => {
        await create10Recommendations()
        const response = await agent.get('/recommendations')
        const list = response.body
        expect(list.length).toBe(10)
        expect(list[0]).toHaveProperty('id')
        expect(list[0]).toHaveProperty('name')
        expect(list[0]).toHaveProperty('youtubeLink')
        expect(list[0]).toHaveProperty('score')
        expect(response.status).toBe(200);
    });
})

describe("GET /recommendations/:id", () => {
    beforeEach(async ()=>{
        await deleteAll()
    })
    it("Retorna a recomendação referente ao ID informado - deve retornar 200", async () => {
        const recommendation = await createDataRecommendation()
        const id = recommendation.id
        const response = await agent.get(`/recommendations/${id}`)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('youtubeLink')
        expect(response.body).toHaveProperty('score')
        expect(response.status).toBe(200);
    });
    it("Retorna status 404 ao não encontrar recomendação referente ao ID informado - deve retornar 404", async () => {
        const id = faker.datatype.number()
        const response = await agent.get(`/recommendations/${id}`)
        expect(response.status).toBe(404);
    });
})

describe("GET /recommendations/random", () => {
    beforeEach(async ()=>{
        await deleteAll()
    })
    it("Retorna recomendação aleatória - deve retornar 200", async () => {
        await create10Recommendations()
        const response = await agent.get(`/recommendations/random`)
        expect(response.body).toHaveProperty("id")
        expect(response.status).toBe(200);
    });
    it("Retorna status 404 ao não encontrar nenhuma recomendação cadastrada - deve retornar 404", async () => {
        const response = await agent.get(`/recommendations/random`)
        expect(response.status).toBe(404);
    });
})

describe("GET /recommendations/top/:amount", () => {
    beforeEach(async ()=>{
        await deleteAll()
    })
    it("Retorna as recomendações por ordem de crescente de score - deve retornar 200", async () => {
        const recommendations = await orderedRecommendations()
        const response = await agent.get(`/recommendations/top/${recommendations.length}`)
        expect(response.body).toHaveProperty("length")
        expect(response.body[0]).toHaveProperty('id')
        expect(response.body[0]).toHaveProperty('name')
        expect(response.body[0]).toHaveProperty('youtubeLink')
        expect(response.body[0]).toHaveProperty('score')
        expect(response.status).toBe(200);
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