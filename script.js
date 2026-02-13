/* ---------------- EXAM COUNTDOWN ---------------- */

setInterval(function(){
  const examDate = new Date("March 18, 2025 00:00:00").getTime();
  const now = new Date().getTime();
  const diff = examDate - now;

  if(diff > 0 && document.getElementById("exam-countdown")){
    const days = Math.floor(diff/(1000*60*60*24));
    const hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60));

    document.getElementById("exam-countdown").innerText =
      "SSLC Exam in " + days + " days " + hours + " hours";
  }
},1000);

/* ---------------- FIREBASE INIT ---------------- */

const firebaseConfig = {
  apiKey: "AIzaSyArfIujmtA2sv6M7Mjpew1I0L1oQbtjeoA",
  authDomain: "his-academy-portal.firebaseapp.com",
  projectId: "his-academy-portal"
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
    alert("Please fill all details");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("phone", phone);

  document.getElementById("details-section").style.display="none";
  document.getElementById("login-section").style.display="block";
}

/* ---------------- LOGIN ---------------- */

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

/* ---------------- AUTH STATE ---------------- */

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

/* ---------------- UI ---------------- */

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

  /* Profile */
  if(document.getElementById("profile-name")){
    document.getElementById("profile-name").innerText =
      "Name: " + currentUser.displayName;

    document.getElementById("profile-email").innerText =
      "Email: " + currentUser.email;

    document.getElementById("profile-phone").innerText =
      "Phone: " + (localStorage.getItem("phone") || "");
  }

  /* Welcome */
  if(document.getElementById("welcome-text")){
    document.getElementById("welcome-text").innerText =
      "Welcome, " + currentUser.displayName;
  }

  loadCourseData();
  loadRecordedVideos();
  loadDailyMessage();
  loadMotivationImages();
}

/* ---------------- COURSE DATA ---------------- */

async function loadCourseData() {
  const doc = await db.collection("course").doc("main").get();
  if(doc.exists){

    if(document.getElementById("class-time")){
      document.getElementById("class-time").innerText =
        "Class Time: " + doc.data().classTime;
    }

    if(document.getElementById("live-frame")){
      document.getElementById("live-frame").src =
        doc.data().liveLink;
    }
  }
}

/* ---------------- RECORDED VIDEOS ---------------- */

async function loadRecordedVideos() {
  if(!document.getElementById("video-list")) return;

  const snapshot = await db.collection("videos").get();
  let html = "";

  snapshot.forEach(doc => {
    html += `
      <div style="margin-top:10px;">
        <p>${doc.data().title}</p>
        <iframe src="${doc.data().link}"></iframe>
      </div>
    `;
  });

  document.getElementById("video-list").innerHTML = html;
}

/* ---------------- DAILY MESSAGE ---------------- */

async function loadDailyMessage(){
  if(!document.getElementById("daily-message")) return;

  const doc = await db.collection("adminContent").doc("main").get();
  if(doc.exists){
    document.getElementById("daily-message").innerText =
      doc.data().dailyMessage;
  }
}

/* ---------------- MOTIVATION SLIDER ---------------- */

async function loadMotivationImages(){
  if(!document.getElementById("motivation-img")) return;

  const snapshot = await db.collection("motivations").get();
  const images = [];

  snapshot.forEach(doc => {
    images.push(doc.data().imageUrl);
  });

  let index = 0;

  setInterval(function(){
    if(images.length > 0){
      document.getElementById("motivation-img").src =
        images[index];
      index = (index + 1) % images.length;
    }
  },3000);
}

/* ---------------- PAYMENT ---------------- */

function startPayment() {
  window.open("https://rzp.io/rzp/UMz8reP","_blank");
}

/* ---------------- LOGOUT ---------------- */

function logoutUser() {
  auth.signOut().then(() => {
    location.reload();
  });
}

    
