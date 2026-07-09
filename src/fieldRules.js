function getActiveRules(rules) {
  if (!rules || typeof rules !== 'object') return null
  if (rules.enabled === false) return null

  const conditions = (Array.isArray(rules.conditions) ? rules.conditions : [])
    .filter((condition) => condition?.field)
    .map((condition) => ({
      field: condition.field,
      operator: condition.operator || 'equals',
      value: condition.value ?? '',
    }))

  if (!conditions.length) return null

  return {
    action: rules.action === 'hide' ? 'hide' : 'show',
    match: rules.match === 'any' ? 'any' : 'all',
    conditions,
  }
}

function getFieldValue(values, fieldName) {
  const value = values?.[fieldName]
  if (value === undefined || value === null) return ''
  if (Array.isArray(value)) return String(value[0] ?? '')
  if (typeof value === 'boolean') return value ? 'on' : ''
  return String(value)
}

function evaluateCondition(condition, values) {
  const actual = getFieldValue(values, condition.field)
  const expected = condition.value ?? ''

  switch (condition.operator) {
    case 'equals':
      return actual === expected
    case 'notEquals':
      return actual !== expected
    case 'contains':
      return actual.toLowerCase().includes(String(expected).toLowerCase())
    case 'isEmpty':
      return actual === ''
    case 'isNotEmpty':
      return actual !== ''
    case 'checked':
      return actual === 'on' || actual === 'true' || actual === true
    case 'notChecked':
      return !(actual === 'on' || actual === 'true' || actual === true)
    default:
      return false
  }
}

export function isFieldVisible(field, values) {
  const rules = getActiveRules(field.rules)
  if (!rules) return true

  const results = rules.conditions.map((condition) => evaluateCondition(condition, values))
  const matched = rules.match === 'any'
    ? results.some(Boolean)
    : results.every(Boolean)

  return rules.action === 'hide' ? !matched : matched
}
