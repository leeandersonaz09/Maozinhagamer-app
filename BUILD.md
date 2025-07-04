
# 📦 Gerando Builds com EAS — Mãozinha Gamer

Este guia explica como gerar builds do app **Mãozinha Gamer** usando a plataforma **EAS (Expo Application Services)** para Android: tanto `.apk` quanto `.aab` (Android App Bundle).

---

## 🛠️ Requisitos

### ✅ 1. Ter o Expo CLI e EAS CLI instalados

```bash
npm install -g expo-cli eas-cli
```

Verifique a versão mínima:
```bash
eas --version
# Deve ser >= 10.0.2
```

---

## ⚙️ Configuração Inicial

### 1. Faça login no Expo

```bash
eas login
```

### 2. Configure o projeto com EAS

Se ainda não tiver feito:

```bash
eas build:configure
```

Isso criará o arquivo `eas.json` com os perfis de build.

---

## 🧪 Builds Internas (Preview)

Essas builds são indicadas para testes e distribuição interna.

### 🔹 Gerar APK para instalação direta

```bash
eas build --platform android --profile preview-apk
```

- Gera um `.apk` instalável diretamente no dispositivo
- Ideal para testar antes da publicação

### 🔹 Gerar App Bundle (.aab) para testes internos

```bash
eas build --platform android --profile preview-bundle
```

- Gera um `.aab` para upload interno no Google Play Console

---

## 🚀 Build de Produção

Para criar uma versão pronta para publicar na Play Store:

```bash
eas build --platform android --profile production
```

> O resultado será um **.aab**, que é o formato exigido pelo Google Play atualmente.

---

## 📤 Submetendo para o Google Play

Com o `eas submit`, você pode enviar direto para a Play Store (opcional).

### Pré-requisitos:

- Projeto configurado no Google Play Console
- `service-account.json` do Google

### Envio:

```bash
eas submit --platform android --profile production
```

---

## 📁 Estrutura do eas.json

Exemplo usado neste projeto:

```json
{
  "cli": {
    "version": ">= 10.0.2"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview-apk": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview-bundle": {
      "distribution": "internal",
      "android": {
        "buildType": "app-bundle"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 🔗 Links Úteis

- 📘 [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- 🧾 [Publicando na Google Play](https://docs.expo.dev/distribution/uploading-to-play-store/)
- ⚙️ [Gerando credenciais com Expo](https://docs.expo.dev/build/android-credentials/)

---

Feito com ❤️ por **Mãozinha Gamer**
