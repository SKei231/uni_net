<template>
    <div>
        <p>出発駅</p>
        <StationList v-model="startStation"></StationList>
        <p>到着駅</p>
        <StationList v-model="endStation"></StationList>
        <div @click="search">btn</div>
    </div>
</template>

<script setup lang="ts">
const startStation = ref();
const endStation = ref();

const emit = defineEmits(['searchPoints']);
const search = () => {
    console.log(startStation.value + "|" + endStation.value)
    emit('searchPoints', {
        start: startStation.value,
        end: endStation.value
    })
}
</script>