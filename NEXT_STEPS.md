# Estado del Proyecto y Siguientes Pasos 📋

Este documento detalla el progreso actual, las tareas pendientes y un análisis estimado de costos para mantener la infraestructura de **Coatl RAG Assistant**.

## ✅ Lo que ya hicimos
1.  **Migración de Plataforma**: Pasamos de una app nativa iOS (SwiftUI) a una **Web App (Vite + React)** para compatibilidad universal con Android.
2.  **Infraestructura Cloud**:
    - Configuración de proyecto Firebase en Plan Blaze.
    - Despliegue exitoso de **Cloud Functions v2** con Node.js 20.
    - Integración de **Secret Manager** para proteger la API Key de Gemini.
3.  **Diseño Premium**: Implementación de una interfaz "Liquid Glass" con fondos Mesh Gradient animados.
4.  **Lógica RAG**: El backend ya está preparado para leer menús de Firestore y generar respuestas con contexto usando **Gemini 2.5 Flash**.

## 🚧 Lo que falta (Próximos Pasos)
1.  **Habilitar Acceso Público**: La función está desplegada pero protegida (403 Forbidden). Para que la Web App funcione, se debe ejecutar:
    ```bash
    gcloud run services add-iam-policy-binding askai --member="allUsers" --role="roles/run.invoker" --region="us-central1"
    ```
2.  **Carga de Datos (Seeding)**: Es necesario poblar la colección `menus` en Firestore con los platillos reales. (Dejamos un script `seed.js` de referencia).
3.  **Despliegue de Hosting**: Actualmente la web corre en `localhost`. El siguiente paso es subirla a Firebase Hosting:
    ```bash
    firebase deploy --only hosting
    ```
4.  **Dominio Personalizado**: Configurar un dominio (ej. `asistente.coatl.tech`) en la consola de Firebase.

## 💰 Análisis Estimado de Costos (Plan Blaze)
Firebase tiene un nivel gratuito muy generoso. Para un uso de laboratorio/demo, los costos serán cercanos a **$0 USD**, pero aquí están los detalles:

| Servicio | Nivel Gratuito (Mensual) | Costo Excedente (Estimado) |
| :--- | :--- | :--- |
| **Cloud Functions** | 2 millones de invocaciones | ~$0.40 por millón adicional |
| **Gemini 2.5 Flash** | ~15 RPM (Gratis en AI Studio) | ~$0.30 por 1M tokens de entrada |
| **Firestore** | 50,000 lecturas / día | $0.06 por cada 100,000 |
| **Secret Manager** | No tiene (en este uso) | $0.06 por secreto activo / mes |
| **Artifact Registry** | 0.5 GB de almacenamiento | ~$0.10 por GB / mes |

**Resumen**: Para este demo, es probable que solo veas un cargo de unos cuantos centavos de dólar ($0.06 - $0.20) al mes por el almacenamiento de la imagen de la función y el secreto.

---
*Documentación generada para el equipo de Cóatl Tech.*
