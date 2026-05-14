import { Router } from 'express'

const accessToken: string | undefined = process.env.META_ACCESS_TOKEN
const phoneNumberId: string = '1184914281360815'

const router = Router()

export async function enviarMensajeWhatsApp(numBingo: string, telefono: string, nombre: string, cuotasPlural: boolean): Promise<void> {
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
          to: telefono.slice(1), // número destino
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
                    text: numBingo,
                  },
                ],
              },
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: nombre,
                  },
                  {
                    type: 'text',
                    text: cuotasPlural ? 's' : '',
                  },
                  {
                    type: 'text',
                    text: cuotasPlural ? 's' : '',
                  },
                  {
                    type: 'text',
                    text: numBingo,
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

router.get('/webhook', (req, res) => {
  const verifyToken = 'sniudghaiuosdbnfafaeoifnI'

  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (
    mode === 'subscribe' &&
    token === verifyToken
  ) {
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
})

export default router
