import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clear existing data first
    console.log('Clearing existing data...')
    await prisma.todo.deleteMany({})
    await prisma.user.deleteMany({})
    console.log('Data cleared!')

    const user1 = await prisma.user.create({
        data: {
            email: 'spro@gmail.com',
            password: '12345',
        }
    })
    console.log(`Created user with id: ${user1.id}`)

    const user2 = await prisma.user.create({
        data: {
            email: 'igor@gmail.com',
            password: '12345',
        }
    })
    console.log(`Created user with id: ${user2.id}`)

    const todoData = [
        {
            description: 'Learn TypeScript',
            isCompleted: false,
            userId: user1.id
        },
        {
            description: 'Learn React',
            isCompleted: false,
            userId: user1.id
        },
        {
            description: 'Learn Node.js',
            isCompleted: false,
            userId: user2.id
        },
        {
            description: 'Build a Todo App',
            isCompleted: false,
            userId: user2.id
        },
    ]

    for (const t of todoData) {
        const todo = await prisma.todo.create({
            data: t,
        })
        console.log(`Created todo with id: ${todo.id}`)
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
