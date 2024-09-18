import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

  const auth=getAuth();
  const db=getFirestore();
  const user=auth.currentUser;

  onAuthStateChanged(auth, (user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
      console.log(user)
    if(loggedInUserId){
        updateUserProfile(user);
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                updateUserProfile(user);
                const uid =user.uid;
                return uid;
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;

                // document.getElementById("loggedUserFName).textContent = userName;
                //   document.getElementById("userEmail").textContent = userEmail;
                    // document.getElementById("userName").textContent = userName;

            }
            else{
                console.log("no document found matching id");
                alert("create an account and login";
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })
 

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='index.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })

//   // Call the function to fetch user data and show names
// fetchUserData();
function updateUserProfile(user) {
const loggedUserFName = user.displayName;
const loggedUserEmail = user.email;
const updateUserProfile =user.photoURL;

document.getElementById("loggedUserFName").textContent=loggedUserFName;
                document.getElementById("loggedUserEmail").textContent=loggedUserEmail;
                document.getElementById('loggedUserLName').textContent=userData.lastName;

 document.getElementById("userName").textContent = userName;
                  document.getElementById("userEmail").textContent = userEmail;
                    // document.getElementById("userName").textContent = userName;
}