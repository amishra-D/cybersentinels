document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("zC51jZqE7mgscYrL7"); // Your Public Key

    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents default form submission

        let params = {
            user_email: document.querySelector("[name='user_email']").value,
            user_name: document.querySelector("[name='user_name']").value,
            subject: document.querySelector("[name='subject']").value
        };

        emailjs.send("service_gjia1yp", "template_79nyw6h", params)
            .then(() => {
                alert("Email Sent!!");
                this.reset(); // Clears the form after submission
            })
            .catch((error) => {
                alert("Failed to send email.");
                console.error("EmailJS Error:", error);
            });
    });
});
