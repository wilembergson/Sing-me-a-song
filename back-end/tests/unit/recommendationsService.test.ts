import { faker } from "@faker-js/faker"
import { jest } from "@jest/globals"
import { Recommendation } from "@prisma/client"
import { prisma } from "../../src/database.js"

import { recommendationRepository }  from "../../src/repositories/recommendationRepository.js"
import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js"
import { notFoundError } from "../../src/utils/errorUtils.js"
import { listOfRecommendations, recommendationExemple } from "./factories/recommendationsFactory.js"

jest.mock("../../src/repositories/recommendationRepository")

beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(async () => {
    await prisma.$disconnect();
});
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
        const recommendation:Recommendation = await recommendationExemple()
        
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return recommendation
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

    /*it('Deve reduzir um ponto do score (>-5)', async () => {
        const recommendation:Recommendation = await recommendationExemple()
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => { return recommendation});
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {return recommendation});
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => { });

        await recommendationService.downvote(recommendation.id);
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
        expect(recommendationRepository.remove).not.toHaveBeenCalled();
    })*/
})

describe('Obter recomendações', () => {
    it('Obtem a lista com todas as recomendações', async () => {
        const recommendations =  await listOfRecommendations()
        jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => { return recommendations; });
        const result = await recommendationService.get();
        expect(recommendationRepository.findAll).toHaveBeenCalled();
        expect(result).toEqual(recommendations);
    })
})

describe('Obter recomendação por ID', () => {
    it('Obter recomendação com ID cadastrado', async () => {
        const recommendation = await recommendationExemple()
        jest.spyOn(recommendationRepository, "find").mockImplementation((): any => { return recommendation; })
        const result = await recommendationService.getById(recommendation.id)
        expect(recommendationRepository.find).toBeCalled()
        expect(result).toEqual(recommendation)
    })
    
    it('ID não reconhecido', async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementation((): any => { return null })
        const result = recommendationService.getById(faker.datatype.number())
        expect(result).rejects.toEqual(notFoundError())
    })
})
