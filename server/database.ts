import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * model challenges {
  id                            Int      @id @default(autoincrement())
  title                         String   @db.VarChar(255)
  category                      String   @db.VarChar(255)
  ctf_event                     String   @db.VarChar(255) 
  description                   String   @db.Text
  hints                         hints[]
  files                         files[]
  writeups                      writeups[]
  exposed                       Boolean  @default(true)
  flag                          String   @db.Text
  case_insensitive              Boolean  @default(true)
  points                        Int      
  solves                        Int      @db.UnsignedInt @default(0)
  min_seconds_btwn_submissions  Int      @db.UnsignedSmallInt @default(5)
}

model hints {
  id                 Int             @id @default(autoincrement())
  challenge          challenges      @relation(fields: [challengeId], references: [id])
  challengeId        Int
  visible            Boolean         @default(true)
  body               String          @db.Text
}

model files {
  id                 Int             @id @default(autoincrement())
  challenge          challenges      @relation(fields: [challengeId], references: [id])
  challengeId        Int
  url                String          @db.Text
}
 */

export function getAllChallenges() {
    return prisma.challenges.findMany({
        orderBy: {
            _relevance: {
                category: 'asc',
                points: 'asc',
                title: 'asc',
            },
        },
        where: {
            exposed: true,
        },
        select: {
            id: true,
            title: true,
            description: true,
            hints: {
                where: {
                    visible: true,
                },
                orderBy: {
                    id: 'asc',
                },
                select: {
                    body: true,
                },
            },
            files: {
                orderBy: {
                    id: 'asc',
                },
                select: {
                    url: true,
                },
            },
            points: true,
            solves: true,
        }, 
    }); 
}

export function getChallengeByCategory(categorySelected: string) {
    return prisma.challenges.findMany({
        orderBy: {
            _relevance: {
                points: 'asc',
                title: 'asc',
            },
        },
        where: {
            category: categorySelected,
        },
        select: {
            id: true,
            title: true,
            description: true,
            hints: {
                where: {
                    visible: true,
                },
                orderBy: {
                    id: 'asc',
                },
                select: {
                    body: true,
                },
            },
            files: {
                orderBy: {
                    id: 'asc',
                },
                select: {
                    url: true,
                },
            },
            points: true,
            solves: true,
        }, 
    }); 
}




