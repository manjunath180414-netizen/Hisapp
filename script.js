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

// Setup Recaptcha
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  'recaptcha-container',
  { size: 'normal' }
);

function sendOTP() {
  const phone = document.getElementById("phone").value;
  const phoneNumber = "+91" + phone;

  auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
    .then(function (confirmationResult) {
      window.confirmationResult = confirmationResult;
      alert("OTP Sent Successfully");
    })
    .catch(function (error) {
      alert(error.message);
    });
}

function verifyOTP() {
  const code = document.getElementById("otp").value;

  window.confirmationResult.confirm(code)
    .then(function (result) {
      const user = result.user;
      const phone = user.phoneNumber.replace("+91", "");

      checkAccess(phone);
    })
    .catch(function () {
      alert("Invalid OTP");
    });
}

function checkAccess(phone) {
  db.collection("users").doc(phone).get()
    .then(function (doc) {
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
    "https://www.youtube.com/embed/YOUR_VIDEO_ID";
}

