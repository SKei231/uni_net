<template>
    <div>
        <p style="text-align: center;">出発駅</p>
        <StationList v-model="startStation"></StationList>
        <p style="text-align: center;">到着駅</p>
        <StationList v-model="endStation"></StationList>
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
        <div style="padding: 20px; text-align: right;">
            <btn @click="search" class="search-btn">search</btn>
        </div>
    </div>
</template>

<script setup lang="ts">

const startStation = ref();
const endStation = ref();
const errorMessage = ref("");

const emit = defineEmits(['searchPoints']);

// 検索ボタンの動作
const search = () => {
    try {
        errorMessage.value = "";
        if(startStation.value.station_g_cd && endStation.value.station_g_cd) {
            emit('searchPoints', {
                start: startStation.value.station_g_cd,
                end: endStation.value.station_g_cd
            })
        }else {
            setErrorMessage();
        }
    } catch (error) {
        setErrorMessage();
    }
}
const setErrorMessage = () => {
    errorMessage.value = "駅をリストから選択してください"
}
</script>

<style scoped>
.search-btn {
    cursor: pointer;
    color: white;
    padding: 5px 10px;
    background-color: rgba(0,0,0,.3);
    border-radius: 10px;
}
.search-btn:hover {
    background-color: rgba(0,0,0,.5);
}
</style>