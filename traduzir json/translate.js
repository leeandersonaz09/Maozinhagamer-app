const axios = require('axios');
const fs = require('fs');

// Sua chave de API do DeepL
const apiKey = '936a7fdb-9b23-48b7-bb06-0c1dc2e1a6a1:fx';

// Função para traduzir o texto usando a API do DeepL
const translateText = async (text, targetLang = 'PT') => {
  try {
    const response = await axios.post('https://api-free.deepl.com/v2/translate', null, {
      params: {
        auth_key: apiKey,
        text: text,
        target_lang: targetLang,
      },
    });

    return response.data.translations[0].text;
  } catch (error) {
    console.error('Erro ao traduzir:', error);
    return text; // Retorna o texto original em caso de erro
  }
};

// Função para traduzir o JSON
const translateJson = async () => {
  try {
    const data = JSON.parse(fs.readFileSync('modules_data.json', 'utf8'));
    const keysToTranslate = ['Module Name', 'Module Type'];

    // Traduz as chaves especificadas
    for (const item of data) {
      for (const key of keysToTranslate) {
        if (item[key]) {
          item[key] = await translateText(item[key], 'PT'); // Traduz para português
        }
      }
    }

    // Salva o arquivo JSON traduzido
    fs.writeFileSync('translated_modules_data.json', JSON.stringify(data, null, 2));
    console.log('Tradução concluída!');
  } catch (error) {
    console.error('Erro ao processar o arquivo JSON:', error);
  }
};

// Chama a função de tradução
translateJson();
