import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// company データの取得
export default defineEventHandler(async (e) => {
    try {
        return await prisma.company.findMany();
    } catch (error) {
        return { error: 'Failed to feach companys' }
    }
})