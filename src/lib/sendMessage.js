const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export function isEmailConfigured() {
  return Boolean(serviceId && templateId && publicKey)
}

export async function sendMessage({ name, email, message }) {
  if (!isEmailConfigured()) throw new Error('The message form is not connected yet. Please use the email link instead.')
  let response
  try {
    response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: name,
          reply_to: email,
          message,
          subject: `Portfolio message from ${name}`,
        },
      }),
    })
  } catch {
    throw new Error('The message could not reach the mail service. Please check your connection and try again, or use the email link.')
  }
  if (!response.ok) {
    throw new Error('The message could not be sent. Please try again or use the email link.')
  }
}
