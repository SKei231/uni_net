import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// station データの取得
export default defineEventHandler(async (e) => {
    try {
        const { text } = getQuery(e);
        if (!text || typeof text !== 'string') {
            return { error: 'Query parameter "text" is required and must be a string. this is ' + typeof text};
        }
        return await searchStations(text);
    } catch (error) {
        return { error: 'Failed to feach stations' }
    }
})

// 駅の検索
const searchStations = async (text: string) => {
    try {
        let stations = await prisma.station.findMany({
            where: {
                station_name: {
                    contains: text,
                }
            },
            distinct: ['station_name'],
            orderBy: {station_name: 'asc'}
        })
        stations.sort((a,b) => {
            if(a.station_name === text && b.station_name !== text) return -1;
            if(a.station_name !== text && b.station_name === text) return 1;
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