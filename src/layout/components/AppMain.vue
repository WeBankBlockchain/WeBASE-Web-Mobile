<template>
    <div class="module">
        <router-view/>
        
    </div>
</template>
<script>
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
export default {
    name: "AppMain",
    setup(){
        onBeforeRouteUpdate(to => {
            
        });
        return {
            
        }
    }
}
</script>
<style scoped>
.module{
    padding-top: 50px;
    padding-bottom: 60px;
    box-sizing: border-box;
}
</style>