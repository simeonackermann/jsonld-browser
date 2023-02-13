<script setup>
import { reactive, inject } from 'vue'

import { getUrlBasename } from "./lib/utils";

import Browser from './components/Browser.vue';
import Viewer from './components/Viewer.vue';
// import { createReturnStatement } from '@vue/compiler-core';


// let currentSelectedPath = inject('currentSelectedPath')

const state = reactive({
  selectedItem: null,
  selectedPath: [],
})

// const vFocus1 = {
  //   mounted: (el) => "FooBarFocus"
  // }
const rootNode = inject('rootNode')


const setSelectedItem = (path, item) => {
  state.selectedItem = item
  state.selectedPath = path
}

const gotoItemByPath = (path) => {
  console.log('rootNode', path);
  path = path.map(a => getUrlBasename(a))
  const target = document.querySelector(`[data-path="${encodeURIComponent(path)}"]`)
  if (!target) {
    console.error('Node not found for path', path, target);
    return
  }

  // console.log('GOTO node: ', path, target);
  target.querySelector(".title").click()
}

// rootNode
if (rootNode && typeof rootNode === 'string') {
  // gotoItemByPath([rootNode])
  setTimeout(() => {
    gotoItemByPath([rootNode])
  }, 1);
}
</script>

<template>
  <!-- vFocus: {{ v-focus1 }} -->
  <!-- v-test123: {{  v-test123 }}, <span v-test123>...</span> -->
  <!-- currentSelectedPath: {{ currentSelectedPath }} -->
  <div class="browser-wrapper" >
    <Browser
      :current-selected-path="state.selectedPath"
      @on-item-selected="setSelectedItem"
    />
  </div>

  <div class="dragbar"></div>

  <div class="viewer-wrapper">
    <Viewer
      :data="state.selectedItem"
      :path="state.selectedPath"
      @on-select-child-item="gotoItemByPath"
    />
  </div>

  <!-- <div>
    TODO:
  </div>

  <div>
    <div>- somehow view/integrate @context ?!
    <div>- may allow json data without @id propety ?</div>
    <div>- column resize, editor/browser</div>
    <div>- order properties in details view (label/name, descr, ... , edges)</div>
    <div>- other JSON-LD formats (not framed): expanded, compatced, ... @graph or wiuthout, array/object</div>
    <div>- test very big json data -> vertical browser max width </div>
    <div>- browser selected/hover item background color from left to right</div>
    <div>- importe details viewer format</div>
    <div>- editor (longterm)</div>
  </div> -->

</template>


<style scoped>

.browser-wrapper {
  position: relative;
  height: 100%;

  padding-left: 1rem;
  background-color: #fbfbfb;
  /* grid-row: 1;
  grid-column: auto; */
  overflow: auto;
	grid-area: browser;
}

.viewer-wrapper {
  /* padding: 0 1rem; */
  overflow: auto;
	grid-area: viewer;
}

</style>
