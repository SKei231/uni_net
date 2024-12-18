import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// station データの取得
export default defineEventHandler(async (e) => {
    try {
        const { station_name } = getQuery(e);
        if (!station_name || typeof station_name !== 'string') {
            return null;
        }
        return await searchStations(station_name);
    } catch (error) {
        return { error: 'Failed to feach stations' }
    }
})

// 駅の検索
const searchStations = async (station_name: string) => {
    try {
        let stations = await prisma.station.findMany({
            where: {
                station_name: {
                    contains: station_name,
                }
            },
            select: {
                station_name: true,
                station_g_cd: true,
                pref_cd: true
            },
            distinct: ['station_g_cd'],
            orderBy: {station_name: 'asc'}
        })
        stations.sort((a,b) => {
            if(a.station_name === station_name && b.station_name !== station_name) return -1;
            if(a.station_name !== station_name && b.station_name === station_name) return 1;
            return 0;
        })
        if(stations.length > 10) {
            stations.length = 10;
        }
        return stations;
    } catch (error) {
        throw Error;
    }
}