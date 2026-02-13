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

let currentUser = null;

/* ---------------- STEP 1 ---------------- */

function saveDetails() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !phone) {
    alert("Enter all details");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("phone", phone);

  document.getElementById("details-section").style.display="none";
  document.getElementById("login-section").style.display="block";
}

/* ---------------- STEP 2 ---------------- */

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

/* ---------------- AUTH STATE (VERY IMPORTANT) ---------------- */

auth.onAuthStateChanged(async (user) => {

  if (!user) return;

  currentUser = user;
  const email = user.email;

  const doc = await db.collection("users").doc(email).get();

  // First time user
  if (!doc.exists) {
    await db.collection("users").doc(email).set({
      name: localStorage.getItem("name"),
      phone: localStorage.getItem("phone"),
      paid: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    showCourse();
    return;
  }

  // Existing user
  if (doc.data().paid === true) {
    showDashboard();
  } else {
    showCourse();
  }
});

/* ---------------- UI FUNCTIONS ---------------- */

function showCourse() {
  document.getElementById("details-section").style.display="none";
  document.getElementById("login-section").style.display="none";
  document.getElementById("course-section").style.display="block";
}

async function showDashboard() {

  document.getElementById("course-section").style.display="none";
  document.getElementById("dashboard-section").style.display="block";

  const doc = await db.collection("course").doc("main").get();

  if(doc.exists){
    document.getElementById("class-time").innerText =
      "Class Time: " + doc.data().classTime;

    document.getElementById("live-frame").src =
      doc.data().liveLink;
  }
}

/* ---------------- PAYMENT ---------------- */

function startPayment() {
  window.open("https://rzp.io/rzp/UMz8reP","_blank");
}
