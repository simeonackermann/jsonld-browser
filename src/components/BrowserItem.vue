<script setup>
import { reactive } from 'vue'
import {
    getNodeLabel,
    getUrlBasename,
    getNodeType
} from '../lib/utils.js'
import { modelHasResource } from "../lib/store";
import IconNode from './icons/IconNode.vue'
import IconNodeLinked from './icons/IconNodeLinked.vue'
// import IconEdge from './icons/IconEdge.vue'

const props = defineProps(
    {
        node: {
            type: [Object, Array],
            required: true
        },
        path: {
            type: Array,
            // required: true
        },
        currentSelectedPath: {
            type: Array,
            required: true
        },
        depth: {
            type: Number,
            required: true,
            // default: 1
        },
        isBlanknode: {
            type: Boolean,
            required: false,
            default: false
        }
    }
)

const emit = defineEmits(['onItemSelected'])

const state = reactive({
    collapsed: false,
    selected: false
})

const handleClickEdge = (e) => {
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

const isCurrentSelected = () => {
    return props.currentSelectedPath.toString() == props.path.toString()
}

const getPathForDom = () => {
    const path = props.path.map(a => getUrlBasename(a))
    return encodeURIComponent(path)
}

</script>


<template>

    <!-- EDGE-ITEM  -->
    <div v-if="Array.isArray(node)" class="item edge" v-bind:class="{'selected': isCurrentSelected() }" :data-path="getPathForDom()">
        <div class="active-area" @click="handleClickEdge"></div>
        <div class="title-wrapper">
            <span class="toggler">
                <i class="arrow down" v-show="!state.collapsed" @click="toggleCollapsed"></i>
                <i class="arrow right" v-show="state.collapsed" @click="toggleCollapsed"></i>
            </span>
            <!-- <IconEdge /> -->
            <span class="title">{{ getUrlBasename(path.at(-1)) }}</span>
            <span v-if="state.collapsed">[{{ node.length}}]</span>
        </div>
        <div class="item-wrapper node-wrapper" v-show="!state.collapsed" v-for="targetItem in node">
            <browser-item
                v-if="targetItem['@id']"
                :node="targetItem"
                :path="path.concat(targetItem['@id'])"
                :current-selected-path="currentSelectedPath"
                :depth="depth + 1"
                @on-item-selected="handleClickChildItem" />
            <div v-else>[undefined target]</div>
        </div>
    </div>

    <!-- NODE-ITEM -->
    <div v-else-if="node['@id'] || isBlanknode"
        class="item node"
        v-bind:class="{'selected': isCurrentSelected(), 'blanknode': isBlanknode}"
        :data-path="getPathForDom()"
        >
        <!-- :title="node['@id']" -->
        <div class="active-area" @click="handleClickNode"></div>
        <div class="title-wrapper">
            <span class="toggler" v-if="Object.keys(edges).length">
                <i class="arrow down" v-show="!state.collapsed" @click="toggleCollapsed"></i>
                <i class="arrow right" v-show="state.collapsed" @click="toggleCollapsed"></i>
            </span>
            <IconNodeLinked v-if="!isBlanknode && !node['@type'] && modelHasResource(node['@id'])" />
            <IconNode v-else />
            <span class="title" title="Foo">{{ getNodeLabel(node) }}</span>
            {{ (nodeType = getNodeType(node), null) }}
            <span class="type" v-if="nodeType">
                ({{ nodeType }})
            </span>
            <span v-if="state.collapsed">[{{ Object.keys(edges).length}}]</span>
        </div>
        <!-- Edges of Node-Item -->
        <div class="item-wrapper node-wrapper" v-show="!state.collapsed" v-for="(targetdNodesArr, edgeKey, i) in edges">
            <browser-item
                :node="targetdNodesArr"
                :path="path.concat(edgeKey)"
                :current-selected-path="currentSelectedPath"
                :depth="depth + 1"
                @on-item-selected="handleClickChildItem"
            />
        </div>
    </div>

    <div v-else>
        [Undefined model type]
    </div>

</template>

<style scoped>
.active-area {
    width: calc(100% + (1em * v-bind('depth')));
    height: 24px;
    /* border: 1px solid lightblue; */
    display: block;
    position: absolute;
    left: calc(v-bind('depth') * 1em * -1);

    /* border: 1px solid transparent; */
    /* transition: border 0.2s ease-out; */
}
.active-area:hover {
    background: #e0e0e04b;
    /* background: lightblue; */
    cursor: pointer;
}
/* .active-area:active {
    border: 1px solid lightblue;
} */

.title-wrapper {
    /* margin: .2rem 0; */
    margin-left: -6px;
    padding-left: 2px;
    white-space: nowrap;
    display:table;
    pointer-events: none;
    /* padding-left: calc(var(--depth) * 0.2rem); */
    /* padding-left: calc(v-bind('depth') * 0.5rem); */
}

/* .title-wrapper:hover {
    cursor: pointer;
    pointer-events: none;
} */

.title-wrapper:not(:has(> .toggler)) {
    padding-left: 14px;
}

.item.selected > .active-area {
    /* background: #e0e0e086; */
    /* background: #288FB8; */
    background: #09739db5;
}

.item.selected > .title-wrapper .toggler i,
.item.selected > .title-wrapper svg,
.item.selected > .title-wrapper .title,
.item.selected > .title-wrapper span
 {
    color: #ebebeb;
}

.item.selected > .title-wrapper span:not(.title)
 {
    color: #dfdfdf;
}

.item.selected > .title-wrapper .toggler i {
    border-color: #ebebeb;
}

.title-wrapper:not(.active):hover {
    /* background: #e5e5e5 */
}

.title-wrapper svg {
    height: 13px;
    width: auto;
    margin: 0 0 -1px 4px;
    color: gray;
}

.title-wrapper.active {
    /* background: lightgray; */
}

.active span:last-child {}

.title-wrapper span {
    display: table-cell;
    vertical-align:middle;
    margin-top: 0px;
    top: 0;
    /* pointer-events: none; */
}
/* .title-wrapper .toggler {
    pointer-events: auto;
} */
.title-wrapper span:last-child {
}

.title-wrapper span:not(.title) {
    color: #ababab;
}

/* .left-border {
    border-left: 1px solid grey;
} */

.title {
    padding: 0 .3rem;
    max-width: 200px;;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
Q666002892-1
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