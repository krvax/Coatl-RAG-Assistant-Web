# Coatl RAG Assistant - Web Edition 🌮🤖

Este proyecto es una evolución del [RAGAssistantDemo](https://github.com/KevinhoMorales/RAGAssistantDemo) original de Kevinho Morales, adaptado y optimizado para entornos **Web y Android** como parte del laboratorio de **Cóatl Tech**.

Hemos transformado la experiencia original de iOS (SwiftUI) en una **Web App de alto rendimiento** con un diseño premium, manteniendo la potencia del backend RAG con Gemini.

## 🚀 Características principales
- **Arquitectura RAG (Retrieval-Augmented Generation)**: Utiliza Genkit para conectar Firestore con Gemini 2.5 Flash.
- **Diseño "Liquid Glass"**: Interfaz moderna con efectos de desenfoque, fondos animados (Mesh Gradients) y micro-interacciones.
- **Seguridad**: Gestión de secretos mediante Firebase Secret Manager (no hay API Keys expuestas).
- **Multiplataforma**: Compatible con cualquier navegador móvil (Android/iOS) y escritorio.

## 🏗️ Arquitectura
1.  **Frontend**: Vite + React + TypeScript (Vanilla CSS).
2.  **Backend**: Firebase Cloud Functions v2 (Node.js 20).
3.  **IA**: Google Gemini 2.5 Flash via **Genkit**.
4.  **Base de Datos**: Cloud Firestore para el almacenamiento de menús y contexto.

## 🛠️ Guía de Inicio Rápido

### Requisitos previos
- Node.js 20+
- Firebase CLI instalado
- Una cuenta de Google Cloud con el Plan Blaze activado.

### Instalación del Proyecto
```bash
git clone https://github.com/krvax/Coatl-RAG-Assistant-Web.git
cd Coatl-RAG-Assistant-Web
```

### Configuración del Backend
1.  Instala dependencias:
    ```bash
    cd functions
    npm install
    ```
2.  Configura tu API Key de Gemini:
    ```bash
    firebase functions:secrets:set GOOGLE_GENAI_API_KEY
    ```
3.  Despliega las funciones:
    ```bash
    firebase deploy --only functions
    ```

### Ejecución del Frontend
```bash
cd RAGAssistantWeb
npm install
npm run dev
```

## 📝 Notas de Implementación
- **Pivot de Diseño**: Se reemplazó SwiftUI por una arquitectura web para garantizar la compatibilidad con dispositivos Android sin necesidad de Xcode.
- **Optimización de Prompt**: El sistema recupera automáticamente los platillos desde la colección `menus` de Firestore para generar respuestas contextuales precisas.

---
*Desarrollado para el Coatl Lab por krvax, basado en el trabajo original de [KevinhoMorales](https://github.com/KevinhoMorales).*
