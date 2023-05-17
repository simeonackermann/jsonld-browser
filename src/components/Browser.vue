<script setup>

import Item from './BrowserItem.vue'

const props = defineProps({
  model: {
    type: Array,
    required: true
  }
})

const getPath = (node) => {
  if (!node.hasOwnProperty('@id')) return []

  return [node['@id']]
}
</script>

<template>
  <div class="browser">

    <div v-for="(node, i) in model" class="node-wrapper">
        <Item
          :node=node
          :path="getPath(node)"
          :is-blanknode="!node.hasOwnProperty('@id')"
          :depth="1"
        />
    </div>

  </div>
</template>

<style scoped>
.browser {
  position: absolute;
  min-width: calc(100% - 8px);
}
</style>

<style>
.toggler {
  width: 12px;
  pointer-events: auto;
}

.toggler i {
  border: solid grey;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  margin: 0 4px 2px 0;
}
.toggler:hover {
  cursor: pointer;
}
.toggler:hover i {
  border-color: rgb(77, 77, 77);
}
.toggler .right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.toggler .left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.toggler .up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}
.toggler .down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

</style>