const express = require('express');
const path = require('path');
const { getChatCompletion, getToken} = require('./gigachat-api');
//const {  } = require('./gigachat-api');
const authToken = 'OGRiODQyOTgtODU2ZC00MDhlLTkzMDgtNDY0YTQ3MjA3NDYzOjZkMjc3ZTU4LWNhODQtNGExNS05ZWM3LTg5YjU4ZWE4NzNmMw==';
console.log(authToken);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Настройка для обслуживания статических файлов
app.use(express.static(path.join(__dirname, '')));

// Маршрут для обработки запросов к GigaChat API
app.post('/api/gigachat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Вызываем функцию getChatCompletion
        const tokenResponse = await getToken(authToken);
        if (tokenResponse === -1) {
          console.error('Не удалось получить токен.');
          return;
        }
        const gigaToken = tokenResponse.access_token;

        const result = await getChatCompletion(gigaToken, message);
        console.log(result);
        
        if (result && result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
            res.status(200).json({ response: result.choices[0].message.content });
        } else {
            res.status(400).json({ error: 'Не удалось распознать ответ' }); // Ошибка в случае, если данные отсутствуют
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});