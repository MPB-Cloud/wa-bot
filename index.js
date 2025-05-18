const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'mpb-bot' })
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('📲 Escanea este QR con tu WhatsApp Business');
});

client.on('ready', () => {
  console.log('✅ WhatsApp Web listo');
});

app.post('/send', async (req, res) => {
  try {
    const { to, body } = req.body;
    const chatId = to.replace(/\D/g, '') + '@c.us';
    await client.sendMessage(chatId, body);
    res.json({ status: 'sent' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server escuchando en puerto ${PORT}`));
client.initialize();

