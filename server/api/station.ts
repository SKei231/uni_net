import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// station データの取得
export default defineEventHandler(async (e) => {
    try {
        return await prisma.station.findMany();
    } catch (error) {
        return { error: 'Failed to feach companys' }
    }
})