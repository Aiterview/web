/**
 * Serviço de cache para armazenar perguntas geradas
 * Este cache está desabilitado para garantir que cada sessão seja única
 */

interface CacheEntry {
  questions: string[];
  timestamp: number;
  jobType: string;
  requirements: string;
}

const CACHE_KEY = 'aiterview_questions_cache';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

export const questionsCache = {
  /**
   * Armazenar perguntas no cache - desabilitado
   */
  setQuestions(jobType: string, requirements: string, questions: string[]): void {
    // Cache desabilitado - cada sessão é única
    console.log('Cache de perguntas desabilitado');
    return;
  },
  
  /**
   * Obter perguntas do cache - desabilitado
   */
  getQuestions(jobType: string, requirements: string): string[] | null {
    // Cache desabilitado - cada sessão é única
    return null;
  },
  
  /**
   * Limpar todo o cache
   */
  clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
    console.log('Cache de perguntas limpo');
  },
  
  /**
   * Remover uma entrada específica do cache
   */
  removeEntry(cacheKey: string): void {
    // Cache desabilitado - nada a fazer
    return;
  },
  
  /**
   * Obter todas as entradas do cache
   */
  getAllCacheEntries(): Record<string, CacheEntry> {
    return {};
  },
  
  /**
   * Gerar chave única para o cache
   */
  generateCacheKey(jobType: string, requirements: string): string {
    return '';
  },
  
  /**
   * Verificar se uma entrada do cache ainda é válida
   */
  isEntryValid(entry: CacheEntry): boolean {
    return false;
  },
  
  /**
   * Limpar entradas expiradas do cache
   */
  cleanExpiredEntries(): void {
    // Cache desabilitado - nada a fazer
    return;
  }
};

export default questionsCache; 