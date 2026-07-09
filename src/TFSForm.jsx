import React, { useCallback, useState } from 'react'
import { isFieldVisible } from './fieldRules.js'

function slugify(value, fallback) {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || fallback
}

function controlName(field, index) {
  return field.name || slugify(field.label, `field-${index}`)
}

function normalizeOptions(options) {
  if (!Array.isArray(options)) return []
  return options
    .map((opt) => (typeof opt === 'string' ? opt : opt?.label || opt?.value || ''))
    .filter(Boolean)
}

function FieldRow({ field, index, value, onValueChange }) {
  const {
    type = 'text', label = '', required = false, placeholder = '',
  } = field
  const name = controlName(field, index)
  const options = normalizeOptions(field.options)

  if (type === 'submit') {
    return (
      <div className="tfs-form-field">
        <button type="submit" className="tfs-form-submit">{label || 'Submit'}</button>
      </div>
    )
  }

  if (type === 'checkbox') {
    return (
      <div className="tfs-form-field">
        <label className="tfs-form-checkbox">
          <input
            type="checkbox"
            name={name}
            checked={value === 'on' || value === true}
            required={required}
            onChange={(event) => onValueChange(name, event.target.checked ? 'on' : '')}
          />
          <span>{label}{required ? ' *' : ''}</span>
        </label>
      </div>
    )
  }

  let control
  if (type === 'textarea') {
    control = (
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        required={required}
        value={value ?? ''}
        onChange={(event) => onValueChange(name, event.target.value)}
      />
    )
  } else if (type === 'select') {
    control = (
      <select
        name={name}
        required={required}
        value={value ?? ''}
        onChange={(event) => onValueChange(name, event.target.value)}
      >
        <option value="">{placeholder || 'Select…'}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    )
  } else if (type === 'radio') {
    control = (
      <div className="tfs-form-radio-group">
        {options.map((opt, i) => (
          <label key={i} className="tfs-form-radio">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              required={required && i === 0}
              onChange={(event) => onValueChange(name, event.target.value)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    )
  } else {
    control = (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value ?? ''}
        onChange={(event) => onValueChange(name, event.target.value)}
      />
    )
  }

  return (
    <div className="tfs-form-field">
      <label className="tfs-form-field-label">{label}{required ? ' *' : ''}</label>
      {control}
    </div>
  )
}

export default function TFSForm({ spec }) {
  const { title = '', submitLabel = 'Submit', fields = [] } = spec || {}
  const [status, setStatus] = useState('')
  const [values, setValues] = useState({})

  const hasSubmit = fields.some((f) => f.type === 'submit')

  const handleValueChange = useCallback((name, nextValue) => {
    setValues((current) => ({ ...current, [name]: nextValue }))
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.target).entries())
    setStatus('Thank you! Your response was recorded.')
    // eslint-disable-next-line no-console
    console.log('[tfs-form-app] submission', data)
  }

  if (!fields.length) {
    return <p className="tfs-form-empty">No form fields authored yet.</p>
  }

  return (
    <form className="tfs-form" onSubmit={handleSubmit}>
      {title ? <h2 className="tfs-form-title">{title}</h2> : null}
      {fields.map((field, index) => {
        if (!isFieldVisible(field, values)) return null
        const name = controlName(field, index)
        return (
          <FieldRow
            key={name || index}
            field={field}
            index={index}
            value={values[name] ?? ''}
            onValueChange={handleValueChange}
          />
        )
      })}
      {!hasSubmit ? (
        <button type="submit" className="tfs-form-submit">{submitLabel || 'Submit'}</button>
      ) : null}
      {status ? <p className="tfs-form-status">{status}</p> : null}
    </form>
  )
}
