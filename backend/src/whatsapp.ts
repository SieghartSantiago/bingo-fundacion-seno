const accessToken: string | undefined = process.env.META_ACCESS_TOKEN
const phoneNumberId: string = '1184914281360815'

export async function enviarMensajeWhatsApp(): Promise<void> {
  try {
    const response: Response = await fetch(
      `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: '542995468452', // número destino
          type: 'template',
          template: {
            name: 'hello_world',
            language: {
              code: 'en_US',
            },
          },
        }),
      },
    )

    const data = await response.json()

    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

enviarMensajeWhatsApp()
