document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

async function loadProfile() {
  const profileDetails = document.getElementById("profile-details");
  try {
    const user = await apiCall("/pengguna/profil");

    if (user) {
      profileDetails.innerHTML = `
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>ID Pengguna:</strong> ${
                      user.id
                    }</li>
                    <li class="list-group-item"><strong>Nama:</strong> ${
                      user.nama
                    }</li>
                    <li class="list-group-item"><strong>Username:</strong> ${
                      user.username
                    }</li>
                    <li class="list-group-item"><strong>Role:</strong> <span class="badge bg-success">${
                      user.role
                    }</span></li>
                    <li class="list-group-item fs-4"><strong>Saldo Anda:</strong> <span class="badge bg-primary">Rp ${parseFloat(
                      user.saldo
                    ).toLocaleString("id-ID")}</span></li>
                </ul>
            `;
    }
  } catch (error) {
    profileDetails.innerHTML = `<p class="text-danger">Gagal memuat profil: ${error.message}</p>`;
  }
}
