
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (data.status) {
            localStorage.setItem("user", JSON.stringify({ ...data.data, password }));
            window.location.href = "products.html";
        } else {
            alert(data.message || "Login failed");
        }
    });
}


if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const res = await fetch("http://127.0.0.1:8000/api/user_registration", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await res.json();
        if (data.status) {
            alert("Registered successfully! Login now.");
            window.location.href = "index.html";
        } else {
            alert("Registration failed");
        }
    });
}
