# Guía de Supervivencia: RAG Assistant (Coatl Lab)

Este documento detalla los cambios, configuraciones y el proceso seguido para transformar el repositorio original en un sistema funcional con soporte para Android/Web.

## 1. Configuración de Infraestructura (Firebase)
- **Proyecto**: `coatl-rag-lab-5b3fd`
- **Plan**: Blaze (Activado para soportar Functions v2 y Secret Manager).
- **Secretos**: Se configuró la clave `GOOGLE_GENAI_API_KEY` utilizando Firebase Secret Manager para evitar exponerla en el código.
- **Base de Datos**: Cloud Firestore habilitado.

## 2. El Pivot a Web App (Android Compatibility)
Dado que no se disponía de Xcode para la versión de iOS, creamos una **Web App** desde cero:
- **Tecnología**: Vite + React + TypeScript.
- **Diseño**: Implementamos el estilo **Liquid Glass** usando CSS puro (Vanilla CSS).
    - Fondos animados con **Mesh Gradients**.
    - Efectos de desenfoque (backdrop-filter) para las tarjetas.
    - Tipografía moderna (Inter) y paleta de colores vibrante (Purple/Pink/Blue).
- **Conectividad**: La web está configurada para llamar directamente a la Cloud Function de Firebase.

## 3. Backend (Cloud Functions v2)
- **RAG Flow**: El backend lee la colección `menus` de Firestore, construye un prompt aumentado y lo envía a **Gemini 2.5 Flash**.
- **Seguridad**: Se habilitó CORS para permitir llamadas desde el dominio de la web app.

## 4. Estado Actual
- [x] Backend compilado y dependencias instaladas.
- [x] Secretos configurados.
- [x] Frontend Web desarrollado e iniciado (`http://localhost:5173`).
- [/] Despliegue de funciones en proceso (resolviendo tiempos de espera iniciales de Google Cloud).

## Comandos Útiles
### Ver la Web App
```bash
cd RAGAssistantWeb
npm run dev
```

### Desplegar Cambios en el Backend
```bash
firebase deploy --only functions
```

### Ver Logs de la IA
```bash
firebase functions:log
```
