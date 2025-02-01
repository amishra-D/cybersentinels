// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";


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
const db = getFirestore(app);

const contactCards = document.getElementById("contact-cards");
const logoutBtn = document.getElementById("logout-btn");

let currentUserUID = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUID = user.uid;
        fetchContacts();
    } else {
        window.location.href = "login.html";
    }
});
async function fetchContacts() {
    contactCards.innerHTML = "";

    try {
        const q = query(collection(db, "contacts"), where("userUID", "==", currentUserUID));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            contactCards.innerHTML = "<p>No contacts found. Add a new one!</p>";
            return;
        }

        let contacts = {};
        querySnapshot.forEach((doc) => {
            const contact = doc.data();
            const firstLetter = contact.name.charAt(0).toUpperCase();

            if (!contacts[firstLetter]) {
                contacts[firstLetter] = [];
            }

            contacts[firstLetter].push(contact);
        });

        const sortedKeys = Object.keys(contacts).sort();

        sortedKeys.forEach(letter => {
            const card = document.createElement("div");
            card.classList.add("contactscard");

            let innerHTML = `<div class="card-title">${letter}</div>`;

            contacts[letter].sort((a, b) => a.name.localeCompare(b.name));

            contacts[letter].forEach(contact => {
                innerHTML += `
                    <div class="onecont">
                        <img src="bk.png" alt="User">
                        <div class="contname">${contact.name}</div>
                    </div>
                    <img src="assets/Line 1.png" alt="Separator" style="width: 85%;">
                `;
            });

            card.innerHTML = innerHTML;
            contactCards.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
}

logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout failed:", error);
    }
});
