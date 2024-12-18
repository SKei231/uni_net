<template>
    <LMap
        style="height: 100%;"
        :zoom="10"
        :center="center"
        :use-global-leaflet="false"
    >
    <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
    />
    <LPolyline
        :lat-lngs="path"
        color="red"
    />
    </LMap>
</template>

<script setup lang="ts">
import { LMap, LTileLayer, LPolyline } from '@vue-leaflet/vue-leaflet';
import type { LatLngTuple, PointExpression } from 'leaflet';

const routes = ref<{
    name: string,
    g_cd: string,
    lat: string,
    lon: string,
    line: string,
}[]>()
const setRoutes = (route:{
    name: string,
    g_cd: string,
    lat: string,
    lon: string,
    line: string,
}[]) => {
    routes.value = route;
}

const center = ref<PointExpression>([35.680959106959, 139.76730676352]);
const path = ref<LatLngTuple[]>([])

// ポリラインの描画処理
const drawPolyline = () => {
    try {
        const midPointIndex = Math.floor(routes.value!.length / 2);
        center.value = [Number(routes.value![midPointIndex].lat),Number(routes.value![midPointIndex].lon)];
        path.value = routes.value!.map((point: {
            name: string;
            g_cd: string;
            lat: string;
            lon: string;
            line: string;
        }) => ([Number(point.lat), Number(point.lon)]));
    } catch (error) {
        console.log('Error in drawPolyline:', error);
    }
};
defineExpose({
    drawPolyline, setRoutes
});
</script>