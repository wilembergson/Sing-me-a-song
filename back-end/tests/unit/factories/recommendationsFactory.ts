import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";

export async function recommendationExemple(){
    const recommendation ={
        id:faker.datatype.number(),
        name: faker.music.songName(),
        youtubeLink: "https://www.youtube.com/watch?v=RF3NHe2dTIA&t=5s&ab_channel=Andr%C3%A9Pompeu",
        score: faker.datatype.number()
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