<script setup>
import { onUpdated } from 'vue'

import NodeMeta from './ViewerNodeMeta.vue'
import { getUrlBasename } from '../lib/utils.js'
import ViewerValue from "./ViewerValue.vue"
import store from "../lib/store";

const props = defineProps({
  data: {
    type: [Array, Object, null],
    required: true
  },
  path: {
    type: Array,
    required: true
  },
  isBlanknode: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['onSelectChildItem'])

onUpdated(() => {
  console.log("Viewer.vue, json:", {data: props.data, path: props.path, isBlanknode: props.isBlanknode});
})

const handleClickChildNode = (path) => {
  emit('onSelectChildItem', path)
}

</script>

<template>

  <div v-if="data" class="viewer">
    <!-- Node is link to internal resource -->
    <div v-if="data['@id'] && !data['@type'] && store.modelHasResource(data['@id'])" class="node-wrapper">
      {{  (targetSubNode =  store.getResourceFromModel(data['@id']), null) }}
      <div class="node">
        <div class="node-key">
          <i>Link to resource</i>
        </div>

        <ViewerValue
              :value="data"
              :predicate="[]"
              :path="[]"
              :value-is-link-to-internal-resource="true"
              @on-select-child-item="handleClickChildNode"
            />
      </div>
    </div>

    <!-- NODE  -->
    <div v-else-if="data['@id'] || isBlanknode" class="node-wrapper">
      <!-- META -->
      <NodeMeta :data="data" />

      <!-- NODE-PROPERTIES -->
      <div class="node" v-for="key in Object.keys(data).filter(a => !a.startsWith('@'))">

        <div class="node-key">{{ getUrlBasename(key) }}</div>

        <ViewerValue
            :value="data[key]"
            :predicate="key"
            :path="path"
            @on-select-child-item="handleClickChildNode"
          />

      </div>
    </div>

    <!-- EDGE -->
    <div v-else class="edge-wrapper">
      <div class="edge">
        <div class="edge-key">{{ getUrlBasename(path[path.length-1]) }}:</div>
        <ViewerValue
          v-for="subnode in data"
          :value="subnode"
          :predicate="[]"
          :path="path"
          :value-is-link-to-internal-resource="true"
          :in-array="true"
          @on-select-child-item="handleClickChildNode"
        />
      </div>
    </div>

  </div>

  <div v-else style="margin: 2rem;">
    Select a node to view details ...
  </div>

</template>

<style scoped>
.viewer {
  /* padding: 0 1rem; */
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
.node {
  display: grid;
  padding: .2rem .5rem;
  grid-template-columns: 1fr 3fr;
}

.node > * {
  min-width: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.edge-wrapper {
  padding: 0 .5rem;
}
.edge {
  padding: 0 .5rem;
}
/* .edge::before {
  content: "- "
} */

.node-key {
  color: rgb(77, 77, 77)
}

</style>