// station_g_cd を基にグループされている駅の一覧を返す

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type StationData = {
    name: string,
    g_cd: number,
    lon: number,
    lat: number,
    lines: number[]
}
const allStation:StationData[] = []
const initAllStation = async () => {
    allStation.length = 0;
    const stationList = await prisma.station.findMany({
        select: {
            station_cd: true,
            station_g_cd: true,
            station_name: true,
            line_cd: true,
            lon: true,
            lat: true
        }
    });
    stationList.forEach(async (station) => {
        let pushed = false
        for(let i = 0; i < allStation.length; i++) {
            if(allStation[i].g_cd == station.station_g_cd) {
                pushed = true;
            }
        }
        if(!pushed) {
            allStation.push(await setStationData(station.station_g_cd));
        }
    })
}
initAllStation();

type LineData = {
    name: string,
    stations: number[]
}
const allLine:LineData[] = []
const initAllLine = async () => {
    allLine.length = 0;
    const lineList = await prisma.line.findMany({
        select: {
            line_cd: true,
            line_name: true
        }
    });
    lineList.forEach(async (line) => {
        const linedStationList = await prisma.station.findMany({
            where: {
                line_cd: {
                    equals: line.line_cd
                }
            },
            select: {
                station_g_cd: true
            }
        })
        allLine.push({name: line.line_name, stations: linedStationList.map((x) => {return x.station_g_cd})})
    })
}
initAllLine();

// 経路探索
export default defineEventHandler(async (e) => {
    try {
        const stations = getQuery(e);
        const station = {
            start: Number(stations.start),
            end: Number(stations.end)
        }
        if (!station.start || typeof station.start !== 'number') {
            return { error: 'Query parameter "start" is required and must be a number. ' + station.start  +' is ' + typeof station.start};
        }
        if (!station.end || typeof station.end !== 'number') {
            return { error: 'Query parameter "end" is required and must be a number. ' + station.end  +' is ' + typeof station.end};
        }
        const returnRoute = await searchRoute(station.start, station.end);
        return returnRoute;
    } catch (error) {
        return { error: 'Failed to feach route' }
    }
})

// 出発駅から到着駅までの経路を探索
const searchRoute = async (start: number, end: number) => {
    try {
        const graph = createGraphWithTransfers(allStation, allLine);
        const result = findRouteWithAStar(graph, allStation, allLine, start, end);

        if (!result) {
            return { error: "No route found between the specified stations." };
        }

        const { route, usedLines } = result;

        return {
            route: route.map((g_cd, index) => {
                const station = allStation.find((station) => station.g_cd === g_cd);
                const line = usedLines[index - 1];
                return station
                    ? {
                          name: station.name,
                          g_cd: station.g_cd,
                          lat: station.lat,
                          lon: station.lon,
                          line: line ? line.name : null,
                      }
                    : null;
            }),
        };
    } catch (error) {
        return { error: error };
    }
}

// 緯度・経度による距離の計算
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const R = 6371; // 地球の半径 (km)

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

// A*アルゴリズムによる経路探索
const findRouteWithAStar = (
    graph: Record<number, { neighbors: number[]; lines: number[] }>,
    stations: StationData[],
    lines: LineData[],
    start: number,
    end: number
): { route: number[]; usedLines: LineData[] } | null => {
    if (!graph[start] || !graph[end]) {
        throw new Error("Start or end station not found in the graph");
    }

    const openSet: { station: number; path: number[]; linePath: number[]; cost: number }[] = [
        { station: start, path: [start], linePath: [], cost: 0 },
    ];
    const visited = new Set<number>();

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.cost - b.cost);
        const { station, path, linePath } = openSet.shift()!;

        if (station === end) {
            // 完了した経路と使用した路線を返す
            return {
                route: path,
                usedLines: linePath.map((lineCd) => lines.find((line) => line.stations.includes(lineCd))!),
            };
        }

        visited.add(station);

        // 乗換のコストを考慮
        for (let i = 0; i < graph[station].neighbors.length; i++) {
            const neighbor = graph[station].neighbors[i];
            const line = graph[station].lines[i];

            if (!visited.has(neighbor)) {
                const neighborStation = stations.find((s) => s.g_cd === neighbor)!;
                const gCost = path.length; // 移動コスト (乗り換え回数ベース)
                const hCost = calculateDistance(
                    neighborStation.lat,
                    neighborStation.lon,
                    stations.find((s) => s.g_cd === end)!.lat,
                    stations.find((s) => s.g_cd === end)!.lon
                ); // 推定コスト (直線距離ベース)
                const totalCost = gCost + hCost;

                openSet.push({
                    station: neighbor,
                    path: [...path, neighbor],
                    linePath: [...linePath, line],
                    cost: totalCost,
                });
            }
        }
    }

    return null; // 経路が見つからなかった場合
};

// グラフ構築 (路線接続を考慮)
const createGraphWithTransfers = (
    stations: StationData[],
    lines: LineData[]
): Record<number, { neighbors: number[]; lines: number[] }> => {
    const graph: Record<number, { neighbors: number[]; lines: number[] }> = {};

    // 各駅の初期化
    stations.forEach((station) => {
        graph[station.g_cd] = { neighbors: [], lines: [] };
    });

    // 路線情報に基づく隣接駅の設定
    lines.forEach((line) => {
        line.stations.forEach((station, index) => {
            if (index > 0) {
                graph[line.stations[index]].neighbors.push(line.stations[index - 1]);
                graph[line.stations[index]].lines.push(line.stations[index]);
            }
            if (index < line.stations.length - 1) {
                graph[line.stations[index]].neighbors.push(line.stations[index + 1]);
                graph[line.stations[index]].lines.push(line.stations[index]);
            }
        });
    });

    return graph;
};

// 出発駅、到着駅データのセット
const setStationData = async (g_cd:number) => {
    const station = await getStationByGCD(g_cd);
    let data:StationData = {
        name: station[0].station_name,
        g_cd: Number(station[0].station_g_cd),
        lon: Number(station[0].lon),
        lat: Number(station[0].lat),
        lines: [Number(station[0].line_cd)]
    }
    data.lines.length = 0;
    station.map((x) => data.lines.push(Number(x.line_cd)));
    return data;
}

// 駅グループコードから乗換可能な駅すべてを検索
const getStationByGCD = async (g_cd: number) => {
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
}