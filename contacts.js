import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
            contactCards.innerHTML = '<p style="color: white; font-size: 16px; text-align: center; font-weight: bold;">No contacts found. Add a new one!</p>';

            return;
        }

        let contacts = {};
        querySnapshot.forEach((doc) => {
            const contact = doc.data();
            const firstLetter = contact.name.charAt(0).toUpperCase();

            if (!contacts[firstLetter]) {
                contacts[firstLetter] = [];
            }

            contacts[firstLetter].push({ id: doc.id, ...contact });
        });

        const sortedKeys = Object.keys(contacts).sort();

        sortedKeys.forEach(letter => {
            const card = document.createElement("div");
            card.classList.add("contactscard");

            let innerHTML = `<div class="card-title">${letter}</div>`;

            contacts[letter].sort((a, b) => a.name.localeCompare(b.name));

            contacts[letter].forEach(contact => {
                innerHTML += `
                    <div class="onecont" data-id="${contact.id}" data-name="${contact.name}" data-phone="${contact.phone}">
                        <img src="bk.png" alt="User">
                        <div class="contname">${contact.name}</div>
                        <button class="delete-btn" data-id="${contact.id}"><img src="delete (1).png"</button>
                    </div>
                    <img src="assets/Line 1.png" alt="Separator" style="width: 85%;">
                `;
            });

            card.innerHTML = innerHTML;
            contactCards.appendChild(card);
        });

        document.querySelectorAll(".onecont .contname").forEach(contactEl => {
            contactEl.addEventListener("click", (event) => {
                const parent = event.target.closest(".onecont");
                const name = parent.getAttribute("data-name");
                const phone = parent.getAttribute("data-phone");

                window.location.href = `contact-details.html?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`;
            });
        });
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async (event) => {
                event.stopPropagation(); 
                const contactId = btn.getAttribute("data-id");

                const confirmDelete = confirm("Are you sure you want to delete this contact?");
                if (confirmDelete) {
                    await deleteContact(contactId);
                }
            });
        });

    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
}

async function deleteContact(contactId) {
    try {
        await deleteDoc(doc(db, "contacts", contactId));
        alert("Contact deleted successfully.");
        fetchContacts();
    } catch (error) {
        console.error("Error deleting contact:", error);
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
