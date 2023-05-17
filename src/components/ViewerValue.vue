<script setup>

import Viewer from "./Viewer.vue";
import IconNode from './icons/IconNode.vue'
import IconExternalLink from './icons/IconExternalLink.vue'
import IconNodeLinked from './icons/IconNodeLinked.vue'
import { getNodeLabel, getUrlBasename } from '../lib/utils.js'
// import {
//   getResourceFromModel,
//   modelHasResource,
//   getContext
//  } from "../lib/store";
 import store from "../lib/store"

const props = defineProps({
  value: {
    required: true
  },
  predicate: {
    // type: String,
    required: true
  },
  path: {
    type: Array,
    required: true
  },
  inArray: {
    type: Boolean,
    default: false
  },
  valueIsLinkToInternalResource: {
    type: Boolean,
    default: false
  }
})

// console.log('ViewerValue.vue', {key: props.predicate, value: props.value});

const emit = defineEmits(['onSelectChildItem'])

// const context = getContext()

const handleClickChildNode = (path) => {
  emit('onSelectChildItem', path)
}

const getNodeValueFormatClasses = (value) => {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'

  return "value"
}

// const isSubnode = (value) => {
//     return typeof value == 'object'
//         && value.hasOwnProperty('@id')
//         && Object.keys(value).length > 1
// }

const isInternalLink = (key, value) => {
    if (typeof value !== 'string' ) return false

    if (store.context && store.context.hasOwnProperty(key) && store.context[key]['@type'] == "@id") {
        return true;
    }
    return store.modelHasResource(value)
}

const isExternalLink = (key, value) => {
    // TODO may allow prefix links (example my:page)
    return typeof value === 'string' && value.startsWith('http')
    // if (context && context.hasOwnProperty(key) && context[key]['@type'] == "@id") {
    //     return value.startsWith('http')
    // }
    // return false
}

const objectLength = (object) => {
    return Object.keys(object).length
}

</script>

<template>

    <!-- Array of Values -->
    <div v-if="Array.isArray(value)">
        <viewer-value
            v-for="valuex in value"
                :value="valuex"
                :predicate="predicate"
                :path="path"
                :in-array="true"
                @on-select-child-item="handleClickChildNode"
        />
    </div>

    <!-- NULL -->
    <div v-else-if="value === null" class="node-value null">
        null
    </div>

    <!-- VALUE is OBEJECT -->
    <div v-else-if="typeof value === 'object'">

        <!-- LITERAL -->
        <div v-if="value.hasOwnProperty('@value') && objectLength(value) == 1"
            class="node-value literal"
            v-bind:class="getNodeValueFormatClasses(value)"
        >
            {{ value['@value'] }}
        </div>

        <!-- LINK (ext/int) -->
        <div v-else-if="value.hasOwnProperty('@id') && objectLength(value) == 1">
            {{  ( linkedNode = store.getResourceFromModel(value['@id']), null) }}
            <div v-if="isInternalLink(predicate, value['@id'])" class="node-value link">
                <span v-if="inArray">- </span>
                <a class="linked-node" href="#" @click.prevent="handleClickChildNode([linkedNode['@id']])">
                  <IconNodeLinked />
                  {{ getNodeLabel(linkedNode)  }}
                </a>
                <span v-if="linkedNode['@type']">({{ getUrlBasename(linkedNode['@type']) }})</span>

            </div>
            <div v-else-if="isExternalLink(predicate, value['@id'])" class="node-value link">
                <span v-if="inArray">- </span>
                <a class="linked-node external-site" :href="value['@id']" target="_blank">
                    {{ value['@id'] }}
                    <IconExternalLink />
                  </a>
            </div>

            <div v-else class="node-value literal">
                {{ value['@id'] }}
            </div>
        </div>

        <!-- SUBNODE -->
        <div v-else-if="value.hasOwnProperty('@id')" class="node-value link">
            <span v-if="inArray">- </span>
            <a class="linked-node" href="#" @click.prevent="handleClickChildNode(path.concat(predicate, value['@id']))">
                    <IconNode />
                    {{getNodeLabel(value)}}

                </a>
                <span v-if="value['@type']">({{ getUrlBasename(value['@type']) }})</span>
        </div>

        <!-- BLANKNODE -->
        <Viewer
            v-else
            :data="value"
            :path="[]"
            :is-blanknode ="true"
        />

    </div>

    <!-- LINK int -->
    <div v-else-if="isInternalLink(predicate, value)" class="node-value link">
        <a class="linked-node" href="#" @click.prevent="handleClickChildNode([value])">
            <IconNodeLinked />
            {{getNodeLabel(store.getResourceFromModel(value))}}
        </a>

    </div>
    <!-- LINK ext -->
    <div v-else-if="isExternalLink(predicate, value)" class="node-value link">
        <a class="linked-node external-site" :href="value" target="_blank">
            {{ value }}
            <IconExternalLink />
        </a>
    </div>

    <!-- LITERAL (String/Integer/Boolean...) -->
    <div v-else class="node-value literal"  v-bind:class="getNodeValueFormatClasses(value)">
        {{ value }}
    </div>

</template>

<style scoped>

.linked-node + span {
  margin-left: .5em;
  color: lightgray;
}

.linked-node svg {
    height: 13px;
    width: auto;
    margin: 0 3px -1px 3px;
}

.external-site svg {
  height: 12px;
}


.node-value.value {
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