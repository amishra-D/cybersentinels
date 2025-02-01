import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7JHspwqzdDEhiXx6pEhGFoUS9wl3c03o",
  authDomain: "acclone.firebaseapp.com",
  projectId: "acclone",
  storageBucket: "acclone.appspot.com",
  messagingSenderId: "533342175725",
  appId: "1:533342175725:web:ddbdfe015b4cf29fee67e4",
  measurementId: "G-XZHP8Q4FSB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signupEmailIn = document.getElementById("email-login"); 
const signupPasswordIn = document.getElementById("password-login"); 
const confirmSignUpPasswordIn = document.getElementById("confirm-password-login");
const createacctbtn = document.getElementById("login-btn");

document.getElementById("signup-form").addEventListener("submit", function(event) {
  event.preventDefault();

  var isVerified = true;

  const signupEmail = signupEmailIn.value;
  const signupPassword = signupPasswordIn.value;
  const confirmSignUpPassword = confirmSignUpPasswordIn.value;

  if (signupPassword !== confirmSignUpPassword) {
    window.alert("Password fields do not match. Try again.");
    isVerified = false;
  }

  if (!signupEmail || !signupPassword || !confirmSignUpPassword) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }

  if (isVerified) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('userEmail', signupEmail);
        window.alert("Success! Account created.");
        window.location.href = 'contacts.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during signup:", errorCode, errorMessage);

        if (errorCode === 'auth/email-already-in-use') {
          window.alert("This email is already in use. Please try another email.");
        } else {
          window.alert("Error: " + errorMessage);
        }
      });
  }
});
