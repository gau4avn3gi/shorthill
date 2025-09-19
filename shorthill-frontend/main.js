let isLogin = true;

document.getElementById("toggleBtn").addEventListener("click", () => {
    isLogin = !isLogin;
    document.getElementById("register-fields").style.display = isLogin ? "none" : "block";
    document.getElementById("form-title").innerText = isLogin ? "Login" : "Register";
    document.getElementById("submitBtn").innerText = isLogin ? "Login" : "Register";
});

document.getElementById("authForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;

    const url = isLogin ? "http://127.0.0.1:8000/api/login" : "/api/registration";
    const payload = isLogin ? { email, password } : { email, password, name, role };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message);

    if (data.status && isLogin) {
        localStorage.setItem("user", JSON.stringify(data.data));
        window.location.href = "products.html";
    }
});
