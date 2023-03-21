import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

const app = createApp(App,
    {
        dataFile: "../assets/data/test-data.json",
        rootNode: 'http://example.or/#jane',
    }
)

app.mount('#app')