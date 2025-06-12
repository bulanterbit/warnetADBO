document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
});

const API_BASE_URL_AUTH = "http://localhost:5000/api/auth"; // Auth endpoints

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorAlert = document.getElementById("error-alert");

  try {
    const response = await fetch(`${API_BASE_URL_AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login Gagal");
    }

    // Store token and user data
    localStorage.setItem("warnet_token", data.token);
    localStorage.setItem(
      "warnet_user",
      JSON.stringify({ id: data.id, nama: data.nama, role: data.role })
    );

    // Redirect based on role
    if (data.role === "Operator") {
      window.location.href = "dashboard-operator.html";
    } else {
      window.location.href = "dashboard-pelanggan.html";
    }
  } catch (error) {
    errorAlert.textContent = error.message;
    errorAlert.classList.remove("d-none");
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const nama = document.getElementById("nama").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorAlert = document.getElementById("error-alert");

  try {
    const response = await fetch(`${API_BASE_URL_AUTH}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registrasi Gagal");
    }

    // After successful registration, log the user in
    localStorage.setItem("warnet_token", data.token);
    localStorage.setItem(
      "warnet_user",
      JSON.stringify({ id: data.id, nama: data.nama, role: data.role })
    );

    // Redirect to customer dashboard
    window.location.href = "dashboard-pelanggan.html";
  } catch (error) {
    errorAlert.textContent = error.message;
    errorAlert.classList.remove("d-none");
  }
}
