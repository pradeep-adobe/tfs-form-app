import React, { useEffect, useState } from 'react'
import { resolveFormFields } from './fragments.js'

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

function FieldRow({ field, index }) {
  const {
    type = 'text', label = '', required = false, placeholder = '',
  } = field
  const name = controlName(field, index)
  const options = normalizeOptions(field.options)

  if (type === 'fragment-pending') {
    return (
      <div className="tfs-form-field tfs-form-fragment-pending">
        Loading fragment: {field.path}…
      </div>
    )
  }

  if (type === 'fragment-error') {
    return (
      <div className="tfs-form-field tfs-form-fragment-error">
        Fragment error ({field.path || 'no path'}): {field.message}
      </div>
    )
  }

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
          <input type="checkbox" name={name} required={required} />
          <span>{label}{required ? ' *' : ''}</span>
        </label>
      </div>
    )
  }

  let control
  if (type === 'textarea') {
    control = <textarea name={name} rows={4} placeholder={placeholder} required={required} />
  } else if (type === 'select') {
    control = (
      <select name={name} required={required} defaultValue="">
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
            <input type="radio" name={name} value={opt} required={required && i === 0} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    )
  } else {
    control = <input type={type} name={name} placeholder={placeholder} required={required} />
  }

  return (
    <div className="tfs-form-field">
      <label className="tfs-form-field-label">{label}{required ? ' *' : ''}</label>
      {control}
    </div>
  )
}

function withFragmentPlaceholders(rawFields) {
  return rawFields.map((f) => (
    f.type === 'fragment' ? { type: 'fragment-pending', path: f.path } : f
  ))
}

export default function TFSForm({ spec }) {
  const { title = '', submitLabel = 'Submit', fields: rawFields = [] } = spec || {}
  const [status, setStatus] = useState('')
  const [fields, setFields] = useState(() => withFragmentPlaceholders(rawFields))

  const fieldsKey = JSON.stringify(rawFields)

  useEffect(() => {
    let cancelled = false
    setFields(withFragmentPlaceholders(rawFields))

    if (rawFields.some((f) => f.type === 'fragment')) {
      resolveFormFields(rawFields).then((resolved) => {
        if (!cancelled) setFields(resolved)
      })
    }

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsKey])

  const hasSubmit = fields.some((f) => f.type === 'submit')
  const hasFragments = rawFields.some((f) => f.type === 'fragment')

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
      {fields.map((field, index) => (
        <FieldRow key={field.name || index} field={field} index={index} />
      ))}
      {!hasSubmit ? (
        <button type="submit" className="tfs-form-submit">{submitLabel || 'Submit'}</button>
      ) : null}
      {status ? <p className="tfs-form-status">{status}</p> : null}
      {hasFragments ? (
        <details className="tfs-form-debug" open>
          <summary>Resolved form JSON (fragments expanded)</summary>
          <pre>{JSON.stringify({ title, submitLabel, fields }, null, 2)}</pre>
        </details>
      ) : null}
    </form>
  )
}
