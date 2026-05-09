import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

/**
 * Configuración principal de IA
 */
export const ai = genkit({

  /**
   * Plugins disponibles
   */
  plugins: [

    /**
     * Plugin Gemini
     */
    googleAI()
  ],

  /**
   * Modelo por defecto
   */
  model: googleAI.model('gemini-2.5-flash')
});