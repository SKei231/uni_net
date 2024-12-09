<template>
    <HeaderLayout @searchPoints="search"></HeaderLayout>
    <span :key="renderKey"></span>
</template>

<script setup lang="ts">
const renderKey = ref(0);
const isloading = ref(false);

const renderUpdate = () => {
    renderKey.value++;
}

const loading = (bool:boolean) => {
    if(bool) {
        isloading.value = true;
        console.log("loading");
    }else {
        isloading.value = false;
        console.log("loaded");
    }
    renderUpdate();
}

const search = (stations:{start:string, end:string}) => {
    console.log(stations);
}
</script>