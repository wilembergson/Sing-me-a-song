import { faker } from "@faker-js/faker"
import { jest } from "@jest/globals"

import { recommendationRepository }  from "../../src/repositories/recommendationRepository.js"
import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js"

jest.mock("../../src/repositories/recommendationRepository")

describe("Inserção de recomendação", () => {
    it("Insere uma nova recomendação", async () => {
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(():any =>{})
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any =>{})

        await recommendationService.insert({
            name: faker.fake.name,
            youtubeLink: "https://www.youtube.com/watch?v=RF3NHe2dTIA&t=5s&ab_channel=Andr%C3%A9Pompeu"
        })
        expect(recommendationRepository.findByName).toBeCalled()
    })

    it("Não insere recomendação com nome já cadastrado", async () => {
        const recommendation: CreateRecommendationData = {
            name: faker.fake.name,
            youtubeLink: "https://www.youtube.com/watch?v=RF3NHe2dTIA&t=5s&ab_channel=Andr%C3%A9Pompeu"
        }
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => {
            return {
                name: recommendation.name,
                youtubeLink: recommendation.youtubeLink
            }
        })
        const promise = recommendationService.insert(recommendation)
        expect(promise).rejects.toEqual({message:"Recommendations names must be unique", type:"conflict"})
    })
})

describe("Modificar o score", () => {
    it("Aumenta o score", async () => {
        const recommendation = {
            id:faker.datatype.number(),
            name: faker.fake.name,
            youtubeLink: "https://www.youtube.com/watch?v=RF3NHe2dTIA&t=5s&ab_channel=Andr%C3%A9Pompeu",
            score: faker.datatype.number()
        }
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return{
                id: recommendation.id,
                name: recommendation.name,
                youtubeLink: recommendation.youtubeLink,
                score: recommendation.score
            }
        })
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {})
        const promise = await recommendationService.upvote(recommendation.id)
        expect(recommendationRepository.find).toBeCalled()
        expect(recommendationRepository.updateScore).toBeCalled()
    })

    it("Não Aumenta o score", async () => {
        const id = faker.datatype.number()
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return null
        })
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {})
        const promise = recommendationService.upvote(id)
        expect(promise).rejects.toEqual({message:"", type:"not_found"})
        expect(recommendationRepository.find).toBeCalled()
    })

    /*it("diminue o score", async () => {
        const recommendation = {
            id:faker.datatype.number(),
            name: faker.fake.name,
            youtubeLink: "https://www.youtube.com/watch?v=RF3NHe2dTIA&t=5s&ab_channel=Andr%C3%A9Pompeu",
            score: faker.datatype.number()
        }
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return{
                id: recommendation.id,
                name: recommendation.name,
                youtubeLink: recommendation.youtubeLink,
                score: recommendation.score
            }
        })
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {})
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(():any => {})
        const promise = await recommendationService.downvote(recommendation.id)
        expect(recommendationRepository.find).toBeCalled()
        expect(recommendationRepository.updateScore).toBeCalled()
        expect(recommendation.score).toBeGreaterThan(-5)
    })*/
})
