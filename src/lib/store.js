import { reactive } from 'vue'

const store = reactive({

    context: null,

    model: null,

    currentPath: [],

    currentNode: null,

    editPath: [],

    getModel() {
        return this.model
    },

    /**
     *
     * @param {JSON} json
     * @returns
     */
    setModel(json) {
        if (typeof json !== 'object') return false

        const prepare = () => {
            if (Array.isArray(json)) {
                //

            }
            else if (typeof json === 'object') {
                if (json['@graph'])
                json = json['@graph']
                else
                json = [json]
            } else {
                return false
            }

            // if (!hasId(json[0])) return false

            if (json[0]['@context']) {
                // TODO may show @context elsewhere in the Viewer?!
                delete json[0]['@context']
                // json[0]['@context'] = false
            }

            return json
        }


        this.context = json.hasOwnProperty('@context')
            ? Object.assign({}, json['@context'])
            : null
        this.model = prepare(json)

        return this.model
    },

    getNode(path) {
        if (this.model === null || !path.length) return null

        console.log('getCurrentNode', {model: this.model, path: path} );

        const findNode = (model, path) => {
            if (!path.length || !model) return null

            // console.log('findNode', {model: JSON.parse(JSON.stringify(model)), path: path[0]});

            let node = undefined

            if (Array.isArray(model)) {
                node = model.find(l => l['@id'] == path[0] )
            }
            // else if (typeof model === 'object' && model.hasOwnProperty(['@id'])) {
            //     node = model['@id'] == path[0]
            // }
            else if (typeof model === 'object') {
                node = model.hasOwnProperty(path[0])
                    ? Array.isArray(model[path[0]]) ? model[path[0]] : [model[path[0]]]
                    : undefined
            }
            else {
                return null
            }


            if (typeof node === 'undefined') return null

            return path.length > 1
                ? findNode(node, path.slice(1))
                : node
        }

        let currentNode = findNode(this.model, path)
        console.log('currentNode', currentNode);


        // return this.model.find(l => l['@id'] == this.currentPath[0] )
        return currentNode

    },


    updateCurentNode(newNode) {
        return this.updateNode(this.currentPath, newNode)
    },

    updateNode(path, newNode) {
        if (!path.length || !newNode || typeof newNode !== 'object') return null

        console.log('Store.updateNode', {path, json: newNode});
        this.editPath = path
        // console.log( this.getNode(path) );

        const updateAt = (model, path) => {
            if (!model || !path.length) return undefined
            const cp = path[0]

            // find cp in model
            // return model + updateAt(path.slice(1))

            if (Array.isArray(model)) {
                const mi = model.findIndex(l => l['@id'] == cp)
                if (mi > -1) {
                    console.log('Model is Array, found i', {mi, model});
                    model[mi] = path.length > 1 ? updateAt(model[mi], path.slice(1)) : newNode
                }
            }
            else if (typeof model === 'object'
                && model.hasOwnProperty('@id')
                && model['@id'] == cp
            ) {
                console.log('Model is object and has @ID', {cp, model});
                model = path.length > 1
                    ? updateAt(model, path.slice(1))
                    : newNode

            }
            else if (typeof model === 'object'
                && model.hasOwnProperty(cp)
            ) {
                console.log('Model is object and has Prop', {cp, model});
                model[cp] = path.length > 1
                    // ? updateAt(Array.isArray(model[cp]) ? model[cp] : [model[cp]], path.slice(1))
                    ? updateAt(model[cp], path.slice(1))
                    : newNode
            }

            else {
                // return undefined
                console.error('Undefined Model or not found!', {path, model});
            }

            return model
        }

        const findNode = (model, path, value) => {
            model[0] = value
            return model[0]
        }
        const findNode_ = (model, path) => {
            let node = undefined

            if (Array.isArray(model)) {
                node = model.find(l => l['@id'] == path[0] )
            }
            // else if (typeof model === 'object' && model.hasOwnProperty(['@id'])) {
            //     node = model['@id'] == path[0]
            // }
            else if (typeof model === 'object') {
                node = model.hasOwnProperty(path[0])
                    ? Array.isArray(model[path[0]]) ? model[path[0]] : [model[path[0]]]
                    : undefined
            }
            else {
                return null
            }
            if (typeof node === 'undefined') return null
            return path.length > 1
                ? findNode(node, path.slice(1))
                : node
        }

        // let node = findNode(this.model, path, newNode)
        // this.model[0] = json
        // const newModel = updateAt(JSON.parse(JSON.stringify(this.model)), path)
        const newModel = updateAt(this.model, path)
        console.log('Store.updateNode', {newModel: JSON.parse(JSON.stringify(newModel))});
        this.model = newModel.slice()
        console.log('TODO if currentNode is part of newNode/Model -> update ...');

        if (this.currentPath.length === path.length && this.currentPath.every((v, i) => v === path[i])) {
            this.currentNode = newNode
        }



        // this.model[0] = json
        // let node = this.getNode(path)
        // node = json

    },


    // setCurrent(path, node) {
    //     this.currentPath = path
    //     this.currentNode = node
    //     // this.setCurrentPath(path)
    //     // this.setCurrentNode(node)
    // },

    // setCurrentPath(path) {
    //     this.currentPath = path
    // },

    // setCurrentNode(node) {
    //     this.currentNode = node
    // }

    getResourceFromModel(id) {
        if (this.model === null) return false
        return this.model.find(l => l['@id'] == id )
    },

    modelHasResource(id) {
        return this.getResourceFromModel(id) ? true : false

    }




})

export default store

// export const getModel = () => {
//     return store.model
// }


// export default {
//     setup() {
//       const state = reactive({ count: 0 })

//       function increment() {
//         state.count++
//       }

//       // don't forget to expose the function as well.
//       return {
//         state,
//         increment
//       }
//     }
//   }

// export const store = reactive({

//     count: 0,

//     increment() {
//       this.count++
//     }

// })