import { createStore } from 'vuex'

import search from './modules/search'

export default createStore({
    modules: {
        search
    },
    // strict: process.env.NODE_ENV !== 'production'
})
