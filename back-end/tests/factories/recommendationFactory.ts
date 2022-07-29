import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";

export async function createRecommendation(){
  const recommendation = {
    name:faker.name.findName(),
    youtubeLink:"https://www.youtube.com/watch?v=-SIjTlOJUkI&ab_channel=TarcisiodoAcordeon"
  }
  return recommendation
}

export async function createDataRecommendation(){
  const data = await prisma.recommendation.create({
    data: {
      name:faker.name.findName(),
      youtubeLink:"https://www.youtube.com/watch?v=-SIjTlOJUkI&ab_channel=TarcisiodoAcordeon"
    }
  });
  return data
}

export async function create10Recommendations(){
  for(let i=0; i<10; i++){
    await createDataRecommendation()
  }
}

export async function orderedRecommendations(){
  await create10Recommendations()
  const recommendations = await prisma.recommendation.findMany()
  recommendations.sort((a,b)=> b.score - a.score)
  console.log(recommendations)
  return recommendations
}

export async function createRecommendationWithoutLink(){
  const recommendation = {
    name:faker.name.findName()
  }
  return recommendation
}

export async function createRecommendationWithoutYoutubeLink(){
  const recommendation = {
    name:faker.name.findName(),
    youtubeLink: faker.internet.url()
  }
  return recommendation
}
export async function createRecommendationWithoutName(){
  const recommendation = {
    youtubeLink:"https://www.youtube.com/watch?v=-SIjTlOJUkI&ab_channel=TarcisiodoAcordeon"
  }
  return recommendation
}
export async function deleteAll(){
    await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE recommendations`
    ])
}

export async function getExistingRecommendation(){
  const recommendation = await createDataRecommendation()
  return recommendation
}

export async function lessFiveRecomendation(){
  const recommendation = await createDataRecommendation()
  await prisma.recommendation.update({
    where: { 
      id:recommendation.id
     },
    data: {
      score: -5,
    },
  });
  return recommendation.id
}

export async function findById(id:number){
  const result = await prisma.recommendation.findFirst({
    where:{
      id
    }
  })
  return result
}