let allUsers = []; // Cache for users
let allJenisKomputer = []; // Cache for computer types
let activeSessions = {}; // To map computer ID to active session ID

document.addEventListener("DOMContentLoaded", () => {
  // Initial data load
  loadAllData();

  // Form submit listeners
  document
    .getElementById("add-komputer-form")
    .addEventListener("submit", handleAddKomputer);
  document
    .getElementById("add-jenis-form")
    .addEventListener("submit", handleAddJenis);
  document
    .getElementById("start-sesi-form")
    .addEventListener("submit", handleStartSesi);
  document
    .getElementById("top-up-form")
    .addEventListener("submit", handleTopUp);
  document
    .getElementById("generate-report-btn")
    .addEventListener("click", handleGenerateReport);

  // Event delegation for dynamically created buttons
  document
    .getElementById("komputer-list")
    .addEventListener("click", handleKomputerAction);
  document
    .getElementById("pengguna-list")
    .addEventListener("click", handlePenggunaAction);
});

async function loadAllData() {
  await loadJenisKomputer();
  await loadKomputer();
  await loadPengguna();
}

// --- DATA LOADING FUNCTIONS ---
async function loadKomputer() {
  const komputerList = document.getElementById("komputer-list");
  komputerList.innerHTML = "<p>Memuat komputer...</p>";
  try {
    const komputers = await apiCall("/komputer");
    // A real app would get active sessions from an endpoint like GET /sesi/aktif
    // Here, we simulate by finding sessions with status "Digunakan"
    const sessions = await apiCall("/sesi");
    activeSessions = {};
    if (sessions && Array.isArray(sessions)) {
      sessions
        .filter((s) => s.status === "Aktif")
        .forEach((s) => {
          activeSessions[s.komputerId] = s.id;
        });
    }

    renderKomputerList(komputers);
  } catch (error) {
    komputerList.innerHTML = `<p class="text-danger">Gagal memuat data komputer: ${error.message}</p>`;
  }
}

async function loadJenisKomputer() {
  try {
    allJenisKomputer = await apiCall("/komputer/jenis");
    renderJenisList(allJenisKomputer);
    populateJenisDropdown();
  } catch (error) {
    document.getElementById(
      "jenis-list"
    ).innerHTML = `<tr><td colspan="3" class="text-danger">Gagal memuat jenis komputer.</td></tr>`;
  }
}

async function loadPengguna() {
  // NOTE: This assumes an endpoint GET /api/pengguna exists to fetch all users.
  // You will need to add this to your backend for this feature to work.
  try {
    allUsers = await apiCall("/pengguna/all"); // Assumed endpoint
    renderPenggunaList(allUsers);
    populatePelangganDropdown();
  } catch (error) {
    document.getElementById(
      "pengguna-list"
    ).innerHTML = `<tr><td colspan="6" class="text-danger">Gagal memuat pengguna: ${error.message}. Pastikan endpoint GET /api/pengguna/all ada.</td></tr>`;
  }
}

