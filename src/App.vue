<script setup>
import { reactive, onBeforeMount, onBeforeUpdate, onUpdated, watch } from 'vue'

import { getUrlBasename, isNonemptyObject, fetchLocalData } from "./lib/utils";

import Dragbar from './components/Dragbar.vue'
import Browser from './components/Browser.vue';
import Viewer from './components/Viewer.vue';
import Editor from './components/Editor.vue'

import store from "./lib/store.js";

import 'highlight.js/styles/default.css';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
hljs.registerLanguage('json', json);

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  dataFile: {
    type: String ,
    default: ""
  },
  // TODO fetch from URI
  // dataUri: { type: String },
  rootNode: {
    type: String
  },
})

const state = reactive({
  viewType: "form",
  isLoading: true,
  error: false
})

watch(() => (props.data), (newData) => {
    // you will get the latest props into updatedProp
    store.setModel( newData )
    // store.updateCurentNode(JSON.parse(state.value))
    if (store.currentPath.length) {
      setTimeout(() => {
        gotoItemByPath(store.currentPath)
      }, 1)
    }
  })

console.log('JSONLD App.vue, JSON Model', {props, store});

onBeforeMount(async () => {

  if (props.dataFile && typeof props.dataFile === 'string') {
    try {
      store.setModel(await fetchLocalData(props.dataFile))
    } catch (error) {
      console.log('error', error);
      alert(`Error:${error}`)
      state.error = true
    }
  }
  else if (isNonemptyObject(props.data)) {
    store.setModel( props.data )
  }
  state.isLoading = false

  if (isNonemptyObject(store.model) && props.rootNode) {
    setTimeout(() => gotoItemByPath([props.rootNode]), 1);
  }
})

onBeforeUpdate(() => {
    console.log('App.vue beforeUpdate', {storepath: store.currentPath});
})

onUpdated(() => {

  if (state.viewType == 'code') {
    const el = document.querySelector(".code-viewer code")
    hljs.highlightElement(el);
  }
})

const gotoItemByPath = (path) => {
  console.log('gotoItemByPath', path);
  path = path.map(a => getUrlBasename(a))
  const target = document.querySelector(`[data-path="${encodeURIComponent(path)}"]`)
  if (!target) {
    console.error('Node not found for path', path, target);
    return
  }
  target.querySelector(".active-area").click()
}

const viewPath = (path) => {
  path = path.map(a => getUrlBasename(a))
  return path.join(' > ')
}

const isBlanknode = () => {
  return store.currentNode !== null && store.currentPath.length == 0 && !store.currentNode.hasOwnProperty('@id')
}

const viewCode = () => {
  state.viewType = 'code'
}

const viewForm = () => {
  state.viewType = 'form'
}

const viewEditor = () => {
  state.viewType = 'editor'
}

const escape = (key, val) => {
    if (typeof(val)!="string") return val;
    return val
      .replace(/[\"]/g, '\\"')
      .replace(/[\\]/g, '\\\\')
      .replace(/[\/]/g, '\\/')
      .replace(/[\b]/g, '\\b')
      .replace(/[\f]/g, '\\f')
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r')
      .replace(/[\t]/g, '\\t')
    ;
}


</script>

<template>

  <div class="browser-wrapper" v-if="!state.isLoading && Array.isArray(store.model)">
    <Browser
      :model="store.model"
    />
  </div>

  <div v-if="state.isLoading" style="margin: 2rem;">
    Loading. Fetch data, init model ...
  </div>

  <div v-if="state.error" style="margin: 2rem;">
    Error: undefined model. View console log for details.
  </div>

  <Dragbar />

  <div class="viewer-wrapper" v-if="!state.isLoading && Array.isArray(store.model)">

    <div class="viewer-menu buttons has-addons are-small" v-if="store.currentPath.length">
      <button class="button" @click="viewForm" :disabled="state.viewType == 'form'"><span class="material-symbols-outlined">description</span></button>
      <button class="button" @click="viewCode" :disabled="state.viewType == 'code'"><span class="material-symbols-outlined">code</span></button>
      <button class="button" @click="viewEditor" :disabled="state.viewType == 'editor'"><span class="material-symbols-outlined">edit</span></button>
    </div>

    <div class="path" v-if="store.currentPath.length && !isBlanknode()">
      > {{ viewPath( store.currentPath) }}
    </div>

    <Viewer v-if="state.viewType == 'form'"
      :data="store.currentNode"
      :path="store.currentPath"
      :is-blanknode="isBlanknode()"
      @on-select-child-item="gotoItemByPath"
    />
    <!-- TODO move to own single Component -->
    <div v-else-if="state.viewType == 'code'" class="code-viewer">
      <pre><code class="language-json">{{ store.currentNode }}</code></pre>
    </div>

    <Editor v-else-if="state.viewType == 'editor'"
      :value="store.currentNode" :path="store.currentPath.slice()" />

  </div>
</template>

<style scoped>
.browser-wrapper {
  position: relative;
  height: 100%;

  padding-left: .5rem;
  background-color: #fbfbfb;
  /* grid-row: 1;
  grid-column: auto; */
  overflow: auto;
	grid-area: browser;
}

.dragbar {
  grid-area: dragbar;

    width: 5px;
    background: transparent;
    position: absolute;
    height: 100%;
    z-index: 999;
    margin-left: -5;
}

.dragbar:hover, .dragbar:active {
  cursor: col-resize;
  background: grey;
}

.viewer-wrapper {
  /* padding: 0 1rem; */
  overflow: auto;
	grid-area: viewer;
}


.viewer-menu {
  position: absolute;
  z-index: 1;
  right: 0;
}
.viewer-wrapper:has(.editor-viewer) .viewer-menu {
  right: 50px;
}

.code-viewer code {
  font-size: 0.8em;
  background-color: white;
}

.path {
  padding: .12rem .5rem;
  font-size: 12px;
  color: gray;
  height: 24px;
  background-color: #d3d3d3;
  /* border-bottom: 1px solid gray; */
  /* z-index: 1; */
  /* box-shadow: 0 0 2px 2px #dfdfdf; */

}

</style>

<script>
// executed only once
export const componentName = 'JSONLDBrowser';

export default {
  name: componentName,
  inheritAttrs: false,
  customOptions: {}
}
</script>