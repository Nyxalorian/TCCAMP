import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY = "BOy6JXqZ8wfaZWLukevf-kfHvfOlEjGzssuP-sDFxRtAkTkypq0lQJYKk85A3RNd2SdFM0wXti4AElI5rges4H4";
const DEFAULT_ICON = "/favicon.png";

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

    if (Notification.permission === "granted") {
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
