// Styles are injected once via JS so the whole microfrontend ships as a single
// file. Everything is scoped under `.tfs-form` to avoid leaking into hosts.
const STYLE_ID = 'tfs-form-app-styles'

const CSS = `
.tfs-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
  font-family: inherit;
}
.tfs-form-title {
  margin: 0;
  font-size: 1.4rem;
}
.tfs-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tfs-form-field-label {
  font-weight: 600;
  font-size: 0.9rem;
}
.tfs-form input[type='text'],
.tfs-form input[type='email'],
.tfs-form input[type='number'],
.tfs-form input[type='tel'],
.tfs-form input[type='date'],
.tfs-form select,
.tfs-form textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid var(--dark-color, #ccc);
  border-radius: 6px;
  font: inherit;
  background: var(--background-color, #fff);
  color: inherit;
}
.tfs-form textarea {
  resize: vertical;
}
.tfs-form-checkbox,
.tfs-form-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}
.tfs-form-checkbox input,
.tfs-form-radio input {
  width: auto;
}
.tfs-form-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tfs-form-submit {
  align-self: flex-start;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  background: var(--link-color, #3b63fb);
  color: #fff;
}
.tfs-form-submit:hover {
  background: var(--link-hover-color, #1d3ecf);
}
.tfs-form-status {
  margin: 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: #e7f6ec;
  color: #1b5e20;
}
.tfs-form-empty {
  margin: 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;
}
`

export function injectStyles(doc = document) {
  if (doc.getElementById(STYLE_ID)) return
  const style = doc.createElement('style')
  style.id = STYLE_ID
  style.textContent = CSS
  doc.head.appendChild(style)
}
