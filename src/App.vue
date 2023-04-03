<script setup>
import { reactive, onBeforeMount } from 'vue'

import { getUrlBasename, isNonemptyObject } from "./lib/utils";
import { fetchLocalData, addData } from "./lib/store"

import Dragbar from './components/Dragbar.vue'
import Browser from './components/Browser.vue';
import Viewer from './components/Viewer.vue';

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
  }
})

const state = reactive({
  model: null,
  selectedItem: null,
  selectedPath: [],
  isLoading: true,
  error: false
})

onBeforeMount(async () => {

  if (props.dataFile && typeof props.dataFile === 'string') {
    try {
      state.model = await fetchLocalData(props.dataFile)
    } catch (error) {
      console.log('error', error);
      alert(`Error:${error}`)
      state.error = true
    }
  }
  else if (isNonemptyObject(props.data)) {
    state.model = addData(props.data)
  }
  state.isLoading = false

  if (isNonemptyObject(state.model) && props.rootNode) {
    setTimeout(() => gotoItemByPath([props.rootNode]), 1);
  }
})

const setSelectedItem = (path, item) => {
  // console.log('setSelectedItem', 'path', path, 'item', item);
  state.selectedItem = item
  state.selectedPath = path
}

const gotoItemByPath = (path) => {
  path = path.map(a => getUrlBasename(a))
  const target = document.querySelector(`[data-path="${encodeURIComponent(path)}"]`)
  if (!target) {
    console.error('Node not found for path', path, target);
    return
  }
  target.querySelector(".active-area").click()
}
</script>

<template>

  <div class="browser-wrapper" v-if="!state.isLoading && Array.isArray(state.model)">
    <Browser
      :model="state.model"
      :current-selected-path="state.selectedPath"
      @on-item-selected="setSelectedItem"
    />
  </div>

  <div v-if="state.isLoading" style="margin: 2rem;">
    Loading. Fetch data, init model ...
  </div>

  <div v-if="state.error" style="margin: 2rem;">
    Error: undefined model. View console log for details.
  </div>

  <Dragbar />

  <div class="viewer-wrapper" v-if="!state.isLoading && Array.isArray(state.model)">
    <Viewer
      :data="state.selectedItem"
      :path="state.selectedPath"
      :is-blanknode="state.selectedItem !== null && state.selectedPath.length == 0 && !state.selectedItem.hasOwnProperty('@id')"
      @on-select-child-item="gotoItemByPath"
    />
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