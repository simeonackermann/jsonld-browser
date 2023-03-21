let context = null
let model = null

export async function fetchLocalData(file) {
  let data = null

  try {
      data = await import (file)
  } catch (error) {
      return Promise.reject(error)
  }

  if (data && data.default) {
      context = data.default.hasOwnProperty('@context')
          ? Object.assign({}, data['@context'])
          : null
      model = prepareModel(data.default)
      return Promise.resolve(model)
  }

  return Promise.reject(`Got bad JSON data "${data}" from file "${file}".`)
}


export async function fetchData(file) {

  const res = await fetch(file)
  return await res.json()
}

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

export function getModel() {
    return model
  }

export function getContext() {
    return context
    // return data.hasOwnProperty('@context')
    //   ? data['@context']
    //   : null
}

export function getResourceFromModel(path) {
    if (model === null) return false
    return model.find(l => l['@id'] == path )
  }

  export function modelHasResource(id) {
    return getResourceFromModel(id) ? true : false
  }