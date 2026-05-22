/**
 * Warstwa budowania promptu — publiczne API.
 *
 * Konsumenci (warstwa LLM w Fazie 3, endpoint API w Fazie 5) korzystają
 * wyłącznie z `buildPrompt`. Pojedyncze funkcje `compose*` pozostają
 * wewnętrzne dla modułu.
 */

export { buildPrompt, TEMPERATURE_BY_PROFILE } from "./buildPrompt";
export type { BuiltPrompt } from "./buildPrompt";
