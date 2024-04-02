import { fastify, FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { generateSlug } from '../utils/generate-slug.js'
import { ZodTypeProvider } from "fastify-type-provider-zod"

export async function createEvent(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>()
  .post('/events', {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
      }),
      response:{
        201: z.object({
          eventId: z.string().uuid()
        })
      }
  }, 
}, async (request, reply) => {
    const { title, details, maximumAttendees } = request.body

    const slug = generateSlug(title)

    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug,
      }
    })

    if(eventWithSameSlug != null) {
  throw new Error('Event already exists!')
}

const event = await prisma.event.create({
  data: {
    title,
    details,
    maximumAttendees,
    slug,
  },
})
return { eventId: event.id }
})
}

