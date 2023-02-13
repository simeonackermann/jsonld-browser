import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

// import data from './assets/data/json-framed.json'
// import data from "./assets/data/test-data-extended.json";

import { fromRDF } from "jsonld";

// console.log("main.js, json:", data);

// let currentSelectedPath = []

// const rdf = `
// <http://example.or/manu/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/Person> .
// <http://example.or/manu/> <http://schema.org/name> "Manu Sporny" .
// <http://example.or/manu/> <http://schema.org/livesIn> <http://example.or/leipzig/> .
// <http://example.or/manu/> <http://schema.org/website> <http://manu-sponies-site.de/> .
// <http://example.or/leipzig/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/City> .
// <http://example.or/leipzig/> <http://schema.org/name> "Leipzig".
// `
// const jsonld = await fromRDF(rdf, {format: 'application/n-quads'})
// console.log('JSONLD FROM RDF:', jsonld);

const app = createApp(App)
// app.provide('globalJSON', data)
// app.provide('rootNode', 'http://example.or/manu')

// app.provide('currentSelectedPath', currentSelectedPath)
// app.directive('test123', {
//   mounted: (el) => {
//     console.log('MOUNTED ...')
//     return 'yes'
//   },
//   updated: (el, binding, vnode, prevVnode) => {
//     console.log('UPDATED...');
//   }
// })

app.mount('#app')