<script setup>
// import Node from './BrowserNode_old.vue'
import Item from './BrowserItem.vue'

import { getModel } from "../lib/store";
// import { inject } from 'vue'
// const globalJSONGraph = inject('globalJSON')
const model = getModel()

const props = defineProps({
  currentSelectedPath: {
    type: Array,
    required: true
  },
})

const emit = defineEmits(['onItemSelected'])

const onItemSelected = (path, node) => {
  emit('onItemSelected', path, node)
}


const prepareModel = (json) => {

    const hasId = (d) => {
      if (!d['@id']) {
        console.warn('JSON-LD Model does not has property "@id"', d);
        return false
      }
      return true
    }

    if (Array.isArray(json)) {
      if (!hasId(json[0])) return false

    }
    else if (typeof json === 'object') {
      if (json['@graph'])
        json = json['@graph']
      else
        json = [json]
      if (!hasId(json[0])) return false
    } else {
      return false
    }

    return json
}

// const init = async () => {
//   // console.log(props.json);
//   await getRootNode(props.json)
// }
// init()

// const model = prepareModel(globalJSONGraph)
console.log('Browser.vue, JSON Model', model);

</script>

<template>
  <div class="browser">

    <div v-if="Array.isArray(model)" v-for="node in model" class="node-wrapper">
        <Item
          :node=node
          :path="[node['@id']]"
          :current-selected-path="currentSelectedPath"
          @on-item-selected="onItemSelected"
        />
    </div>

    <!-- <div v-else-if="typeof jsonldModel === 'object'" class="node-wrapper">
        <Item
          :node=jsonldModel
          :path="[jsonldModel['@id']]"
          :current-selected-path="currentSelectedPath"
          @on-item-selected="onItemSelected"
        />
    </div> -->

    <div v-else>
      Undefined Model
    </div>


    <!-- <div v-else class="node-wrapper">
        <Node :node=rootNode :path="[rootNode['@id']]" />
    </div> -->

  </div>
</template>

<style scoped>
.browser {
  position: absolute;
}
</style>

<style>
.arrow {
  border: solid grey;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  margin: 0 4px 2px 0;
  /* margin: 0 3px 0 -3px; */
}
.arrow:hover {
  cursor: pointer;
}
.arrow.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.arrow.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.arrow.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}
.arrow.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

</style>