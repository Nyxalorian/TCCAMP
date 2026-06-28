importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBdIu1RE64VLwQ5WqqcDfrWc9tZrEfF0Mc",
  authDomain: "pharmalife-81306.web.app",
  projectId: "pharmalife-81306",
  storageBucket: "pharmalife-81306.firebasestorage.app",
  messagingSenderId: "1059789863146",
  appId: "1:1059789863146:web:11b4ab6c8771e019dd3f93",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Mensagem recebida:", payload);

  const title = payload.data?.title || "Agenda MP";
  const body = payload.data?.body || "";

  self.registration.showNotification(title, {
    body: body,
    icon: "https://pharmalife-81306.web.app/favicon.png",
    badge: "https://pharmalife-81306.web.app/favicon.png"
  });
});