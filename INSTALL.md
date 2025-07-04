
# 📦 Instalação e Execução — Mãozinha Gamer

Este guia ensina como baixar, configurar e executar localmente o app **Mãozinha Gamer**, desenvolvido com **React Native + Expo**.

---

## 🔧 Requisitos

Antes de começar, instale os seguintes itens em sua máquina:

### ✅ 1. Node.js

- Baixe do site oficial: https://nodejs.org/
- Recomendado: versão LTS

Verifique se está instalado:
```bash
node -v
```

---

### ✅ 2. Git

- Baixe do site oficial: https://git-scm.com/

Verifique se está instalado:
```bash
git --version
```

---

### ✅ 3. Expo CLI

Expo é a ferramenta que facilita o desenvolvimento com React Native.

Instale globalmente:
```bash
npm install -g expo-cli
```

Verifique se está funcionando:
```bash
expo --version
```

> 📘 Precisa de ajuda? Consulte a [documentação oficial do Expo](https://docs.expo.dev/get-started/installation/)

---

## 📥 Clonando o Repositório

Clone o projeto com o comando:

```bash
git clone https://github.com/SEU_USUARIO/MaozinhaGamerApp.git
```

Depois, acesse a pasta do projeto:

```bash
cd MaozinhaGamerApp
```

---

## 📦 Instalando as Dependências

Com o terminal dentro da pasta do projeto, execute:

```bash
npm install
```

> Ou use `yarn install` se preferir Yarn.

---

## 🔐 Configuração do Firebase

Antes de rodar o app, você precisa configurar o Firebase.

1. Crie o arquivo:

```
src/config/firebase.js
```

2. Cole o modelo abaixo e preencha com os dados do seu projeto Firebase:

```javascript
export default {
  apiKey: "<SUA_API_KEY>",
  authDomain: "<SEU_AUTH_DOMAIN>",
  projectId: "<SEU_PROJECT_ID>",
  storageBucket: "<SEU_STORAGE_BUCKET>",
  messagingSenderId: "<SEU_MESSAGING_SENDER_ID>",
  appId: "<SEU_APP_ID>"
};
```

Acesse: https://console.firebase.google.com/ para gerar esses dados.

---

## ▶️ Executando o Projeto

Com tudo configurado, execute:

```bash
npm start
# ou
expo start
```

O navegador será aberto com o **Expo DevTools**.

No celular, instale o app **Expo Go**:

- [📲 Android – Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [📲 iOS – App Store](https://apps.apple.com/app/expo-go/id982107779)

Depois, escaneie o QR Code exibido no navegador para rodar o app.

---

## 💻 Executando em Emulador Android

1. Instale o [Android Studio](https://developer.android.com/studio)
2. Crie e inicie um AVD (Android Virtual Device)
3. Com o emulador aberto, execute:

```bash
npm run android
```

> Alternativamente, você pode rodar no navegador com:
```bash
npm run web
```

---

## 🧪 Testes

Para rodar os testes automatizados:

```bash
npm test
```

---

## 🧼 Limpando o Projeto (opcional)

Se precisar limpar cache e reiniciar tudo:

```bash
npm run reset-project
```

> Esse script executa a limpeza de `node_modules`, `yarn.lock`, cache do Expo e reinicia o bundler.

---

## ❓ Problemas Comuns

### "Expo Go travando ou não abrindo?"

- Verifique se o Firebase está corretamente configurado
- Execute `expo r -c` para limpar cache
- Reinicie o app e escaneie o QR code novamente

---

## 🔗 Links Úteis

- 📘 [Documentação do Expo](https://docs.expo.dev/)
- 🧩 [Expo CLI Referência](https://docs.expo.dev/workflow/expo-cli/)
- 🛠️ [Configuração Firebase](https://firebase.google.com/)
- 🧠 [React Native](https://reactnative.dev/)
- 💬 [Fórum da Comunidade Expo](https://forums.expo.dev/)

---

Feito com ❤️ por **Mãozinha Gamer**