// --- RENDERING FUNCTIONS ---
function renderKomputerList(komputers) {
  const komputerList = document.getElementById("komputer-list");
  if (!komputers || komputers.length === 0) {
    komputerList.innerHTML = "<p>Belum ada komputer yang ditambahkan.</p>";
    return;
  }

  komputerList.innerHTML = komputers
    .map((k) => {
      const statusMap = {
        Tersedia: { bg: "bg-success", icon: "bi-check-circle-fill" },
        Digunakan: { bg: "bg-warning", icon: "bi-person-fill" },
        Perbaikan: { bg: "bg-danger", icon: "bi-tools" },
      };
      const statusInfo = statusMap[k.status] || {
        bg: "bg-secondary",
        icon: "bi-question-circle",
      };

      let actionButton = "";
      if (k.status === "Tersedia") {
        actionButton = `<button class="btn btn-sm btn-success start-sesi-btn" data-komputer-id="${k.id}">Mulai Sesi</button>`;
      } else if (k.status === "Digunakan") {
        const sessionId = activeSessions[k.id];
        if (sessionId) {
          actionButton = `<button class="btn btn-sm btn-danger stop-sesi-btn" data-sesi-id="${sessionId}">Stop Sesi</button>`;
        }
      }

      return `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card komputer-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">${k.nama}</h5>
                        <span class="badge ${statusInfo.bg}"><i class="bi ${
        statusInfo.icon
      }"></i> ${k.status}</span>
                    </div>
                    <p class="card-text text-muted">${
                      k.JenisKomputer.nama
                    } - Rp ${parseFloat(
        k.JenisKomputer.tarifPerMenit
      ).toLocaleString("id-ID")}/menit</p>
                    <div class="d-flex justify-content-between">
                         ${actionButton}
                         <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-gear-fill"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item status-change-btn" href="#" data-komputer-id="${
                                  k.id
                                }" data-status="Tersedia">Set Tersedia</a></li>
                                <li><a class="dropdown-item status-change-btn" href="#" data-komputer-id="${
                                  k.id
                                }" data-status="Perbaikan">Set Perbaikan</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    })
    .join("");
}

function renderJenisList(jenis) {
  const jenisList = document.getElementById("jenis-list");
  if (!jenis || jenis.length === 0) {
    jenisList.innerHTML = '<tr><td colspan="3">Belum ada data.</td></tr>';
    return;
  }
  jenisList.innerHTML = jenis
    .map(
      (j) => `
        <tr>
            <td>${j.id}</td>
            <td>${j.nama}</td>
            <td>Rp ${parseFloat(j.tarifPerMenit).toLocaleString("id-ID")}</td>
        </tr>
     `
    )
    .join("");
}

function renderPenggunaList(users) {
  const penggunaList = document.getElementById("pengguna-list");
  if (!users || users.length === 0) {
    penggunaList.innerHTML =
      '<tr><td colspan="6">Belum ada pengguna terdaftar.</td></tr>';
    return;
  }
  penggunaList.innerHTML = users
    .map(
      (u) => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nama}</td>
            <td>${u.username}</td>
            <td><span class="badge ${
              u.role === "Operator" ? "bg-info" : "bg-secondary"
            }">${u.role}</span></td>
            <td>Rp ${parseFloat(u.saldo).toLocaleString("id-ID")}</td>
            <td>
                ${
                  u.role === "Pelanggan"
                    ? `<button class="btn btn-sm btn-primary top-up-btn" data-user-id="${u.id}" data-user-name="${u.nama}">Top Up</button>`
                    : ""
                }
            </td>
        </tr>
    `
    )
    .join("");
}

// --- FORM & DROPDOWN POPULATION ---
function populateJenisDropdown() {
  const select = document.getElementById("komputer-jenis");
  select.innerHTML = allJenisKomputer
    .map((j) => `<option value="${j.id}">${j.nama}</option>`)
    .join("");
}

function populatePelangganDropdown() {
  const select = document.getElementById("sesi-pelanggan");
  const pelanggan = allUsers.filter((u) => u.role === "Pelanggan");
  select.innerHTML = pelanggan
    .map(
      (p) =>
        `<option value="${p.id}">${p.nama} (Saldo: Rp ${parseFloat(
          p.saldo
        ).toLocaleString("id-ID")})</option>`
    )
    .join("");
}

// --- EVENT HANDLERS ---
async function handleAddKomputer(e) {
  e.preventDefault();
  const nama = document.getElementById("komputer-nama").value;
  const jenisId = document.getElementById("komputer-jenis").value;
  try {
    await apiCall("/komputer", "POST", { nama, jenisId });
    bootstrap.Modal.getInstance(
      document.getElementById("addKomputerModal")
    ).hide();
    e.target.reset();
    await loadKomputer(); // Refresh list
  } catch (error) {
    alert(`Gagal menambah komputer: ${error.message}`);
  }
}

async function handleAddJenis(e) {
  e.preventDefault();
  const nama = document.getElementById("jenis-nama").value;
  const tarifPerMenit = document.getElementById("jenis-tarif").value;
  try {
    await apiCall("/komputer/jenis", "POST", { nama, tarifPerMenit });
    bootstrap.Modal.getInstance(
      document.getElementById("addJenisModal")
    ).hide();
    e.target.reset();
    await loadJenisKomputer(); // Refresh list
  } catch (error) {
    alert(`Gagal menambah jenis: ${error.message}`);
  }
}

async function handleStartSesi(e) {
  e.preventDefault();
  const idKomputer = document.getElementById("start-sesi-komputer-id").value;
  const idPelanggan = document.getElementById("sesi-pelanggan").value;

  try {
    await apiCall("/sesi/mulai", "POST", { idKomputer, idPelanggan });
    bootstrap.Modal.getInstance(
      document.getElementById("startSesiModal")
    ).hide();
    await loadKomputer();
  } catch (error) {
    alert(`Gagal memulai sesi: ${error.message}`);
  }
}

async function handleTopUp(e) {
  e.preventDefault();
  const userId = document.getElementById("top-up-user-id").value;
  const jumlah = document.getElementById("top-up-jumlah").value;
  try {
    await apiCall(`/pengguna/${userId}/topup`, "POST", { jumlah });
    bootstrap.Modal.getInstance(document.getElementById("topUpModal")).hide();
    e.target.reset();
    await loadPengguna(); // Refresh list
  } catch (error) {
    alert(`Gagal top up: ${error.message}`);
  }
}

async function handleGenerateReport() {
  const resultsDiv = document.getElementById("report-results");
  resultsDiv.innerHTML = "Generating...";
  try {
    const report = await apiCall("/laporan/harian", "POST");
    resultsDiv.innerHTML = `<div class="alert alert-success">
            <h5>Laporan Harian - ${report.periode}</h5>
            <pre>${JSON.stringify(report.data, null, 2)}</pre>
        </div>`;
  } catch (error) {
    resultsDiv.innerHTML = `<div class="alert alert-danger">Gagal membuat laporan: ${error.message}</div>`;
  }
}

// --- DELEGATED EVENT HANDLERS ---
function handleKomputerAction(e) {
  const target = e.target;
  // Start Sesi
  if (target.classList.contains("start-sesi-btn")) {
    const komputerId = target.dataset.komputerId;
    document.getElementById("start-sesi-komputer-id").value = komputerId;
    const modal = new bootstrap.Modal(
      document.getElementById("startSesiModal")
    );
    modal.show();
  }
  // Stop Sesi
  if (target.classList.contains("stop-sesi-btn")) {
    const idSesi = target.dataset.sesiId;
    if (confirm("Anda yakin ingin menghentikan sesi ini?")) {
      stopSesi(idSesi);
    }
  }
  // Change Status
  if (target.classList.contains("status-change-btn")) {
    e.preventDefault();
    const komputerId = target.dataset.komputerId;
    const newStatus = target.dataset.status;
    if (
      confirm(`Ubah status komputer ID ${komputerId} menjadi "${newStatus}"?`)
    ) {
      updateKomputerStatus(komputerId, newStatus);
    }
  }
}

function handlePenggunaAction(e) {
  if (e.target.classList.contains("top-up-btn")) {
    const userId = e.target.dataset.userId;
    const userName = e.target.dataset.userName;
    document.getElementById("top-up-user-id").value = userId;
    document.getElementById("top-up-user-name").textContent = userName;
    const modal = new bootstrap.Modal(document.getElementById("topUpModal"));
    modal.show();
  }
}

// --- ACTION FUNCTIONS ---
async function stopSesi(idSesi) {
  try {
    const result = await apiCall("/sesi/stop", "POST", { idSesi });
    alert(`Sesi dihentikan. Biaya: Rp ${result.biaya.toLocaleString("id-ID")}`);
    await loadKomputer(); // Refresh
  } catch (error) {
    alert(`Gagal menghentikan sesi: ${error.message}`);
  }
}

async function updateKomputerStatus(komputerId, status) {
  try {
    await apiCall(`/komputer/${komputerId}/status`, "PUT", { status });
    await loadKomputer();
  } catch (error) {
    alert(`Gagal mengubah status: ${error.message}`);
  }
}
