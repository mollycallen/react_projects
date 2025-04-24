export function getDataTypeColor (datatype) {
  let color = 'secondary'
  switch (datatype) {
    case 'string':
      color = 'info'
      break
    case 'numeric':
      color = 'warning'
      break
    case 'date':
      color = 'success'
      break
    default:
      return 'secondary'
  }
  return color
}

export const DATA_TYPES = {
  STRING: 'string',
  NUMERIC: 'numeric',
  DATE: 'date'
}
