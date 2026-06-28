import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY = "BOy6JXqZ8wfaZWLukevf-kfHvfOlEjGzssuP-sDFxRtAkTkypq0lQJYKk85A3RNd2SdFM0wXti4AElI5rges4H4";

export async function solicitarPermissaoNotificacao() {
  console.log("🚀 solicitarPermissaoNotificacao foi chamada");

  try {
    const permission = await Notification.requestPermission();

    console.log("Permissão recebida:", permission);

    if (permission !== "granted") {
      console.log("Permissão negada.");
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

export function escutarMensagens() {
  onMessage(messaging, (payload) => {
    console.log("📩 Mensagem recebida:", payload);

    const title = payload.notification?.title || "Agenda MP";
    const body = payload.notification?.body || "";

    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body: body,
        icon: "/logo192.png",
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } else {
      console.warn("Notificação não permitida");
    }
  });
}