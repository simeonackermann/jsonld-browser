<script setup>

import { getUrlBasename } from '../lib/utils';

const props = defineProps({
  data: {
    type: [Array, Object, null],
    required: true
  }
})

const getMetaProps = (data) => {
  return Object.keys(data).filter(a => a.startsWith('@'))
}

const getMetaValue = (data, key) => {
    if (key == "@id") return data[key]
    return getUrlBasename(data[key])
}

</script>

<template>

<div class="node-meta" v-for="metaKey in getMetaProps(data)">
    <div>{{ metaKey }}</div>
    <div class="node-value" v-if="Array.isArray(data[metaKey])">
        <div v-for="(metaValue, i) in data[metaKey]">
            {{ getMetaValue(data[metaKey], i) }}
        </div>
    </div>
    <div class="node-value" v-else>
        {{ getMetaValue(data, metaKey) }}
    </div>
</div>

</template>

<style scoped>

.node-meta {
  padding: .2rem .5rem;
  display: grid;
  grid-template-columns: 1fr 3fr;
  font-size: 13px;
  background-color: #f5f5f5;
}


</style>