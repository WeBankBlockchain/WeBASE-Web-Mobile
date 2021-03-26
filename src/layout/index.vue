<template>
    <div>
        <navbar />
        <app-main style="padding-bottom: 60px" />
        <tabbar />
    </div>
</template>
<script>
import { AppMain, Navbar, Tabbar } from './components'
import { reactive, ref, toRefs } from "vue"
export default {
    name: 'Layout',
    components: {
        AppMain,
        Navbar,
        Tabbar
    },
    setup() {

    },

}
</script>