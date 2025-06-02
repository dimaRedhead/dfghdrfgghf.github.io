const axios = require('axios');
const qs = require('qs');
const uuid = require('uuid');
const https = require('https');
axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });


const authToken = 'OGRiODQyOTgtODU2ZC00MDhlLTkzMDgtNDY0YTQ3MjA3NDYzOjZkMjc3ZTU4LWNhODQtNGExNS05ZWM3LTg5YjU4ZWE4NzNmMw==';

async function getToken(authToken, scope = 'GIGACHAT_API_PERS') {
  try {
    const rqUid = uuid.v4();

    const url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'RqUID': rqUid,
      'Authorization': `Basic ${authToken}`,
    };

    const payload = {
      scope,
    };

    const response = await axios.post(
      url,
      qs.stringify(payload),
      { headers }
    );

    if (!response || !response.data) {
      throw new Error('Не удалось получить данные от сервера');
    }

    return response.data;
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    return -1;
  }
}


async function getChatCompletion(authToken, userMessage) {
  try {
    const url = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

    const payload = {
      model: 'GigaChat',
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 1,
      top_p: 0.1,
      n: 1,
      stream: false,
      max_tokens: 512,
      repetition_penalty: 1,
      update_interval: 0,
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    };

    const response = await axios.post(url, payload, { headers });

    return response.data;
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    return -1;
  }
}


module.exports = {
    getChatCompletion,getToken
};




