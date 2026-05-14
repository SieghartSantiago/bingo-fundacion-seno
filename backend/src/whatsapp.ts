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
            name: 'aviso_pago_cuota',
            language: {
              code: 'es_AR',
            },
            components: [
              {
                type: 'header',
                parameters: [
                  {
                    type: 'text',
                    text: '1023',
                  },
                ],
              },
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: 'Santiago',
                  },
                  {
                    type: 'text',
                    text: 's',
                  },
                  {
                    type: 'text',
                    text: 's',
                  },
                  {
                    type: 'text',
                    text: '1023',
                  },
                ],
              },
            ],
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
