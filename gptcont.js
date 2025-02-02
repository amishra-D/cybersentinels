
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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

const contactNameInput = document.getElementById("contact-name");
const contactPhoneInput = document.getElementById("contact-phone");
const saveBtn = document.getElementById("save-btn");
const contactList = document.getElementById("contact-list");
const logoutBtn = document.getElementById("logout-btn");

let currentUserUID = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUID = user.uid;
        console.log("Logged-in user UID:", currentUserUID);
        fetchContacts();
    } else {
        console.log("User is not logged in. Redirecting to login page.");
        window.location.href = "login.html";
    }
});
saveBtn.addEventListener("click", async () => {
    const contactName = contactNameInput.value.trim();
    const contactPhone = contactPhoneInput.value.trim();
    if (!contactName || !contactPhone) {
        alert("Please fill out all fields.");
        return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactPhone)) {
        alert("Phone number must be exactly 10 digits.");
        return;
    }

    try {
        const q = query(collection(db, "contacts"), 
                        where("userUID", "==", currentUserUID), 
                        where("phone", "==", contactPhone));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert("Phone number already exists!");
            return;
        }

        console.log("Saving contact:", { contactName, contactPhone, userUID: currentUserUID });
        await addDoc(collection(db, "contacts"), {
            name: contactName,
            phone: contactPhone,
            userUID: currentUserUID
        });

        alert("Contact saved!");
        contactNameInput.value = "";
        contactPhoneInput.value = "";
        fetchContacts();
    } catch (error) {
        console.error("Error adding contact:", error);
        alert("Failed to save contact. Try again.");
    }
});

async function fetchContacts() {
    contactList.innerHTML = "";

    console.log("Fetching contacts for UID:", currentUserUID);
    try {
        const q = query(collection(db, "contacts"), where("userUID", "==", currentUserUID));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            contactList.innerHTML = "<p>No contacts found. Add a new one!</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const contact = doc.data();
            console.log("Fetched contact:", contact);
            const contactItem = document.createElement("div");
            contactItem.classList.add("contact-item");
            contactItem.innerHTML = `
                <p><strong>${contact.name}</strong></p>
                <p>${contact.phone}</p>
                <button class="delete-btn" data-id="${doc.id}">Delete</button>
            `;
            contactList.appendChild(contactItem);
        });

        addDeleteListeners();
    } catch (error) {
        console.error("Error fetching contacts:", error);
        alert("Failed to fetch contacts. Try again.");
    }
}

function addDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
            const docId = e.target.getAttribute("data-id");
            try {
                console.log("Deleting contact with ID:", docId);
                await deleteDoc(doc(db, "contacts", docId));
                alert("Contact deleted!");
                fetchContacts();
            } catch (error) {
                console.error("Error deleting contact:", error);
                alert("Failed to delete contact. Try again.");
            }
        });
    });
}

logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully.");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Error during logout:", error);
        alert("Failed to logout. Try again.");
    }
});
