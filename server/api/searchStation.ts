// station_g_cd を基にグループされている駅の一覧を返す

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// station データの取得
export default defineEventHandler(async (e) => {
    try {
        const { station_g_cd } = getQuery(e);
        const g_cd = Number(station_g_cd);
        if (!g_cd || typeof g_cd !== 'number') {
            return { error: 'Query parameter "station_g_cd" is required and must be a number. ' + g_cd  +' is ' + typeof g_cd};
        }
        return await prisma.station.findMany({
            where: {
                station_g_cd: {
                    equals: g_cd,
                }
            },
            select: {
                station_cd: true,
                station_g_cd: true,
                station_name: true,
                line_cd: true,
                lon: true,
                lat: true
            }
        });
    } catch (error) {
        return { error: 'Failed to feach station by g_cd' }
    }
})