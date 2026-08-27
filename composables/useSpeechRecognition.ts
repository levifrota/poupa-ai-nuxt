import { ref, onUnmounted } from "vue";

interface MinimalSpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

type SpeechRecognitionCtor = new () => MinimalSpeechRecognition;

/**
 * Wrapper reativo em cima da Web Speech API (SpeechRecognition) para
 * reconhecimento de voz. Retorna `isSupported = false` em navegadores sem
 * suporte (ex: SSR ou Firefox) — o componente que consome deve esconder a UI
 * de voz nesse caso.
 */
export function useSpeechRecognition(lang = "pt-BR") {
  const isSupported = ref(false);
  const isListening = ref(false);
  const transcript = ref("");
  const error = ref<string | null>(null);

  let recognition: MinimalSpeechRecognition | null = null;

  if (typeof window !== "undefined") {
    const SpeechRecognitionImpl: SpeechRecognitionCtor | undefined =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor })
        .webkitSpeechRecognition;

    if (SpeechRecognitionImpl) {
      isSupported.value = true;
      recognition = new SpeechRecognitionImpl();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const lastResultIndex = Object.keys(event.results).length - 1;
        transcript.value = event.results[lastResultIndex][0].transcript;
      };

      recognition.onerror = (event) => {
        error.value = event.error;
        isListening.value = false;
      };

      recognition.onend = () => {
        isListening.value = false;
      };
    }
  }

  function start() {
    if (!recognition || isListening.value) {
      return;
    }
    error.value = null;
    transcript.value = "";
    isListening.value = true;
    recognition.start();
  }

  function stop() {
    recognition?.stop();
  }

  onUnmounted(() => {
    recognition?.stop();
  });

  return { isSupported, isListening, transcript, error, start, stop };
}
