
export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export function isNonemptyObject(obj) {
  return isObject(obj) && Object.keys(obj).length
}

export function getValueOf(resource, sep = "/") {
  // TODO add param for:  get all or first or with language or index x ???
  if (Array.isArray(resource)) {
    return resource.map(p => p['@value'] ? p['@value'] : p).join(sep)
  }
  else if (isObject(resource) && resource.hasOwnProperty('@value')) {
    return resource['@value']
  }
  else if (isObject(resource)) {
    return resource
  }
  else {
    return resource
  }

}

export function getUrlBasename(url, glue = "/") {
  // Regex to find last word in URL
  const regex = /([^\/#:]+)\/?$/g
  const getName = (s) => s.substring(s.search(regex))

  if (!url) return null

  if (Array.isArray(url)) {
    return url.map(s => getName(s)).join(glue)
  }

  return getName(url)
}


export function getNodeLabel(node) {
  // const titleProps = [
  //     'http://www.w3.org/2000/01/rdf-schema#label',
  //     'label',
  //     'http://purl.org/dc/terms/title',
  //     'http://purl.org/dc/elements/1.1/title',
  //     'title',
  //     'http://schema.org/name',
  //     'name',
  // ]
  const titleProps = ['label', 'title', 'name']

  // const labelProp = Object.keys(node).find(a => titleProps.includes(a))

  const labelProp = Object.keys(node).find(a => titleProps.includes(getUrlBasename(a)))

  return labelProp
      ? getValueOf(node[labelProp])
      : getUrlBasename(node['@id'])
}

export function getNodeType(node) {
  const type = node['@type'] || node['type']

  return type ? getUrlBasename(type) : null
}