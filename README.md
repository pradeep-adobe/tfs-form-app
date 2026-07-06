# tfs-form-app

React microfrontend that renders TFS forms. It is consumed by:

- the **EDS form block** in `poc-tfs-form` (`http://localhost:3000`)
- the **Universal Editor extension** `ue-form-extension` (`https://localhost:9080`)

Both load a single bundle and call a global API:

```js
window.TFSForm.render(hostElement, spec)
window.TFSForm.unmount(hostElement)
```

## Spec shape

```js
{
  title: 'Contact us',          // optional heading
  submitLabel: 'Submit',        // used when no explicit submit field exists
  fields: [
    { type: 'text', label: 'Full name', name: 'fullName', required: true },
    { type: 'select', label: 'Topic', options: ['Sales', 'Support'] },
    // types: text | email | number | tel | date | textarea | select | radio | checkbox | submit
  ],
}
```

`options` accepts an array of strings (or `{ label, value }` objects).

## Local development

Install dependencies:

```bash
npm install
```

Run the microfrontend the way consumers use it (build in watch mode + HTTPS static server on port 3001):

```bash
npm run dev
```

This serves `https://localhost:3001/tfs-form.iife.js`.

> The server reuses the self-signed cert in `certs/` (same cert as the
> `ue-form-extension`). Trust it once in your browser by visiting
> `https://localhost:3001/tfs-form.iife.js` and accepting the certificate.

### Standalone demo

```bash
npm run dev:standalone
```

Opens a Vite dev server (port 3002) rendering a sample spec from `src/dev.jsx`.

## Configuration

The URL consumers use is centralized:

- EDS: `poc-tfs-form/blocks/form/form-config.js`
- Extension: `ue-form-extension/src/config.js`

Change `scriptUrl` there when deploying to a real environment.
