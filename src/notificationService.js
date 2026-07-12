import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY = "BOy6JXqZ8wfaZWLukevf-kfHvfOlEjGzssuP-sDFxRtAkTkypq0lQJYKk85A3RNd2SdFM0wXti4AElI5rges4H4";
const DEFAULT_ICON = "/favicon.png";

export const NOTIFICATION_TYPES = Object.freeze({
  SYSTEM: "sistema",
  BROWSER: "browser",
});

let notificationAudioContext = null;
let browserSoundPrepared = false;

export function normalizeNotificationType(type) {
  return type === NOTIFICATION_TYPES.BROWSER
    ? NOTIFICATION_TYPES.BROWSER
    : NOTIFICATION_TYPES.SYSTEM;
}

export function getCurrentNotificationType() {
  if (typeof window === "undefined") return NOTIFICATION_TYPES.SYSTEM;

  try {
    const storedUser = JSON.parse(sessionStorage.getItem("usuario") || "null");
    return normalizeNotificationType(
      sessionStorage.getItem("notificationType") || storedUser?.tipoNotificacao
    );
  } catch {
    return normalizeNotificationType(sessionStorage.getItem("notificationType"));
  }
}

function getAudioContext() {
  if (typeof window === "undefined") return null;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  if (!notificationAudioContext) {
    notificationAudioContext = new AudioContext();
  }

  return notificationAudioContext;
}

export function prepararSomNotificacaoBrowser() {
  if (typeof window === "undefined" || browserSoundPrepared) return;

  browserSoundPrepared = true;

  const unlockAudio = () => {
    const audioContext = getAudioContext();
    if (audioContext?.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };

  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });
}

export async function tocarSomNotificacaoBrowser() {
  try {
    const audioContext = getAudioContext();
    if (!audioContext) return false;

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    const start = audioContext.currentTime;
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.15);
    gain.connect(audioContext.destination);

    [880, 660, 880].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const noteStart = start + index * 0.32;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      oscillator.connect(gain);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + 0.22);
    });

    return true;
  } catch (error) {
    console.warn("Som de notificacao pelo browser bloqueado:", error);
    return false;
  }
}

export async function garantirPermissaoNotificacao() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn("Notificacoes nao suportadas neste navegador");
    return "unsupported";
  }

  if (Notification.permission === "default") {
    return Notification.requestPermission();
  }

  return Notification.permission;
}

export async function solicitarPermissaoNotificacao() {
  console.log("solicitarPermissaoNotificacao foi chamada");

  try {
    const permission = await garantirPermissaoNotificacao();

    console.log("Permissao recebida:", permission);

    if (permission !== "granted") {
      console.log("Permissao negada.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    console.log("Token FCM:", token);

    return token;
  } catch (error) {
    console.error("Erro ao obter token:", error);
    return null;
  }
}

export async function mostrarNotificacaoLocal({ title = "PharmaLife", body = "", tag } = {}) {
  try {
    const permission = await garantirPermissaoNotificacao();

    if (permission !== "granted") {
      console.warn("Notificacao nao permitida");
      return false;
    }

    const options = {
      body,
      icon: DEFAULT_ICON,
      badge: DEFAULT_ICON,
      tag
    };

    const registration = "serviceWorker" in navigator
      ? await navigator.serviceWorker.getRegistration()
      : null;

    if (registration?.showNotification) {
      await registration.showNotification(title, options);
      return true;
    }

    const notification = new Notification(title, options);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (error) {
    console.error("Erro ao mostrar notificacao local:", error);
    return false;
  }
}

export function escutarMensagens() {
  onMessage(messaging, (payload) => {
    console.log("Mensagem recebida:", payload);

    const title = payload.notification?.title || payload.data?.title || "PharmaLife";
    const body = payload.notification?.body || payload.data?.body || "";

    if (getCurrentNotificationType() === NOTIFICATION_TYPES.BROWSER) {
      return;
    }

    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: DEFAULT_ICON,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } else {
      console.warn("Notificacao nao permitida");
    }
  });
}
