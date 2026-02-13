const firebaseConfig = {
  apiKey: "AIzaSyArfIujmtA2sv6M7Mjpew1I0L1oQbtjeoA",
  authDomain: "his-academy-portal.firebaseapp.com",
  projectId: "his-academy-portal"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

/* ---------- STEP 1 ---------- */

function saveDetails() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !phone) {
    alert("Please fill all details");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("phone", phone);

  document.getElementById("details-section").style.display="none";
  document.getElementById("login-section").style.display="block";
}

/* ---------- STEP 2 ---------- */

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

/* ---------- AUTH STATE ---------- */

auth.onAuthStateChanged(async (user) => {

  if (!user) return;

  currentUser = user;
  const email = user.email;

  const userRef = db.collection("users").doc(email);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      name: localStorage.getItem("name"),
      phone: localStorage.getItem("phone"),
      paid: false
    });
    showCourse();
    return;
  }

  if (doc.data().paid === true) {
    showDashboard();
  } else {
    showCourse();
  }
});

/* ---------- UI FUNCTIONS ---------- */

function showCourse() {
  document.getElementById("details-section").style.display="none";
  document.getElementById("login-section").style.display="none";
  document.getElementById("course-section").style.display="block";
}

function showDashboard() {

  document.getElementById("details-section").style.display="none";
  document.getElementById("login-section").style.display="none";
  document.getElementById("course-section").style.display="none";
  document.getElementById("dashboard-section").style.display="block";

  loadCourseData();
}

async function loadCourseData() {
  const doc = await db.collection("course").doc("main").get();
  if(doc.exists){
    document.getElementById("class-time").innerText =
      "Class Time: " + doc.data().classTime;

    document.getElementById("live-frame").src =
      doc.data().liveLink;
  }
}

/* ---------- PAYMENT ---------- */

function startPayment() {
  window.open("https://rzp.io/rzp/UMz8reP","_blank");
}

/* ---------- DASHBOARD ---------- */

function showDashboard() {

  document.getElementById("details-section").style.display="none";
  document.getElementById("login-section").style.display="none";
  document.getElementById("course-section").style.display="none";
  document.getElementById("dashboard-section").style.display="block";

  document.getElementById("welcome-text").innerText =
    "Welcome, " + currentUser.displayName;

}

