import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";

export async function createRecommendation(){
  const recommendation = {
    name:faker.name.findName(),
    youtubeLink:"https://www.youtube.com/watch?v=-SIjTlOJUkI&ab_channel=TarcisiodoAcordeon"
  }
  return recommendation
}

export async function deleteAll(){
    await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE recommendations`
    ])
}