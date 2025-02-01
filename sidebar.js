document.addEventListener("DOMContentLoaded", function () {
    fetch("sidebar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
          
            document.getElementById("sidebar-container").innerHTML = data;

           
            const sidebar = document.getElementById("sidebar");
            const toggleBtn = document.getElementById("sidebar-toggle-btn");

           
            function updateTogglePosition() {
                if (sidebar.classList.contains("active")) {
                    toggleBtn.style.left = "260px"; 
                } else {
                    toggleBtn.style.left = "10px";
                }
            }

            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("active");
                updateTogglePosition();
            });

           
            let profileName = localStorage.getItem("userEmail") || "User  Name";
            document.getElementById("profile-name").textContent = profileName;

           updateTogglePosition();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});