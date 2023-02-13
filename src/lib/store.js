
import data from '../assets/data/json-framed.json'
// import data from "../assets/data/test-data-extended.json";


// import { inject } from 'vue'
// const globalJSONGraph = inject('globalJSON')

const prepareModel = (json) => {

  const hasId = (d) => {
    if (!d['@id']) {
      console.warn('JSON-LD Model does not has property "@id"', d);
      return false
    }
    return true
  }

  if (Array.isArray(json)) {
    if (!hasId(json[0])) return false

  }
  else if (typeof json === 'object') {
    if (json['@graph'])
      json = json['@graph']
    else
      json = [json]
    if (!hasId(json[0])) return false
  } else {
    return false
  }

  return json
}

const model = prepareModel(data)

export function getModel() {
  return model
}

// let foo = 'Foobar'

// export function setFoo(val) {
//   console.log('foo', foo);
//   foo = val
// }

export function getResourceFromModel(path) {
  // console.log('JSON-LD MODEL', model);
  return model.find(l => l['@id'] == path )
}

export function modelHasResource(id) {
  // console.log('modelHasResource', id);
  return getResourceFromModel(id) ? true : false
}