<script setup>
import { ref, reactive, onBeforeMount, onMounted, onBeforeUpdate, onUpdated } from 'vue'
import store from '../lib/store'

import {CodeJar} from 'codejar'
import hljs from 'highlight.js/lib/core';
import hljsJson from 'highlight.js/lib/languages/json';
hljs.registerLanguage('json', hljsJson);
hljs.configure({ignoreUnescapedHTML: true})


const props = defineProps({
  value: {},
  path: {}
})

const state = reactive({
    path: [],
    value: '',

    edited: false
})

let jar = null
const jarEl = ref(null)

onBeforeMount(() => {
    state.path = props.path
    state.value = props.value ? JSON.stringify(props.value, undefined, 2) : ''
})

onMounted(() => {
  setupEditor()
})

onBeforeUpdate(() => {
    // console.log('Editor.vue, beforeUpdte', {propspath: props.path, statepath: state.path, storepath: store.currentPath});
    // if (!state.edited) state.value = JSON.stringify(props.value, undefined, 2)
    if (props.path.join() != state.path.join()) {
        if (state.edited) {
            console.log('TODO: warning, we miss changes...');
        }
        state.path = store.currentPath
        state.value = JSON.stringify(store.currentNode, undefined, 2)
        console.log('update codeJar...');

        setTimeout(() => {
          jar.updateCode(state.value)
        }, 1)

    }
})

const handleChangedEditorValue = () => {
    console.log('handleChangedEditorValue...');
    state.edited = true
}

const handleSaveEdit = (e) => {
  try {
    store.updateCurentNode(JSON.parse(jar.toString()))
  } catch (error) {
    console.error('Failed to parse JSON', {error});
  }
}

const cancelEdit = () => {
    console.log('TODO');
}

const setupEditor = () => {
  jar = CodeJar(jarEl.value, hljs.highlightElement)

  jar.onUpdate(code => {
    // @TODO maybe do something ?!?
  });
}

</script>

<template>

<div class="editor-viewer">
      <div class="editor-menu">
        <button @click="handleSaveEdit" class="button is-small is-primary" title="Apply changes">
          <span class="material-symbols-outlined">save</span>
        </button>
        <!-- <button @click="cancelEdit">Cancel</button> -->
      </div>
      <div class="language-json" ref="jarEl">
        {{ state.value }}
      </div>
    </div>

</template>


<style scoped>
.editor-viewer {
  height: calc(100% - 30px);
}
.editor-viewer textarea {
  height: 100%;
  width: 100%;
}

.editor-menu {
  position: absolute;
  z-index: 1;
  right: 0;
  top: -24px;
}
</style>