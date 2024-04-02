import { fastify } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { createEvent } from './routes/create-event.js';

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)

app.listen({
  port: 3333
}).then(() => {
  console.log('server iniciado com sucesso')
})