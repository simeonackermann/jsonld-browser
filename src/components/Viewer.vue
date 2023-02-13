<script setup>
import { h } from 'vue'

// import { inject } from 'vue'
// const globalJSONGraph = inject('globalJSON')
import { onMounted, onUnmounted, onUpdated, inject } from 'vue'

import IconNode from './icons/IconNode.vue'
import IconExternalLink from './icons/IconExternalLink.vue'
import IconNodeLinked from './icons/IconNodeLinked.vue'
import { getNodeLabel,
  getUrlBasename,
  getValueOf,
} from '../lib/utils.js'
import {
  getModel,
  getResourceFromModel,
  modelHasResource
 } from "../lib/store";

const props = defineProps({
  data: {
    type: [Array, Object, null],
    required: true
  },
  path: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['onSelectChildItem'])

// const globalJSONGraph = inject('globalJSON')
// const globalJSONGraph = getModel()

onUpdated(() => {
  // console.log(`the component is now mounted.`)
  console.log("Details.vue, json:", {data: props.data, path: props.path});
})

const handleClickChildNode = (path) => {
  emit('onSelectChildItem', path)
}

const viewPath = (path) => {
  path = path.map(a => getUrlBasename(a))
  return path.join(' > ')
}

// const getNodeProperties = (node) => {
//   return Object.keys(node)
// }

// const formatNodeValues = ( value ) => {
//   if (Array.isArray(value)) {

//     return `${value}`
//   }
//   return value
// }

// const formatSubNodeValues = (value) => {
//   return value
// }

const getNodeValueFormatClasses = (value) => {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (value === null) return 'null'

  return ""
}

const getMetaProps = (data) => {
  return Object.keys(data).filter(a => a.startsWith('@'))
}

const isExternalLink = (node) => {
  if (Object.keys(node).length > 1) return false

  return ! modelHasResource(node['@id'])
}

const subnodeIsInternalLink = (node) => {
  if (!node['@type']) {
    // TODO may internal links could have a @type?!
    return modelHasResource(node['@id'])
  }
  return false
}

// const getNodeInGraph = (id) => {
//   return getResourceFromModel(id)
// }

// let nodeIsInternalLink = false
// if (props.data subnodeIsInternalLink(props.data)) nodeIsInternalLink = true

</script>

<template>

  <div class="viewer">

    <div v-if="data && data['@id'] && subnodeIsInternalLink(data)" class="node-wrapper">
      {{  (targetSubNode =  getResourceFromModel(data['@id']), null) }}
        <div class="node">
          <div class="node-key">
            Linked resource
          </div>
          <div class="node-subnodevalue">
            <a class="linked-node" :href="'#' + encodeURIComponent(targetSubNode['@id'])" @click="handleClickChildNode([targetSubNode['@id']])" >
              <IconNodeLinked />
              {{ getNodeLabel(targetSubNode)  }}
            </a>
            <span v-if="targetSubNode['@type']">({{ getUrlBasename(targetSubNode['@type']) }})</span>
          </div>
        </div>
    </div>

    <div v-else-if="data">
        <div class="path">> {{ viewPath(path) }}</div>

        <div class="node-wrapper" v-if="data['@id']">
          <!-- META -->
          <div class="node-meta" v-for="metaKey in getMetaProps(data)">
              <div>{{ metaKey }}</div>
              <div class="node-value" v-if="Array.isArray(data[metaKey])">
                <div v-for="metaValue in data[metaKey]">{{ metaValue }}</div>
              </div>
              <div class="node-value" v-else>
                {{ data[metaKey] }}
              </div>
          </div>

          <div class="node" v-for="key in Object.keys(data).filter(a => !a.startsWith('@'))">
            <div class="node-key">{{ getUrlBasename(key) }}</div>
            <!-- Array of Links/SubNodes -->
            <div class="node-subnodevalue" v-if="Array.isArray(data[key]) && data[key][0]['@id']">
              <div v-for="subnodekey in data[key]">
                <span v-if="isExternalLink(subnodekey)">
                  - <a class="linked-node external-site" :href="subnodekey['@id']" target="_blank">
                    {{ subnodekey['@id'] }}
                    <IconExternalLink />
                  </a>
                </span>
                <span v-else>
                  - <a class="linked-node" href="#" @click="handleClickChildNode(path.concat(key, subnodekey['@id']))">
                    <IconNode />
                    {{ getNodeLabel(subnodekey) }}
                  </a>
                  <span v-if="subnodekey['@type']">({{ getUrlBasename(subnodekey['@type']) }})</span>
                </span>
              </div>
            </div>
            <!-- Subnode (as Object) -->
            <div class="node-subnodevalue" v-else-if="data[key] !== null && typeof data[key] === 'object' && data[key]['@id']">
              - <a class="linked-node" href="#" @click="handleClickChildNode(path.concat(key, data[key]['@id']))">
                <IconNode />
                {{ getNodeLabel(data[key]) }}
              </a>
              <span v-if="data[key]['@type']">({{ getUrlBasename(data[key]['@type']) }})</span>
            </div>
            <!-- Simple Value -->
            <div class="node-value"  v-bind:class="getNodeValueFormatClasses(data[key])" v-else-if="data[key] == null">
              null
            </div>
            <div class="node-value"  v-bind:class="getNodeValueFormatClasses(data[key])" v-else-if="Array.isArray(data[key])">
              <div v-for="valuek in data[key]">
                {{ getValueOf(valuek) }}
              </div>
            </div>
            <div class="node-value"  v-bind:class="getNodeValueFormatClasses(data[key])" v-else>
              {{ data[key] }}
            </div>
          </div>

          <!-- <div v-if="subnodeIsInternalLink(data)" class="node">
            {{  (targetSubNode =  getResourceFromModel(data['@id']), null) }}
            <div class="node-key">
              Linked resource
            </div>
            <div class="node-subnodevalue">
              <a class="linked-node" :href="'#' + encodeURIComponent(targetSubNode['@id'])" @click="handleClickChildNode([targetSubNode['@id']])" >
                <IconNodeLinked />
                 {{ getNodeLabel(targetSubNode)  }}
              </a>
              <span v-if="targetSubNode['@type']">({{ getUrlBasename(targetSubNode['@type']) }})</span>
            </div>
          </div> -->
        </div>

        <div class="edge-wrapper" v-else>
          <!-- Edge: {{ data  }} -->
          <div v-if="data.length > 1">Has Nodes:</div>
          <div v-else>Has Node:</div>
          <div class="edge" v-for="subnode in data">
            - <a class="linked-node" href="#" @click="handleClickChildNode(path.concat(subnode['@id']))">
                <IconNode />
                {{ getNodeLabel(subnode) }}
              </a>
            <span v-if="subnode['@type']">({{ getUrlBasename(subnode['@type']) }})</span>
          </div>
        </div>

    </div>

    <div v-else>
      Select a node to view details ...
    </div>

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
  background-color: #d3d3d3;
  border-bottom: 1px solid gray;
}
.node-wrapper {

}
.node-meta {
  padding: .2rem .5rem;
  display: grid;
  grid-template-columns: 1fr 3fr;
  font-size: 13px;
  background-color: #f5f5f5;
}

.node {
  display: grid;
  padding: .2rem .5rem;
  grid-template-columns: 1fr 3fr;
}
/* .node + .node {
  padding:
} */



.node-meta + .node {
  /* padding: 0; */
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

.linked-node + span {
  /* display: none; */
  margin-left: .5em;
  color: lightgray;
}
/* .linked-node:hover + span {
  display: inline;
} */

.linked-node svg {
    height: 13px;
    width: auto;
    margin: 0 0 -1px 4px;
}

.external-site svg {
  height: 12px;
}

a {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

.node-key {
  color: rgb(77, 77, 77)
}

.node-value {
  color: rgb(161, 0, 0)
}
.node-value.number {
  color: rgb(0, 92, 0)
}
.node-value.boolean {
  color: rgb(0, 0, 172)
}
.node-value.null {
  color: rgb(0, 0, 172)
}
</style>