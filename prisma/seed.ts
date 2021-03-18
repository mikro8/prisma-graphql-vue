import { PrismaClient, Prisma, Person } from '@prisma/client'
import fetch from 'node-fetch'

const ammountToGenerate = 100 /* change this to specify how much persons to generate */

const prisma = new PrismaClient()
function randomIndex(length: number): number {
  return Math.floor(Math.random() * length)
}
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
}

;(async () => {
  // fetch random names from api
  const Males = await (
    await fetch('https://www.randomlists.com/data/names-male.json')
  ).json()
  const Females = await (
    await fetch('https://www.randomlists.com/data/names-female.json')
  ).json()
  const Surnames = await (
    await fetch('https://www.randomlists.com/data/names-surnames.json')
  ).json()
  // make it somewhat real-world data ( yes I know it's pseudo random :} )

  // initialize array filled with empty objects ( for Array.map to trigger ), then map random person data
  const Persons = new Array(ammountToGenerate).fill({}).map(() => {

    const femaleToMaleRatio = 0.495
    const isMale = Math.random() > femaleToMaleRatio
    const FirstNames = isMale ? Males : Females

    const randomFirstName: string =
      FirstNames.data[randomIndex(FirstNames.data.length)]

    const randomLastName: string =
      Surnames.data[randomIndex(Surnames.data.length)]

    const emplDate = randomDate(new Date(2012, 0, 1), new Date())

    const person = {
      firstname: randomFirstName,
      lastname: randomLastName,
      employmentDate: emplDate,
      gender: isMale ? 'Male' : 'Female',
    }
    return person
  })

  // crate input and seed database
  const listOfPersons: Prisma.PersonCreateInput[] = Persons

  for (const obj of listOfPersons) {
    try {
      const object = await prisma.person.create({ data: obj })
      console.log(
        `added ${object.gender} ${object.firstname} ${object.lastname} with id ${object.id}`,
      )
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }

  return 1
})().finally(() => {
  prisma.$disconnect()
})
