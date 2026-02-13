const firebaseConfig = {
  apiKey: "AIzaSyArfIujmtA2sv6M7Mjpew1I0L1oQbtjeoA",
  authDomain: "his-academy-portal.firebaseapp.com",
  projectId: "his-academy-portal",
  storageBucket: "his-academy-portal.firebasestorage.app",
  messagingSenderId: "731331595717",
  appId: "1:731331595717:web:b755343506f885f6efcfac"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      const email = result.user.email;
      checkAccess(email);
    })
    .catch((error) => {
      alert(error.message);
    });
}

function checkAccess(email) {
  db.collection("users").doc(email).get()
    .then((doc) => {
      if (doc.exists && doc.data().paid === true) {
        showDashboard();
      } else {
        alert("Access Denied. Please Purchase Course.");
      }
    });
}

function showDashboard() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("class-time").innerText =
    "Today's Class: 6:00 PM - 7:30 PM";

  document.getElementById("video-frame").src =
    "https://www.youtube.com/embed/dQw4w9WgXcQ";
}


