import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

const app = createApp(App,
    {
        // TODO: fix blanknode is immediately selected
        // data: {
        //     "@context": "http://schema.org/",
        //     "type": "CompactPerson",
        //     "jobTitle": "Professor",
        //     "name": "Jane Doe",
        //     "telephone": "(425) 123-4567",
        //     "url": "http://www.janedoe.com"
        //   }
        dataFile: "../assets/data/test-data.json",
        rootNode: 'http://example.or/#jane',
    }
)

app.mount('#jsonld-browser')