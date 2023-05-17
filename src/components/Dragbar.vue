<script setup>
let browserWidth = 0
let browserScrollLeftPos = 0


const onDragStart = (e) => {

  browserScrollLeftPos = document.querySelector(".browser-wrapper").scrollLeft
  e.dataTransfer.setDragImage(document.createElement("img"), 0, 0);
}

const onDrag = (e) => {
  browserWidth = document.querySelector(".browser-wrapper").clientWidth

  if (browserWidth != browserWidth+e.offsetX
    && browserWidth+e.offsetX > 0
  ) {
    document.querySelector("#jsonld-browser").style.gridTemplateColumns = `${browserWidth+e.offsetX}px 0px auto`
    document.querySelector(".browser-wrapper").scrollLeft = browserScrollLeftPos
  }
}

const onDragEnd = () => {
}

</script>

<template>

  <div class="dragbar" draggable="true"
        @dragstart="onDragStart"
        @drag="onDrag"
        @dragend="onDragEnd()"
  ></div>

</template>