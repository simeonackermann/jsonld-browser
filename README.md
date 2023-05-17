# JSON-LD Browser

Simple [JSON-LD](https://json-ld.org/) Browser. Realizes a treeview browser and details viewer to offer interactive user friendly browsing and viewing through JSON-LD data.

![](screenshot.png)

## Demo

https://simeonackermann.github.io/JSONLD-Browser-Online/


## Requirements

VueJS 3

## Usage

```js
<script>
import { JSONLDBrowser } from 'json-ld-browser'

const data = {
    ...
}
</script>
...
<template>
    <div id="jsonld-browser">
        <JSONLDBrowser :data="data" />
    </div>
</template>

```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```
<!--
### Compile and Minify for Production

```sh
npm run build
``` -->


### TODO / Tasks

- may view/integrate @context/@raph
- order properties in details view (label/name, descr, ... , edges)
- Modes: code mode (view JSON-LD code), editor mode
- navigation with keyboard (op/down/toggle) in treeview browser
- test very big json data -> vertical browser max width
