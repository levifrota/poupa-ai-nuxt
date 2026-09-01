/**
 * Plugin client-side para Google Analytics (gtag.js).
 *
 * Carrega o script do Google Analytics SOMENTE se o usuário consentiu
 * com cookies de analytics (LGPD). Reage dinamicamente a mudanças
 * no consentimento via evento `cookie-consent-changed`.
 *
 * Utiliza o measurementId do Firebase (GA4) configurado em runtimeConfig.
 */
import { useCookieConsent } from "~/composables/useCookieConsent";

// Extend Window to include gtag and dataLayer
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown> | unknown[]>;
    gtag: (...args: unknown[]) => void;
  }
}

let gtagLoaded = false;
let measurementId = "";

/**
 * Inicializa o gtag stub (dataLayer + função gtag) sem carregar o script.
 * Isso garante que chamadas a gtag() antes do carregamento sejam enfileiradas.
 */
function initGtagStub(): void {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
}

/**
 * Carrega o script gtag.js e configura com o measurementId.
 * Só carrega uma vez; chamadas subsequentes são ignoradas.
 */
function loadGtagScript(): void {
  if (gtagLoaded || !measurementId) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    // Desabilita envio automático de page_view — fazemos manualmente
    // no watcher do router para SPA navigation
    send_page_view: false,
    // Anonimiza IP (boa prática de privacidade, embora GA4 já faça por padrão)
    anonymize_ip: true,
  });

  gtagLoaded = true;
}

/**
 * Desabilita o tracking do Google Analytics via propriedade global.
 * Não remove o script (já carregado), mas impede envio de dados.
 */
function disableGtag(): void {
  if (!measurementId) return;
  // Propriedade oficial do Google para desabilitar tracking
  (window as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
}

/**
 * Reabilita o tracking caso tenha sido desabilitado.
 */
function enableGtag(): void {
  if (!measurementId) return;
  (window as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
}

/**
 * Envia um page_view para o Google Analytics.
 */
function trackPageView(path: string, title: string): void {
  if (!gtagLoaded || !measurementId) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
  });
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  measurementId = config.public.firebaseMeasurementId as string;

  if (!measurementId) {
    console.warn(
      "[Analytics] VITE_FIREBASE_MEASUREMENT_ID não configurado. Google Analytics desabilitado."
    );
    return;
  }

  const { isAllowed } = useCookieConsent();

  // Inicializa o stub para enfileirar eventos
  initGtagStub();

  // Carrega o script se já existe consentimento de analytics
  if (isAllowed("analytics")) {
    loadGtagScript();
  } else {
    // Garante que tracking está desabilitado por padrão
    disableGtag();
  }

  // Escuta mudanças no consentimento (quando o usuário interage com o banner)
  window.addEventListener("cookie-consent-changed", ((
    event: CustomEvent
  ) => {
    const preferences = event.detail;
    if (preferences.analytics) {
      enableGtag();
      loadGtagScript();
    } else {
      disableGtag();
    }
  }) as EventListener);

  // Rastreia page views em navegação SPA
  const router = useRouter();
  router.afterEach((to) => {
    if (isAllowed("analytics")) {
      // Pequeno delay para garantir que o título da página atualizou
      nextTick(() => {
        trackPageView(to.fullPath, document.title);
      });
    }
  });

  // Expõe helpers para uso em outros locais do app
  return {
    provide: {
      analytics: {
        /**
         * Envia um evento customizado para o Google Analytics.
         * Só envia se analytics estiver consentido.
         *
         * @example
         * const { $analytics } = useNuxtApp()
         * $analytics.trackEvent('button_click', { button_id: 'cta_signup' })
         */
        trackEvent(
          eventName: string,
          params?: Record<string, unknown>
        ): void {
          if (!isAllowed("analytics") || !gtagLoaded) return;
          window.gtag("event", eventName, params);
        },

        /**
         * Identifica o usuário no GA (sem dados pessoais, apenas UID).
         * Só executa se analytics estiver consentido.
         */
        setUserId(userId: string): void {
          if (!isAllowed("analytics") || !gtagLoaded) return;
          window.gtag("config", measurementId, { user_id: userId });
        },

        /** Verifica se o analytics está ativo. */
        isActive(): boolean {
          return gtagLoaded && isAllowed("analytics");
        },
      },
    },
  };
});

