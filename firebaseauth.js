// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDn6WbXzDYx-gZ1KInvzGD1bkLGdHdt9h0",
    authDomain: "login-with-firebase-data-84ad9.firebaseapp.com",
    projectId: "login-with-firebase-data-84ad9",
    storageBucket: "login-with-firebase-data-84ad9.appspot.com",
    messagingSenderId: "939532832658",
    appId: "1:939532832658:web:df10ae63062aabf692fb4b"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Function to show feedback messages to the user
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Sign-up functionality
const signUpForm = document.getElementById('signup-form');
if (signUpForm) {
    signUpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('rEmail').value;
        const password = document.getElementById('rPassword').value;
        const confirmPassword = document.getElementById('rConfirmPassword').value;
        const username = document.getElementById('username').value;
        const firstName=document.getElementById('fName').value;
        const lastName=document.getElementById('lName').value;


        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'signUpMessage');
            return;
        }

        const auth = getAuth();
        const db = getFirestore();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userData = {
                email: email,
                username: username,
                firstName: firstName,
            lastName:lastName,
            };
            await setDoc(doc(db, "users", user.uid), userData);
            showMessage('Account Created Successfully', 'signUpMessage');
            window.location.href = 'index.html';
        } catch (error) {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            } else {
                showMessage('Unable to create user', 'signUpMessage');
            }
        }
    });
}

// Sign-in functionality
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const auth = getAuth();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'home.html'; // Redirect to home page
        } catch (error) {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not exist', 'signInMessage');
            }
        }
    });
}
