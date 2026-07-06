import React from 'react'
import { createRoot } from 'react-dom/client'
import TFSForm from './TFSForm.jsx'
import { injectStyles } from './styles.js'

// Tracks a React root per host element so re-renders reuse the same root and
// unmounting is clean. WeakMap avoids leaking when host elements are removed.
const roots = new WeakMap()

/**
 * Render (or re-render) the TFS form into a host element.
 * @param {HTMLElement} element host element provided by the consumer
 * @param {object} spec { title, submitLabel, fields: [...] }
 */
export function render(element, spec) {
  if (!element) throw new Error('[tfs-form-app] render() requires a host element')
  injectStyles(element.ownerDocument || document)
  let root = roots.get(element)
  if (!root) {
    root = createRoot(element)
    roots.set(element, root)
  }
  root.render(<TFSForm spec={spec} />)
  return root
}

/**
 * Unmount a previously rendered form and release its root.
 * @param {HTMLElement} element host element
 */
export function unmount(element) {
  const root = roots.get(element)
  if (root) {
    root.unmount()
    roots.delete(element)
  }
}

// Expose as a global for non-module consumers (EDS block, UE extension page).
if (typeof window !== 'undefined') {
  window.TFSForm = { render, unmount }
}
