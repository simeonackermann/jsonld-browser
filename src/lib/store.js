
import data from "../assets/data/test-data.json"


const prepareModel = (json) => {

  const hasId = (d) => {
    if (!d['@id']) {
      console.warn('Object in JSON-LD Model does not has property "@id"', d);
      return false
    }
    return true
  }

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

const context = data.hasOwnProperty('@context')
  ? Object.assign({}, data['@context'])
  : null
const model = prepareModel(data)

export function getModel() {
  return model
}

export function getContext() {
  return context
  // return data.hasOwnProperty('@context')
  //   ? data['@context']
  //   : null
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