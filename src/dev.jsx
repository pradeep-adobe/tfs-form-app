import { render } from './mount.jsx'

// Sample spec mirroring what the EDS block / UE extension pass in.
const sampleSpec = {
  title: 'Contact us',
  submitLabel: 'Send message',
  fields: [
    { type: 'text', label: 'Full name', name: 'fullName', required: true },
    { type: 'email', label: 'Email', name: 'email', required: true },
    { type: 'tel', label: 'Phone', name: 'phone' },
    {
      type: 'select', label: 'Topic', name: 'topic', options: ['Sales', 'Support', 'Other'],
    },
    {
      type: 'radio', label: 'Preferred contact', name: 'contact', options: ['Email', 'Phone'],
    },
    { type: 'textarea', label: 'Message', name: 'message', placeholder: 'How can we help?' },
    { type: 'checkbox', label: 'Subscribe to updates', name: 'subscribe' },
  ],
}

render(document.getElementById('root'), sampleSpec)
