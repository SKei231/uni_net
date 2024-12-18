<template>
    <div style="text-align: center;">
        <input type="text" v-model="stationName.station_name" @input="getStationList" placeholder="駅名を入力" :class="inputFieldClass">
        <div class="stationList">
            <p v-if="isloading">loading...</p>
            <p v-if="stationList">駅を選択してください</p>
            <ul v-if="stationList">
                <li v-for="station in stationList" @click="setStationGCD(station.station_name, station.station_g_cd)">{{ station.station_name }} | {{ getPref(station.pref_cd) }}</li>
            </ul>
        </div>
        <span :key="renderKey"></span>
    </div>
</template>

<script setup lang="ts">
const stationName = ref({
    station_name: "",
    station_g_cd: 0
})

const emit = defineEmits(['update:modelValue']);

const renderKey = ref(0);
const renderUpdate = () => {
    renderKey.value++;
}

const isloading = ref(false);
const loading = (bool:boolean) => {
    isloading.value = bool;
}

// input タグの着色
const inputFieldClass = ref("inputField");
const toggleIPClass = (type: boolean) => {
    if(type) {
        inputFieldClass.value = "inputField cdReady";
    }else {
        inputFieldClass.value = "inputField";
    }
}

const stationList = ref();
const getStationList = async () => {
    loading(true);
    stationName.value.station_g_cd = 0;
    toggleIPClass(false);
    emit('update:modelValue', stationName.value);
    try {
        const stations = await useFetch(`/api/stationList`, {
            method: 'get',
            params: { station_name: stationName.value.station_name }
        });
        if(stations.error.value) {
            throw new Error('[stationList] API error');
        }
        stationList.value = null;
        stationList.value = stations.data.value;
    } catch (error) {
        console.log("error2");
    } finally {
        loading(false);
    }
}

// 都道府県リスト
const prefJSON = [
    {
        "pref_cd": "1",
        "pref_name": "北海道"
    },
    {
        "pref_cd": "2",
        "pref_name": "青森県"
    },
    {
        "pref_cd": "3",
        "pref_name": "岩手県"
    },
    {
        "pref_cd": "4",
        "pref_name": "宮城県"
    },
    {
        "pref_cd": "5",
        "pref_name": "秋田県"
    },
    {
        "pref_cd": "6",
        "pref_name": "山形県"
    },
    {
        "pref_cd": "7",
        "pref_name": "福島県"
    },
    {
        "pref_cd": "8",
        "pref_name": "茨城県"
    },
    {
        "pref_cd": "9",
        "pref_name": "栃木県"
    },
    {
        "pref_cd": "10",
        "pref_name": "群馬県"
    },
    {
        "pref_cd": "11",
        "pref_name": "埼玉県"
    },
    {
        "pref_cd": "12",
        "pref_name": "千葉県"
    },
    {
        "pref_cd": "13",
        "pref_name": "東京都"
    },
    {
        "pref_cd": "14",
        "pref_name": "神奈川県"
    },
    {
        "pref_cd": "15",
        "pref_name": "新潟県"
    },
    {
        "pref_cd": "16",
        "pref_name": "富山県"
    },
    {
        "pref_cd": "17",
        "pref_name": "石川県"
    },
    {
        "pref_cd": "18",
        "pref_name": "福井県"
    },
    {
        "pref_cd": "19",
        "pref_name": "山梨県"
    },
    {
        "pref_cd": "20",
        "pref_name": "長野県"
    },
    {
        "pref_cd": "21",
        "pref_name": "岐阜県"
    },
    {
        "pref_cd": "22",
        "pref_name": "静岡県"
    },
    {
        "pref_cd": "23",
        "pref_name": "愛知県"
    },
    {
        "pref_cd": "24",
        "pref_name": "三重県"
    },
    {
        "pref_cd": "25",
        "pref_name": "滋賀県"
    },
    {
        "pref_cd": "26",
        "pref_name": "京都府"
    },
    {
        "pref_cd": "27",
        "pref_name": "大阪府"
    },
    {
        "pref_cd": "28",
        "pref_name": "兵庫県"
    },
    {
        "pref_cd": "29",
        "pref_name": "奈良県"
    },
    {
        "pref_cd": "30",
        "pref_name": "和歌山県"
    },
    {
        "pref_cd": "31",
        "pref_name": "鳥取県"
    },
    {
        "pref_cd": "32",
        "pref_name": "島根県"
    },
    {
        "pref_cd": "33",
        "pref_name": "岡山県"
    },
    {
        "pref_cd": "34",
        "pref_name": "広島県"
    },
    {
        "pref_cd": "35",
        "pref_name": "山口県"
    },
    {
        "pref_cd": "36",
        "pref_name": "徳島県"
    },
    {
        "pref_cd": "37",
        "pref_name": "香川県"
    },
    {
        "pref_cd": "38",
        "pref_name": "愛媛県"
    },
    {
        "pref_cd": "39",
        "pref_name": "高知県"
    },
    {
        "pref_cd": "40",
        "pref_name": "福岡県"
    },
    {
        "pref_cd": "41",
        "pref_name": "佐賀県"
    },
    {
        "pref_cd": "42",
        "pref_name": "長崎県"
    },
    {
        "pref_cd": "43",
        "pref_name": "熊本県"
    },
    {
        "pref_cd": "44",
        "pref_name": "大分県"
    },
    {
        "pref_cd": "45",
        "pref_name": "宮崎県"
    },
    {
        "pref_cd": "46",
        "pref_name": "鹿児島県"
    },
    {
        "pref_cd": "47",
        "pref_name": "沖縄県"
    },
    {
        "pref_cd": "99",
        "pref_name": "その他"
    }
];
// 都道府県の参照
const getPref = (cd: number) => {
    if(cd > 0 && cd < 48) {
        return prefJSON[cd - 1].pref_name
    }else if(cd == 99) {
        return "その他"
    }
    return null;
}

/**
 * 選択した内容を station.value へ代入
 * @param name station_name
 * @param g_cd station_g_cd
 */
const setStationGCD = (name: string ,g_cd:number) => {
    stationName.value.station_name = name;
    stationName.value.station_g_cd = g_cd;
    stationList.value = null;
    toggleIPClass(true);
}

</script>

<style scoped>
.stationList {
    >p {
        text-align: center;
    }
    >ul {
        cursor: pointer;
        list-style: none;
        padding-inline-start: 0px;
        border-top: solid 1px rgba(0,0,0,.3);
        border-bottom: solid 1px rgba(0,0,0,.3);
        >li {
            text-align: center;
        }
        >li:hover {
            background-color: rgba(0,0,0,.1);
        }
    }
}

.inputField {
    text-align: center;
}
.inputField.cdReady {
    background-color: rgba(6, 255, 201, 0.207);
    border-color: rgb(118, 118, 118);
}
</style>