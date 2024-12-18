<template>
    <div style="height: 100vh; display: flex;">
        <div style="width: 25vw; height: 100vh; overflow-x: scroll; position: relative">
            <HeaderLayout @searchPoints="search"></HeaderLayout>
            <p v-if="isloading">Searching...</p>
          
            <div v-if="routes" class="routeBox">
              <ul style="list-style: none; padding: 0px 10px;">
                <li v-for="route in routes.route" :key="route.name">
                    <p style="text-align: right;">{{ route.line }}</p><p>{{ route.name }} 駅</p>
                </li>
              </ul>
            </div>
        </div>
        <Map ref="map" style="margin: auto;"></Map>
    </div>
</template>
  
<script setup lang="ts">
    import { ref } from 'vue';
    
    // 再レンダリング用
    const renderKey = ref(0);
    const renderUpdate = () => {
        renderKey.value++;
    };
    
    // ローディング
    const isloading = ref(false);
    const loading = (bool: boolean) => {
        isloading.value = bool;
    };
    
    // 経路データと地図の中心設定
    const routes = ref();
    const map = ref();
    
    // // 経路検索処理
    const search = async (stations: { start: number; end: number }) => {
        loading(true);
        try {
        const route = await useFetch('/api/searchRoute', {
            method: 'get',
            params: { start: stations.start, end: stations.end },
        });
    
        if (route.error.value) {
            throw new Error('[stationList] API error');
        }
    
        routes.value = route.data.value;

        map.value.setRoutes(routes.value.route);
        map.value.drawPolyline();
        } catch (error) {
        console.log('Error during route search:', error);
        } finally {
        loading(false);
        }
    };
</script>

<style>
.routeBox {
    height: 75vh;
}
</style>