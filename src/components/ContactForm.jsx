import { useState } from 'react'
import { Send } from 'lucide-react'
import useReducedMotion from '../hooks/useReducedMotion.js'
import LetterSend from '../three/LetterSend.jsx'
import { contact } from '../data/contact.js'
import { isEmailConfigured, sendMessage } from '../lib/sendMessage.js'

const initialValues = { name: '', email: '', message: '', company: '' }
const cooldownKey = 'post-office-last-message-at'
const cooldownMs = 30_000

function validateField(field, value) {
  const clean = value.trim()
  if (field === 'name') {
    if (!clean) return 'Please enter your name.'
    if (clean.length < 2 || clean.length > 80) return 'Your name must be 2–80 characters.'
  }
  if (field === 'email') {
    if (!clean) return 'Please enter your email address.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) return 'Enter a valid email address.'
  }
  if (field === 'message') {
    if (!clean) return 'Please write a message.'
    if (clean.length < 10 || clean.length > 2000) return 'Your message must be 10–2,000 characters.'
  }
  return ''
}

function mailtoLink(values) {
  const subject = `Portfolio message from ${values.name.trim() || 'a visitor'}`
  const body = `${values.message.trim()}\n\nReply to: ${values.email.trim()}`
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [delivered, setDelivered] = useState(false)
  const [letterFinished, setLetterFinished] = useState(false)
  const reducedMotion = useReducedMotion()
  const emailConfigured = isEmailConfigured()
  const errors = Object.fromEntries(['name', 'email', 'message'].map((field) => [field, validateField(field, values[field])]))

  const change = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    if (status === 'error') { setStatus('idle'); setStatusMessage('') }
  }
  const blur = (event) => setTouched((current) => ({ ...current, [event.target.name]: true }))

  const submit = async (event) => {
    event.preventDefault()
    const allTouched = { name: true, email: true, message: true }
    setTouched(allTouched)
    const invalid = ['name', 'email', 'message'].find((field) => validateField(field, values[field]))
    if (invalid) {
      setStatus('error')
      setStatusMessage('Please check the highlighted fields and try again.')
      document.getElementById(`contact-${invalid}`)?.focus()
      return
    }
    if (values.company.trim()) {
      // Quietly acknowledge bot submissions without sending or revealing the honeypot.
      setStatus('success')
      setStatusMessage(contact.success)
      return
    }
    let lastSend = 0
    try { lastSend = Number(localStorage.getItem(cooldownKey) || 0) } catch { /* Storage may be unavailable. */ }
    const remaining = cooldownMs - (Date.now() - lastSend)
    if (lastSend && remaining > 0) {
      setStatus('error')
      setStatusMessage(`Please wait ${Math.ceil(remaining / 1000)} seconds before sending another letter.`)
      return
    }

    try { localStorage.setItem(cooldownKey, String(Date.now())) } catch { /* The in-memory request still works. */ }
    setStatus('sending')
    setStatusMessage('Your letter is on its way to the counter.')
    try {
      await sendMessage({ name: values.name.trim(), email: values.email.trim(), message: values.message.trim() })
      setValues(initialValues)
      setTouched({})
      setStatus('success')
      setStatusMessage('')
      setLetterFinished(false)
      setDelivered(true)
      if (reducedMotion) setLetterFinished(true)
    } catch (error) {
      setStatus('error')
      setStatusMessage(error?.message || 'The message could not be sent. Please try again or use the email link.')
    }
  }

  return <div className="contact-form-wrap">
    <form className="contact-form" onSubmit={submit} noValidate>
      <p className="eyebrow">A NOTE FOR THE NEXT STOP</p>
      <h2>Write a letter.</h2>
      <div className="contact-form__field">
        <label htmlFor="contact-name">{contact.form.nameLabel}</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={80} value={values.name} onChange={change} onBlur={blur} aria-invalid={Boolean(touched.name && errors.name)} aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined} />
        {touched.name && errors.name && <small id="contact-name-error" className="contact-form__error">{errors.name}</small>}
      </div>
      <div className="contact-form__field">
        <label htmlFor="contact-email">{contact.form.emailLabel}</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={change} onBlur={blur} aria-invalid={Boolean(touched.email && errors.email)} aria-describedby={touched.email && errors.email ? 'contact-email-error' : undefined} />
        {touched.email && errors.email && <small id="contact-email-error" className="contact-form__error">{errors.email}</small>}
      </div>
      <div className="contact-form__field">
        <label htmlFor="contact-message">{contact.form.messageLabel}</label>
        <textarea id="contact-message" name="message" rows="6" minLength={10} maxLength={2000} value={values.message} onChange={change} onBlur={blur} aria-invalid={Boolean(touched.message && errors.message)} aria-describedby={`contact-message-count${touched.message && errors.message ? ' contact-message-error' : ''}`} />
        <div className="contact-form__field-foot"><small id="contact-message-count" aria-live="polite">{values.message.length} / 2,000</small>{touched.message && errors.message && <small id="contact-message-error" className="contact-form__error">{errors.message}</small>}</div>
      </div>
      <div className="contact-form__honeypot" aria-hidden="true"><label htmlFor="contact-company">Leave this field empty</label><input id="contact-company" name="company" type="text" tabIndex="-1" autoComplete="off" value={values.company} onChange={change} /></div>
      <button className="contact-form__submit" type="submit" disabled={status === 'sending'}><span>{status === 'sending' ? contact.form.sendingLabel : contact.form.submitLabel}</span><Send size={15} aria-hidden="true" /></button>
      {!emailConfigured && <p className="contact-form__setup-note">The message form is awaiting its EmailJS setup. You can still send a letter using the email link.</p>}
      <div className={`contact-form__status contact-form__status--${status}`} role="status" aria-live="polite">
        {statusMessage && <p>{statusMessage}</p>}
        {status === 'error' && <a href={mailtoLink(values)}>OPEN A PREFILLED EMAIL</a>}
      </div>
      {delivered && <div className="contact-success">
        <LetterSend active={!letterFinished} reducedMotion={reducedMotion} onComplete={() => setLetterFinished(true)} />
        {letterFinished && <p className="contact-success__message" role="status" aria-live="polite">{contact.success}</p>}
      </div>}
    </form>
  </div>
}
