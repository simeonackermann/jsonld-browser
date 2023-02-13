<script setup>
import { reactive, inject, ref } from 'vue'
import {
    getNodeLabel,
    getUrlBasename,
} from '../lib/utils.js'
import { modelHasResource } from "../lib/store";
import IconNode from './icons/IconNode.vue'
import IconEdge from './icons/IconEdge.vue'

// const globalJSONGraph = inject('globalJSON')

const props = defineProps(
    {
        node: {
            type: [Object, Array],
            required: true
        },
        // json: {
        //     type: Object,
        //     required: true
        // }
        path: {
            type: Array,
            // required: true
        },
        currentSelectedPath: {
            type: Array,
            required: true
        },
    }
)

const emit = defineEmits(['onItemSelected'])

const state = reactive({
    collapsed: false,
    selected: false
})

// const nodeRef = ref(null)

// console.log("BrowserItem.vue, node: ", props.node, ' path: ', props.path, ' currentSelectedPath: ', props.currentSelectedPath);

const handleClickEdge = () => {
    state.selected = true
    onSelectItem(props.path, props.node)
}

const handleClickNode = () => {
    state.selected = true
    onSelectItem(props.path, props.node)
}

const handleClickChildItem = (path, node) => {
    onSelectItem(path, node)
}

const onSelectItem = (path, node) => {
    // console.log('Node.vue, click item', path, node);
    emit('onItemSelected', path, node)
}

const toggleCollapsed = (e) => {
    state.collapsed = !state.collapsed
    e.stopPropagation();
}

const getEdges = (node) => {
    if (!node.hasOwnProperty('@id')) return []

    let edges = Object.keys(node)
        .filter(k => {
            if (Array.isArray(node[k])) {
                // return node[k].filter(i => node[k][i]['@id'])
                if (node[k][0].hasOwnProperty('@id')) {
                    // TODO may subnode in framed only has @id
                    //      may differntiate betweeen framed/extended ?!
                    if (Object.keys(node[k][0]).length > 1) return true

                    return modelHasResource(node[k][0]['@id'])
                } else {
                    return false
                }
            }
            else if (node[k] !== null && typeof node[k] == 'object') {
                return node[k].hasOwnProperty('@id')
            }
            else return false
            // return typeof node[k] !== 'string'
        })
        // .map(k => {
        //     return { [k]: node[k] }
        // })
        .reduce((res, key) => {
            // console.log('Array.isArray node[key]', Array.isArray(node[key]));
            if (Array.isArray(node[key])) {
                return (res[key] = node[key], res)
            } else {
                return (res[key] = [node[key]], res)
            }

        }, {})

    return edges
}
const edges = getEdges(props.node)

// if (Object.keys(edges).length) {
//     console.log('Node.vue, edges: ', edges);
// }

const isCurrentSelected = () => {
    // console.log('BrowserItem.vue', props.currentSelectedPath);
    return props.currentSelectedPath.toString() == props.path.toString()
}

// const getUrlBasename = (url) => {
//     return url.substring(url.lastIndexOf('/')+1)
// }

const getPathForDom = () => {
    const path = props.path.map(a => getUrlBasename(a))
    return encodeURIComponent(path)
}

</script>


<template>

    <!-- TODO framed edges: {{ edges }} -->

    <!-- Edge-Item  -->
    <div class="item edge" v-if="Array.isArray(node)" :data-path="getPathForDom()">
        <!-- Edge of {{  node }} ... -->
        <div class="title-wrapper" v-bind:class="{'active': isCurrentSelected() }" @click="handleClickEdge">
            <span>
                <i class="arrow down" v-show="!state.collapsed" @click="toggleCollapsed"></i>
                <i class="arrow right" v-show="state.collapsed" @click="toggleCollapsed"></i>
            </span>
            <!-- <IconEdge /> -->
            <span class="title">{{ getUrlBasename(path.at(-1)) }}</span>
            <span v-if="state.collapsed">[{{ node.length}}]</span>
        </div>
        <div class="item-wrapper node-wrapper" v-show="!state.collapsed" v-for="targetItem in node">
            <!-- {{ targetNode }} -->
            <browser-item
                v-if="targetItem['@id']"
                :node="targetItem"
                :path="path.concat(targetItem['@id'])"
                :current-selected-path="currentSelectedPath"
                @on-item-selected="handleClickChildItem" />
            <div v-else>[undefined target]</div>
        </div>
    </div>

    <!-- Node-Item -->
    <div class="item node" v-else-if="node['@id']" :data-path="getPathForDom()">
        <div class="title-wrapper" v-bind:class="{'active': isCurrentSelected() }" @click="handleClickNode">
            <span v-if="Object.keys(edges).length">
                <i class="arrow down" v-show="!state.collapsed" @click="toggleCollapsed"></i>
                <i class="arrow right" v-show="state.collapsed" @click="toggleCollapsed"></i>
            </span>
            <!-- TODO align docs with/without edges to same left margin -->
            <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <IconNode />
            <span class="title">{{ getNodeLabel(node) }}</span>
            <span class="type" v-if="node['@type']">
                ({{ getUrlBasename(node['@type']) }})
            </span>
            <span v-if="state.collapsed">[{{ Object.keys(edges).length}}]</span>
        </div>
        <!-- Edges of Node-Item -->
        <div class="item-wrapper node-wrapper" v-show="!state.collapsed" v-for="(targetdNodesArr, edgeKey, i) in edges">
            <browser-item
                :node="targetdNodesArr"
                :path="path.concat(edgeKey)"
                :current-selected-path="currentSelectedPath"
                @on-item-selected="handleClickChildItem"
            />
        </div>
    </div>

    <div v-else>
        [Undefined model type]
    </div>

</template>

<style scoped>
/* .node.hasEdges {
    padding-bottom: .2rem;
 } */
/*.edge > .node-wrapper {
    padding-bottom: .2rem;
}

.node > .node-wrapper {
    padding-bottom: .2rem;
} */
.node, .edge {
    padding-bottom: .2rem;
}

.title-wrapper {
    /* margin: .2rem 0; */
    margin-left: -6px;
    padding-left: 2px;
    white-space: nowrap;

    display:table;
}

.title-wrapper:hover {
    cursor: pointer;
}

.title-wrapper:not(.active):hover {
    background: #e5e5e5
}

.title-wrapper svg {
    height: 13px;
    width: auto;
    margin: 0 0 -1px 4px;
    color: gray;
}

.title-wrapper.active {
    background: lightgray;
    /* border-top-left-radius: 5px; */
}

.active span:last-child {}

.title-wrapper span {
    display: table-cell;
    vertical-align:middle;
    margin-top: 0px;
    top: 0;
}
.title-wrapper span:last-child {
}

.title-wrapper span:not(.title) {
    color: #ababab;
}

.title {
    padding: 0 .3rem;
    max-width: 200px;;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.type {
    max-width: 200px;;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-wrapper {
    padding-left: 1em;
    border-left: 1px solid transparent;
    /* border-left: 1px solid lightgray; */
    transition: border-left .5s;
}
</style>

<style>
.browser-wrapper:hover .item-wrapper {
    border-left: 1px solid lightgray;
}
</style>