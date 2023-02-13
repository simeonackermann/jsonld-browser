
export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export function getValueOf(resource, sep = "/") {
  // TODO add param for:  get all or first or with language or index x ???
  if (Array.isArray(resource)) {
    return resource.map(p => p['@value'] ? p['@value'] : p).join(sep)
  }
  else if (isObject(resource) && resource.hasOwnProperty('@value')) {
    return resource['@value']
  }
  else {
    return resource
  }

}

export function getUrlBasename(url, glue = "/") {
  // Regex to find last word
  const regex = /([^\/#]+)\/?$/g
  const getName = (s) => s.substring(s.search(regex))

  if (Array.isArray(url)) {
    return url.map(s => getName(s)).join(glue)
  }
  return getName(url)
}


export function getNodeLabel(node) {
  const titleProps = [
      'http://www.w3.org/2000/01/rdf-schema#label',
      'label',
      'http://purl.org/dc/terms/title',
      'title',
      'http://schema.org/name',
      'name',
  ]

  const labelProp = Object.keys(node).find(a => titleProps.includes(a))
  return labelProp
      ? getValueOf(node[labelProp])
      : getUrlBasename(node['@id'])
}

