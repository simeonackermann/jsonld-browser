import App from './App.vue'

export default {
    install(Vue) {
        Vue.component(App.name, App)
    }

}

export { default as JSONLDBrowser } from "./App.vue";
