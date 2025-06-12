const API_BASE_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Protect pages that require login
  const protectedPages = [
    "dashboard-operator.html",
    "dashboard-pelanggan.html",
  ];
  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage)) {
    checkAuth();
  }
});

function checkAuth() {
  const token = localStorage.getItem("warnet_token");
  const user = JSON.parse(localStorage.getItem("warnet_user"));

  if (!token || !user) {
    window.location.href = "index.html";
    return;
  }

  // Optional: Add role-based access control if needed
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "dashboard-operator.html" && user.role !== "Operator") {
    window.location.href = "index.html";
  }
  if (currentPage === "dashboard-pelanggan.html" && user.role !== "Pelanggan") {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("warnet_token");
  localStorage.removeItem("warnet_user");
  window.location.href = "index.html";
}

// Helper for API calls
async function apiCall(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("warnet_token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (response.status === 401) {
      // Token expired or invalid
      logout();
      return;
    }
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }
    if (response.status === 204) {
      // No Content
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
}
