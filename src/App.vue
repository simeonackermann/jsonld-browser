<script setup>
import { reactive, inject, onUpdated } from 'vue'

import { getModel } from "./lib/store";
import { getUrlBasename } from "./lib/utils";

import Browser from './components/Browser.vue';
import Viewer from './components/Viewer.vue';

const state = reactive({
  selectedItem: null,
  selectedPath: [],
})

const model = getModel()

const rootNode = inject('rootNode')

onUpdated(() => {
  console.log("App.vue, json:", {model: getModel()});
})


const setSelectedItem = (path, item) => {
  // console.log('setSelectedItem', 'path', path, 'item', item);
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
  target.querySelector(".active-area").click()
}

// rootNode
if (rootNode && typeof rootNode === 'string') {
  // gotoItemByPath([rootNode])
  setTimeout(() => {
    gotoItemByPath([rootNode])
  }, 1);
}

let browserWidth = 0
let browserScrollLeftPos = 0


const onDragStart = (e) => {
  // browserWidth = document.querySelector(".browser-wrapper").clientWidth
  // console.log('dragstart..., browser scroll pos: ', browserWidth);

  browserScrollLeftPos = document.querySelector(".browser-wrapper").scrollLeft

  // var crt = this.cloneNode(true);
  // crt.style.backgroundColor = "red";

  // remoge drag&drop shadow
  // var img = document.createElement("img");
  e.dataTransfer.setDragImage(document.createElement("img"), 0, 0);
}

const onDrag = (e) => {
  browserWidth = document.querySelector(".browser-wrapper").clientWidth
  // console.log('drag...', browserWidth, e.offsetX);
  // const plus
  // if ((!lasOffsetX || lasOffsetX != e.offsetX)) {
  //   lasOffsetX = e.offsetX
  //   console.log('lasOffsetX', lasOffsetX);
  //   console.log('new browser widsth:', browserWidth+lasOffsetX);
  //   // document.querySelector("#app").style.gridTemplateColumns = `${browserWidth+lasOffsetX}px 5px auto`
  // }

  if (browserWidth != browserWidth+e.offsetX) {
    document.querySelector("#app").style.gridTemplateColumns = `${browserWidth+e.offsetX}px 0px auto`
    document.querySelector(".browser-wrapper").scrollLeft = browserScrollLeftPos
  }


}

const onDragEnd = () => {
  // console.log('dragend...');
}

// document.addEventListener("resize", function( event ) {
//   console.log('document resize...');
// }, false);
</script>

<template>

  <div class="browser-wrapper" v-if="Array.isArray(model)">
    <Browser
      :model="model"
      :current-selected-path="state.selectedPath"
      @on-item-selected="setSelectedItem"
    />
  </div>

  <div v-else style="margin: 2rem;">
    Undefined Model. View console log for details.
  </div>


    <div class="dragbar" draggable="true"
      @dragstart="onDragStart"
      @drag="onDrag"
      @dragend="onDragEnd()"
    ></div>

  <div class="viewer-wrapper" v-if="Array.isArray(model)">
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
