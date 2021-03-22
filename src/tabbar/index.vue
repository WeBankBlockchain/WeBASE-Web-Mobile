<template>
    <div>
        <app-main />
        <tabbar />
    </div>
</template>
<script>
import { AppMain, Tabbar } from './components'
import { reactive, ref, toRefs } from "vue"
export default {
    name: 'Layout',
    components: {
        AppMain,
        Tabbar
    },
    setup() {

    },

}
</script>