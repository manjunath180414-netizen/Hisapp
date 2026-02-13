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

// STEP 1
function saveDetails() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("phone", phone);

  document.getElementById("details-section").style.display = "none";
  document.getElementById("login-section").style.display = "block";
}

// STEP 2
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      currentUser = result.user;
      checkUser();
    });
}

// STEP 3
function checkUser() {
  const email = currentUser.email;

  db.collection("users").doc(email).get()
    .then((doc) => {

      if (!doc.exists) {
        createUser(email);
        showCourse();
        return;
      }

      if (doc.data().paid === true) {
        showDashboard();
      } else {
        showCourse();
      }

    });
}

function createUser(email) {
  db.collection("users").doc(email).set({
    name: localStorage.getItem("name"),
    phone: localStorage.getItem("phone"),
    paid: false,
    joinedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// STEP 4
function showCourse() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("course-section").style.display = "block";

  db.collection("course").doc("main").get()
    .then((doc) => {
      document.getElementById("course-title").innerText = doc.data().title;
      document.getElementById("course-price").innerText =
        "Price: ₹" + doc.data().price;
    });
}

// STEP 5 (Payment placeholder for now)
function startPayment() {
  alert("Payment integration next step");
}

// STEP 6
function showDashboard() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("course-section").style.display = "none";
  document.getElementById("dashboard-section").style.display = "block";

  db.collection("course").doc("main").get()
    .then((doc) => {
      document.getElementById("class-time").innerText =
        doc.data().classTime;
      document.getElementById("live-frame").src =
        doc.data().liveLink;
    });
}
