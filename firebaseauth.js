 // // Import the functions you need from the SDKs you need
 // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 // import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 // import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
 // const firebaseConfig = {


 //   apiKey: "AIzaSyDn6WbXzDYx-gZ1KInvzGD1bkLGdHdt9h0",
 //    authDomain: "login-with-firebase-data-84ad9.firebaseapp.com",
 //    projectId: "login-with-firebase-data-84ad9",
 //    storageBucket: "login-with-firebase-data-84ad9.appspot.com",
 //    messagingSenderId: "939532832658",
 //    appId: "1:939532832658:web:df10ae63062aabf692fb4b"
 // };

 // // Initialize Firebase
 // const app = initializeApp(firebaseConfig);

 // function showMessage(message, divId){
 //    var messageDiv=document.getElementById(divId);
 //    messageDiv.style.display="block";
 //    messageDiv.innerHTML=message;
 //    messageDiv.style.opacity=1;
 //    setTimeout(function(){
 //        messageDiv.style.opacity=0;
 //    },5000);
 // }
 // const signUp=document.getElementById('submitSignUp');
 // signUp.addEventListener('click', (event)=>{
 //    event.preventDefault();
 //    const email=document.getElementById('rEmail').value;
 //    const password=document.getElementById('rPassword').value;
 //    const firstName=document.getElementById('fName').value;
 //    const lastName=document.getElementById('lName').value;

 //    const auth=getAuth();
 //    const db=getFirestore();

 //    createUserWithEmailAndPassword(auth, email, password)
 //    .then((userCredential)=>{
 //        const user=userCredential.user;
 //        const userData={
 //            email: email,
 //            firstName: firstName,
 //            lastName:lastName
 //        };
 //        showMessage('Account Created Successfully', 'signUpMessage');
 //        const docRef=doc(db, "users", user.uid);
 //        setDoc(docRef,userData)
 //        .then(()=>{
 //            window.location.href='index.html';
 //        })
 //        .catch((error)=>{
 //            console.error("error writing document", error);

 //        });
 //    })
 //    .catch((error)=>{
 //        const errorCode=error.code;
 //        if(errorCode=='auth/email-already-in-use'){
 //            showMessage('Email Address Already Exists !!!', 'signUpMessage');
 //        }
 //        else{
 //            showMessage('unable to create User', 'signUpMessage');
 //        }
 //    })
 // });

 // const signIn=document.getElementById('submitSignIn');
 // signIn.addEventListener('click', (event)=>{
 //    event.preventDefault();
 //    const email=document.getElementById('email').value;
 //    const password=document.getElementById('password').value;
 //    const auth=getAuth();

 //    signInWithEmailAndPassword(auth, email,password)
 //    .then((userCredential)=>{
 //        showMessage('login is successful', 'signInMessage');
 //        const user=userCredential.user;
 //        localStorage.setItem('loggedInUserId', user.uid);
 //        window.location.href='home.html';
 //    })
 //    .catch((error)=>{
 //        const errorCode=error.code;
 //        if(errorCode==='auth/invalid-credential'){
 //            showMessage('Incorrect Email or Password', 'signInMessage');
 //        }
 //        else{
 //            showMessage('Account does not Exist', 'signInMessage');
 //        }
 //    })
 // })

// Import the necessary functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDn6WbXzDYx-gZ1KInvzGD1bkLGdHdt9h0",
    authDomain: "login-with-firebase-data-84ad9.firebaseapp.com",
    projectId: "login-with-firebase-data-84ad9",
    storageBucket: "login-with-firebase-data-84ad9.appspot.com",
    messagingSenderId: "939532832658",
    appId: "1:939532832658:web:df10ae63062aabf692fb4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    const userImage = document.getElementById('userImage').files[0]; // Get the uploaded image file

    const auth = getAuth();
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };

            // Upload the user image to Firebase Storage
            const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
            uploadBytes(storageRef, userImage).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                // Get the download URL and save it to Firestore
                getDownloadURL(storageRef).then((downloadURL) => {
                    userData.profileImage = downloadURL; // Add image URL to user data
                    const docRef = doc(db, "users", user.uid);
                    setDoc(docRef, userData)
                        .then(() => {
                            showMessage('Account Created Successfully', 'signUpMessage');
                            window.location.href = 'index.html';
                        })
                        .catch((error) => {
                            console.error("Error writing document", error);
                        });
                });
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            } else {
                showMessage('Unable to create User', 'signUpMessage');
            }
        });
});

// Sign-in logic remains unchanged
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'home.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not Exist', 'signInMessage');
            }
        });
});