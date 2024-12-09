<template>
    <div>
        <input type="text" v-model="stationName" @input="getStationList" placeholder="駅名を入力">
        <div>
            <ul>
                <li v-if="isloading">loading...</li>
                <li v-for="station in stationList">{{ station.station_name }} </li>
            </ul>
        </div>
        <span :key="renderKey"></span>
    </div>
</template>

<script setup lang="ts">
const stationName = ref("")

const emit = defineEmits(['update:modelValue']);

const renderKey = ref(0);
const renderUpdate = () => {
    renderKey.value++;
}

const isloading = ref(false);
const loading = (bool:boolean) => {
    isloading.value = bool;
}

const stationList = ref();
const getStationList = async () => {
    loading(true);
    emit('update:modelValue', stationName.value);
    try {
        const stations = await useFetch(`/api/searchStation`, {
            method: 'get',
            params: { text: stationName.value }
        });
        if(stations.error.value) {
            throw new Error('[searchStation] API error');
        }
        stationList.value = stations.data.value;
    } catch (error) {
        console.log("error2");
    } finally {
        loading(false);
    }
}


</script>