
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, getDocs, query } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
const db = getFirestore(app);

const phoneNumberInput = document.getElementById("phone-number");
const deleteBtn = document.getElementById("delete-btn");
const callBtn = document.getElementById("call-btn");
const endCallBtn = document.getElementById("end-call-btn");
const keys = document.querySelectorAll(".key");

let contactsArray = [];

async function fetchContacts() {
    try {
        const q = query(collection(db, "contacts"));
        const querySnapshot = await getDocs(q);

        contactsArray = [];
        querySnapshot.forEach((doc) => {
            const contact = doc.data();
            contactsArray.push({ name: contact.name, phone: contact.phone });
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
}

fetchContacts();

keys.forEach((key) => {
    key.addEventListener("click", () => {
        console.log(`Button pressed: ${key.getAttribute("data-key")}`);
        phoneNumberInput.value += key.getAttribute("data-key"); 
        checkContactMatch();
    });
});


deleteBtn.addEventListener("click", () => {
    phoneNumberInput.value = phoneNumberInput.value.slice(0, -1);
    checkContactMatch();
});

function checkContactMatch() {
    const enteredNumber = phoneNumberInput.value.trim();
    
    const matchedContact = contactsArray.find(contact => contact.phone.startsWith(enteredNumber));
    
    if (matchedContact) {
        phoneNumberInput.style.color = "#4CAF50"; // Green text for matched contact
    } else {
        phoneNumberInput.style.color = "#fffff"; // Default black
    }
}

callBtn.addEventListener("click", () => {
    const number = phoneNumberInput.value;
    if (number) {
        alert(`Calling ${number}...`);
    } else {
        alert("Enter a number first.");
    }
});

endCallBtn.addEventListener("click", () => {
    phoneNumberInput.value = "";
    phoneNumberInput.style.color = "#000";
});
