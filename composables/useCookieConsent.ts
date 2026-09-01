import { ref, computed } from "vue";

export interface CookiePreferences {
  /** Cookies essenciais para funcionamento do app (sempre ativo) */
  essential: true;
  /** Cookies de analytics (Google Analytics / Firebase) */
  analytics: boolean;
  /** Cookies de funcionalidade (preferências do usuário, tema, etc.) */
  functionality: boolean;
}

export interface CookieConsentState {
  /** Se o usuário já fez uma escolha */
  hasConsented: boolean;
  /** Preferências escolhidas */
  preferences: CookiePreferences;
  /** Timestamp ISO 8601 do consentimento (LGPD Art. 8° — registro do consentimento) */
  consentedAt: string | null;
  /** Versão da política no momento do consentimento */
  policyVersion: string;
}

const STORAGE_KEY = "poupa-ai-cookie-consent";
const POLICY_VERSION = "1.0.0";

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  functionality: false,
};

function loadState(): CookieConsentState {
  if (typeof window === "undefined") {
    return {
      hasConsented: false,
      preferences: { ...DEFAULT_PREFERENCES },
      consentedAt: null,
      policyVersion: POLICY_VERSION,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CookieConsentState;
      // Garante que cookies essenciais estejam sempre ativos
      parsed.preferences.essential = true;
      return parsed;
    }
  } catch {
    // localStorage corrompido — trata como sem consentimento
  }

  return {
    hasConsented: false,
    preferences: { ...DEFAULT_PREFERENCES },
    consentedAt: null,
    policyVersion: POLICY_VERSION,
  };
}

function persistState(state: CookieConsentState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silenciar erros de cota do localStorage
  }
}

function emitConsentEvent(preferences: CookiePreferences): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("cookie-consent-changed", { detail: preferences })
  );
}

// Estado reativo global (singleton por instância do app)
const state = ref<CookieConsentState>(loadState());

export function useCookieConsent() {
  const hasConsented = computed(() => state.value.hasConsented);
  const preferences = computed(() => state.value.preferences);
  const consentedAt = computed(() => state.value.consentedAt);
  const showBanner = computed(() => !state.value.hasConsented);

  /**
   * Aceita todos os tipos de cookies.
   */
  function acceptAll(): void {
    state.value = {
      hasConsented: true,
      preferences: {
        essential: true,
        analytics: true,
        functionality: true,
      },
      consentedAt: new Date().toISOString(),
      policyVersion: POLICY_VERSION,
    };
    persistState(state.value);
    emitConsentEvent(state.value.preferences);
  }

  /**
   * Aceita apenas cookies essenciais (rejeita analytics e funcionalidade).
   */
  function rejectNonEssential(): void {
    state.value = {
      hasConsented: true,
      preferences: {
        essential: true,
        analytics: false,
        functionality: false,
      },
      consentedAt: new Date().toISOString(),
      policyVersion: POLICY_VERSION,
    };
    persistState(state.value);
    emitConsentEvent(state.value.preferences);
  }

  /**
   * Salva preferências personalizadas.
   */
  function savePreferences(prefs: Partial<Omit<CookiePreferences, "essential">>): void {
    state.value = {
      hasConsented: true,
      preferences: {
        essential: true,
        analytics: prefs.analytics ?? false,
        functionality: prefs.functionality ?? false,
      },
      consentedAt: new Date().toISOString(),
      policyVersion: POLICY_VERSION,
    };
    persistState(state.value);
    emitConsentEvent(state.value.preferences);
  }

  /**
   * Revoga o consentimento (LGPD Art. 8°, §5° — direito de revogar).
   * Reabre o banner para nova escolha.
   */
  function revokeConsent(): void {
    state.value = {
      hasConsented: false,
      preferences: { ...DEFAULT_PREFERENCES },
      consentedAt: null,
      policyVersion: POLICY_VERSION,
    };
    persistState(state.value);
    emitConsentEvent(state.value.preferences);
  }

  /**
   * Verifica se um tipo específico de cookie foi consentido.
   */
  function isAllowed(type: keyof CookiePreferences): boolean {
    if (type === "essential") return true;
    return state.value.hasConsented && state.value.preferences[type];
  }

  return {
    hasConsented,
    preferences,
    consentedAt,
    showBanner,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    revokeConsent,
    isAllowed,
  };
}

