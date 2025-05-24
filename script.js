let students = {}; // Will be populated by fetching data_siswa.json

// Fetch student data and update footer year when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const errorDiv = document.getElementById("error-message"); // Get error div on input page
  fetch('data_siswa.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      students = data;
    })
    .catch(error => {
      console.error('Error fetching student data:', error);
      if (errorDiv) { 
        errorDiv.textContent = "Gagal memuat data siswa. Silakan coba muat ulang halaman atau hubungi administrator.";
        errorDiv.style.display = "block";
      }
      // Optionally, disable the NISN input and button if data loading fails
      const nisnInput = document.getElementById("nisnInput");
      const checkButton = document.querySelector("#input-page button");
      if (nisnInput) nisnInput.disabled = true;
      if (checkButton) checkButton.disabled = true;
    });

  // Update footer year
  const currentYear = new Date().getFullYear();
  const footer = document.querySelector(".footer");
  if (footer) {
    footer.textContent = `© ${currentYear} SMA Negeri 6 Sigi`;
  }
});

// Fungsi untuk menampilkan halaman login
function showLoginPage() {
  document.getElementById("welcome-page").style.display = "none";
  document.getElementById("input-page").style.display = "block";
}

// Fungsi untuk memeriksa hasil kelulusan
function checkResult() {
  const nisn = document.getElementById("nisnInput").value.trim();
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error-message");

  // Reset pesan sebelumnya
  resultDiv.innerHTML = "";
  errorDiv.style.display = "none";

  if (nisn === "") {
    errorDiv.textContent = "NISN tidak boleh kosong!";
    errorDiv.style.display = "block";
    return;
  }

  // Cari data siswa berdasarkan NISN
  const student = students[nisn]; // This will now use the fetched data
  if (student) {
    // Pindah ke halaman hasil kelulusan
    document.getElementById("input-page").style.display = "none";
    document.getElementById("result-page").style.display = "block";

    // Tampilkan nama dan status secara terpisah
    let message = "";
    let className = "";

    // Ensure student.name is accessed, and student.status is used for Lulus/Tidak Lulus
    if (student.status === "Lulus") { 
      className = "result-lulus";
      message = `
        <p class="result-title">SELAMAT, ${student.name.toUpperCase()}!</p>
        <p class="result-message">Anda dinyatakan <strong>LULUS</strong>.</p>
        <p class="result-message">Silahkan ambil Surat Keterangan Lulus di Ruang Tata Usaha SMA Negeri 6 Sigi dengan berpakaian rapi dan sopan.</p>
      `;
    } else {
      className = "result-tidak-lulus";
      message = `
        <p class="result-title">MAAF, ${student.name.toUpperCase()}</p>
        <p class="result-message">Anda dinyatakan <strong>TIDAK LULUS</strong>.</p>
        <p class="result-message">Silahkan hubungi guru pembimbing untuk informasi lebih lanjut.</p>
      `;
    }

    // Tampilkan hasil
    resultDiv.innerHTML = `<div class="${className}">${message}</div>`;
  } else {
    errorDiv.textContent = "NISN tidak ditemukan atau data siswa belum dimuat. Silakan coba lagi.";
    errorDiv.style.display = "block";
  }
}

// Fungsi untuk mereset form
function resetForm() {
  const nisnInput = document.getElementById("nisnInput");
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error-message");

  // Kosongkan input NISN dan hasil kelulusan
  nisnInput.value = "";
  resultDiv.innerHTML = "";
  errorDiv.style.display = "none";

  // Kembali ke halaman input NISN
  document.getElementById("result-page").style.display = "none";
  document.getElementById("input-page").style.display = "block";
}

// Fungsi untuk kembali ke halaman login
function backToLogin() {
  const errorDivInputPage = document.getElementById("error-message"); // Error div on input page
  if (errorDivInputPage) errorDivInputPage.style.display = "none"; 

  document.getElementById("result-page").style.display = "none";
  document.getElementById("input-page").style.display = "none"; // Also hide input page
  document.getElementById("welcome-page").style.display = "block";
}
