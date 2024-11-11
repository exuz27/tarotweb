const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Puerto del servidor
const { Configuration, OpenAIApi } = require('openai');

// Configura la clave API de OpenAI (toma en cuenta que esto no debería estar hardcodeado)
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY // Se toma la variable de entorno
});
const openai = new OpenAIApi(configuration);

app.use(express.json()); // Para procesar peticiones JSON

// Ruta para recibir la interpretación
app.post('/interpretar', async (req, res) => {
  // Obtener la pregunta y las cartas seleccionadas
  const pregunta = req.body.pregunta;
  const cartas = req.body.cartas;

  // Convertir los valores de las cartas a nombres (opcional)
  const cartaNombres = cartas.map(carta => {
    if (carta === '0') {
      return 'Sin carta';
    } else {
      return ['El Loco', 'El Mago', 'La Sacerdotisa', 'La Emperatriz', 'El Emperador'][carta - 1]; // Agrega más cartas a este arreglo
    }
  });

  // Generar la interpretación usando ChatGPT
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // Usa un modelo de lenguaje de OpenAI
      prompt: `Interpreta la tirada de la Cruz Celta con las cartas: ${cartaNombres.join(', ')}.\nPregunta: ${pregunta}.\nDa una interpretación detallada y precisa.`,
      max_tokens: 1000, // Ajusta el máximo de tokens según la longitud de la interpretación
      temperature: 0.7, // Ajusta la creatividad del modelo
    });
    const interpretacion = response.data.choices[0].text.trim(); // Obtén la interpretación del modelo

    res.json({ interpretacion: interpretacion }); // Devuelve la interpretación
  } catch (error) {
    console.error('Error al generar la interpretación:', error);
    res.status(500).send('Error al interpretar las cartas');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});