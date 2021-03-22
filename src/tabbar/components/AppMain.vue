<template>
    <div>
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