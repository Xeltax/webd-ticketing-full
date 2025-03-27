import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Création d'un compte administrateur
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.users.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'ROLE_ADMIN',
        },
    });

    console.log(`Admin created: ${adminUser.email}`);

    // Création de catégories d'événements
    const categories = await prisma.categories.createMany({
        data: [
            { name: 'Concert', color: '#f0d4a3' },
            { name: 'Sport', color: '#2d9fee' },
            { name: 'Conférence', color: '#85ee2d' },
            { name: 'Festival', color: '#ee532d' },
        ],
        skipDuplicates: true, // Ignore les doublons
    });

    console.log(`Categories created: ${categories.count}`);

    const getCategories = await prisma.categories.findMany();

    // Création d'événements
    const events = await prisma.events.createMany({
        data: [
            {
                name: 'Rock Festival',
                date: new Date(),
                location : "Nice",
                description : "Le plus grand festival de rock de l'année",
                bannerUrl : [
                    "https://media.timeout.com/images/105607062/image.jpg",
                    "https://i0.wp.com/www.ericcanto.com/wp-content/uploads/2021/02/Les-4-concerts-de-rock-qui-ont-marque-lhistoire.jpg"
                ],
                image : "https://www.touslesfestivals.com/caches/32518736dab18409a6ce2d77edb4c827fb4ec02f-1040x540-outbound.jpg",
                createdById : adminUser.id,
                categorieId: getCategories[getCategories.findIndex((categories) => categories.name === "Concert")].id
            },
            {
                name: 'Match de foot',
                date: new Date(),
                location : "Paris",
                description : "Le match de foot de l'année",
                bannerUrl : [
                    "https://media.sudouest.fr/16370884/1000x625/sudouest-photo-1-26664182-1600.jpg?v=1694101500",
                    "https://media.sudouest.fr/13043987/1200x600/twitch.jpg"
                ],
                image : "https://static.actu.fr/uploads/2023/05/match-quipe-de-france-de-foot-en-2024-villes.jpg",
                createdById : adminUser.id,
                categorieId: getCategories[getCategories.findIndex((categories) => categories.name === "Sport")].id
            },
            {
                name: 'Conférence sur le développement personnel',
                date: new Date(),
                location : "Paris",
                description : "Une conférence pour vous aider à vous épanouir",
                bannerUrl : [
                    "https://le-lodge.fr/conseil/wp-content/uploads/2021/11/salle-confe%CC%81rence--1128x484.jpg",
                    "https://www.evenement.com/wp-content/uploads/2019/09/samuel-pereira-uf2nnANWa8Q-unsplash-2.jpg"
                ],
                image : "https://icom.museum/wp-content/uploads/2024/07/FW9B3170.jpg",
                createdById : adminUser.id,
                categorieId: getCategories[getCategories.findIndex((categories) => categories.name === "Conférence")].id
            },
            {
                name: 'Festival de musique électronique',
                date: new Date(),
                location : "Caen",
                description : "Le festival de musique électronique de l'année",
                bannerUrl : [
                    "https://france3-regions.francetvinfo.fr/image/4lklhNy-4vETRepgCqITYLjAOQY/2560x1707/regions/2021/11/04/6183c3cb1b546_ambiance-10-5507007.jpg",
                    "https://www.touslesfestivals.com/uploads/3e20a0ed1e4cf85336c4a8b2b06ee61cbd40c347/de69cfd93d7259e0708933b32ab6c2feff96a826.png",
                    "https://www.ot-montsaintmichel.com/wp-content/uploads/2020/03/Copie-de-Ambiances_Sam_P2N_2019_%C2%A9David_Gallard-26.jpg"
                ],
                image : "https://papillonsdenuit.com/wp-content/uploads/2024/11/2023_page-0001.png",
                createdById : adminUser.id,
                categorieId: getCategories[getCategories.findIndex((categories) => categories.name === "Festival")].id
            }
        ],
        skipDuplicates: true,
    });

    const getEvents = await prisma.events.findMany();

    const createdTickets = await prisma.$transaction(async (prisma) => {
        const ticketsCreated = [];

        for (const event of getEvents) {
            const existingTickets = await prisma.tickets.findMany({
                where: { eventId: event.id }
            });

            if (existingTickets.length === 0) {
                const standardTicket = await prisma.tickets.create({
                    data: {
                        name: "Billet standard",
                        price: 50,
                        eventId: event.id
                    }
                });

                const vipTicket = await prisma.tickets.create({
                    data: {
                        name: "Billet VIP",
                        price: 100,
                        eventId: event.id
                    }
                });

                ticketsCreated.push(standardTicket, vipTicket);
            }
        }

        return ticketsCreated;
    });

    console.log(`${createdTickets.length} New tickets created`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
