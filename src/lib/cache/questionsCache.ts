/**
 * Serviço de cache para armazenar perguntas geradas
 * Usa localStorage para persistir entre sessões
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
   * Armazenar perguntas no cache
   */
  setQuestions(jobType: string, requirements: string, questions: string[]): void {
    try {
      // Obter cache atual
      const currentCache = this.getAllCacheEntries();
      
      // Criar nova entrada
      const cacheKey = this.generateCacheKey(jobType, requirements);
      const cacheEntry: CacheEntry = {
        questions,
        timestamp: Date.now(),
        jobType,
        requirements
      };
      
      // Adicionar ao cache
      currentCache[cacheKey] = cacheEntry;
      
      // Salvar cache atualizado
      localStorage.setItem(CACHE_KEY, JSON.stringify(currentCache));
      
      console.log('Perguntas salvas no cache:', cacheKey);
    } catch (error) {
      console.error('Erro ao salvar perguntas no cache:', error);
    }
  },
  
  /**
   * Obter perguntas do cache
   */
  getQuestions(jobType: string, requirements: string): string[] | null {
    try {
      const cacheKey = this.generateCacheKey(jobType, requirements);
      const cache = this.getAllCacheEntries();
      
      const entry = cache[cacheKey];
      
      // Verificar se existe uma entrada válida
      if (entry && this.isEntryValid(entry)) {
        console.log('Perguntas encontradas no cache:', cacheKey);
        return entry.questions;
      }
      
      // Remover entrada expirada se existir
      if (entry) {
        console.log('Cache expirado para:', cacheKey);
        this.removeEntry(cacheKey);
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter perguntas do cache:', error);
      return null;
    }
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
    try {
      const cache = this.getAllCacheEntries();
      
      if (cache[cacheKey]) {
        delete cache[cacheKey];
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        console.log('Entrada removida do cache:', cacheKey);
      }
    } catch (error) {
      console.error('Erro ao remover entrada do cache:', error);
    }
  },
  
  /**
   * Obter todas as entradas do cache
   */
  getAllCacheEntries(): Record<string, CacheEntry> {
    try {
      const cacheData = localStorage.getItem(CACHE_KEY);
      return cacheData ? JSON.parse(cacheData) : {};
    } catch (error) {
      console.error('Erro ao ler cache:', error);
      return {};
    }
  },
  
  /**
   * Gerar chave única para o cache
   */
  generateCacheKey(jobType: string, requirements: string): string {
    // Usar versão simplificada dos parâmetros para chave
    const normalizedJobType = jobType.toLowerCase().trim();
    const normalizedRequirements = requirements.toLowerCase().trim();
    
    return `${normalizedJobType}:${normalizedRequirements}`;
  },
  
  /**
   * Verificar se uma entrada do cache ainda é válida
   */
  isEntryValid(entry: CacheEntry): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < CACHE_EXPIRATION;
  },
  
  /**
   * Limpar entradas expiradas do cache
   */
  cleanExpiredEntries(): void {
    try {
      const cache = this.getAllCacheEntries();
      let hasExpired = false;
      
      // Verificar cada entrada
      Object.keys(cache).forEach(key => {
        if (!this.isEntryValid(cache[key])) {
          delete cache[key];
          hasExpired = true;
        }
      });
      
      // Salvar se houve alterações
      if (hasExpired) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        console.log('Entradas expiradas removidas do cache');
      }
    } catch (error) {
      console.error('Erro ao limpar entradas expiradas:', error);
    }
  }
};

// Limpar entradas expiradas ao carregar
questionsCache.cleanExpiredEntries();

export default questionsCache; 