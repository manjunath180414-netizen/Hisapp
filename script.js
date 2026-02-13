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

// Step 1 - Save Details
function saveDetails() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (name === "" || phone === "") {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("phone", phone);

  document.getElementById("details-section").style.display = "none";
  document.getElementById("login-section").style.display = "block";
}

// Step 2 - Google Login
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      currentUser = result.user;
      checkUser();
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Check user in Firestore
function checkUser() {
  const email = currentUser.email;

  db.collection("users").doc(email).get()
    .then((doc) => {
      if (!doc.exists) {
        createUser(email);
        showCourse();
      } else {
        if (doc.data().paid === true) {
          showDashboard();
        } else {
          showCourse();
        }
      }
    });
}

// Create new user
function createUser(email) {
  db.collection("users").doc(email).set({
    name: localStorage.getItem("name"),
    phone: localStorage.getItem("phone"),
    paid: false,
    joinedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Show Course Page
function showCourse() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("course-section").style.display = "block";
}

// Payment
function startPayment() {
  window.open("https://rzp.io/rzp/UMz8reP", "_blank");
}

// Dashboard
function showDashboard() {
  document.getElementById("course-section").style.display = "none";
  document.getElementById("dashboard-section").style.display = "block";

  db.collection("course").doc("main").get()
    .then((doc) => {
      if (doc.exists) {
        document.getElementById("class-time").innerText =
          "Class Time: " + doc.data().classTime;
        document.getElementById("live-frame").src =
          doc.data().liveLink;
      }
    });
}
