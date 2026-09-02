import { ref, onUnmounted } from "vue";

/**
 * Wrapper reativo em cima da Web Speech API (SpeechSynthesis) para leitura de
 * texto em voz alta (text-to-speech). `isSupported = false` em navegadores/SSR
 * sem suporte — a UI que consome deve esconder o botão de leitura nesse caso.
 */
export function useSpeechSynthesis(lang = "pt-BR") {
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const isSpeaking = ref(false);

  function speak(text: string) {
    if (!isSupported || !text) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => {
      isSpeaking.value = true;
    };
    utterance.onend = () => {
      isSpeaking.value = false;
    };
    utterance.onerror = () => {
      isSpeaking.value = false;
    };
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    if (!isSupported) {
      return;
    }
    window.speechSynthesis.cancel();
    isSpeaking.value = false;
  }

  // Evita que uma fala em andamento continue (ou fique "presa") após o
  // componente que a iniciou ser desmontado.
  onUnmounted(() => {
    stop();
  });

  return { isSupported, isSpeaking, speak, stop };
}
