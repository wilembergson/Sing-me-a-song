import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";

export async function recommendationExemple(){
    const recommendation ={
        id:faker.datatype.number(),
        name: faker.music.songName(),
        youtubeLink: "https://www.youtube.com/watch?v=RF3NHe2dTIA&t=5s&ab_channel=Andr%C3%A9Pompeu",
        score: faker.datatype.number({ min: -10, max: 20, precision: 1 })
    }
    return recommendation
}

export async function listOfRecommendations(){
    const list:Recommendation[] = []
    for(let i=0; i<15; i++){
        const recommendation = await recommendationExemple()
        list.push(recommendation)
    }
    return list
}

export async function listWithScoreGreaterThan10(){
    const list:Recommendation[] = []
    for(let i=0; i<15; i++){
        const recommendation = {
            id:faker.datatype.number(),
            name: faker.music.songName(),
            youtubeLink: "https://www.youtube.com/watch?v=RF3NHe2dTIA&t=5s&ab_channel=Andr%C3%A9Pompeu",
            score: faker.datatype.number({ min: 11, max: 25, precision: 1 })
        }
        list.push(recommendation)
    }
    return list
}
export async function listWithScoreBetweenNegative5And10(){
    const list:Recommendation[] = []
    for(let i=0; i<15; i++){
        const recommendation = {
            id:faker.datatype.number(),
            name: faker.music.songName(),
            youtubeLink: "https://www.youtube.com/watch?v=RF3NHe2dTIA&t=5s&ab_channel=Andr%C3%A9Pompeu",
            score: faker.datatype.number({ min: -5, max: 10, precision: 1 })
        }
        list.push(recommendation)
    }
    return list
}