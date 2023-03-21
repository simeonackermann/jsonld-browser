<script setup>
let browserWidth = 0
let browserScrollLeftPos = 0


const onDragStart = (e) => {
  // browserWidth = document.querySelector(".browser-wrapper").clientWidth
  // console.log('dragstart..., browser scroll pos: ', browserWidth);

  browserScrollLeftPos = document.querySelector(".browser-wrapper").scrollLeft

  // var crt = this.cloneNode(true);
  // crt.style.backgroundColor = "red";

  // remoge drag&drop shadow
  // var img = document.createElement("img");
  e.dataTransfer.setDragImage(document.createElement("img"), 0, 0);
}

const onDrag = (e) => {
  browserWidth = document.querySelector(".browser-wrapper").clientWidth
  // console.log('drag...', browserWidth, e.offsetX);
  // const plus
  // if ((!lasOffsetX || lasOffsetX != e.offsetX)) {
  //   lasOffsetX = e.offsetX
  //   console.log('lasOffsetX', lasOffsetX);
  //   console.log('new browser widsth:', browserWidth+lasOffsetX);
  //   // document.querySelector("#app").style.gridTemplateColumns = `${browserWidth+lasOffsetX}px 5px auto`
  // }

  if (browserWidth != browserWidth+e.offsetX) {
    document.querySelector("#app").style.gridTemplateColumns = `${browserWidth+e.offsetX}px 0px auto`
    document.querySelector(".browser-wrapper").scrollLeft = browserScrollLeftPos
  }


}

const onDragEnd = () => {
  // console.log('dragend...');
}

// document.addEventListener("resize", function( event ) {
//   console.log('document resize...');
// }, false);
</script>

<template>

<div class="dragbar" draggable="true"
      @dragstart="onDragStart"
      @drag="onDrag"
      @dragend="onDragEnd()"
    ></div>

</template>