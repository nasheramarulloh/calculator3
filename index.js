// Referensi ke elemen input tampilan
const display = document.getElementById("display"); // Mengambil elemen input tampilan utama
const historyList = document.getElementById("history"); // Mengambil elemen daftar riwayat perhitungan

display.value = "0"; // Mengatur nilai awal tampilan menjadi "0"
let lastWasOperator = false; // Variabel untuk melacak apakah karakter terakhir adalah operator

// Fungsi untuk membersihkan tampilan
function clearDisplay() {
  display.value = "0"; // Mengatur tampilan kembali ke "0"
}

// Fungsi untuk memformat angka dengan titik sebagai pemisah ribuan
function formatNumber(value) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Menambahkan titik setiap tiga digit ribuan
}

// Fungsi untuk menambahkan karakter ke tampilan
function appendToDisplay(value) {
  if (value === "*") value = "×"; // Mengubah "*" menjadi simbol perkalian "×"
  if (value === "/") value = "÷"; // Mengubah "/" menjadi simbol pembagian "÷"
  if (value === ",") value = ","; // Memastikan koma tetap koma

  let lastChar = display.value.slice(-1); // Mengambil karakter terakhir dalam tampilan

  // Jika dua operator berturut-turut dimasukkan, ganti yang terakhir dengan yang baru
  if (
    ["+", "-", "×", "÷"].includes(lastChar) &&
    ["+", "-", "×", "÷"].includes(value)
  ) {
    display.value = display.value.slice(0, -1) + value;
    return;
  }

  // Jika tampilan masih "0" dan yang dimasukkan adalah operator selain "-", hentikan
  if (display.value === "0" && ["+", "×", "÷"].includes(value)) {
    return;
  }

  // Jika tampilan "0" dan pengguna memasukkan angka, ganti "0" dengan angka tersebut
  if (
    display.value === "0" &&
    ![".", ",", "×", "÷", "+", "-"].includes(value)
  ) {
    display.value = value;
  } else {
    display.value += value; // Menambahkan karakter ke tampilan
  }

  // Format angka agar titik sebagai pemisah ribuan tetap diterapkan
  display.value = formatNumber(display.value.replace(/\./g, ""));
  lastWasOperator = ["+", "-", "×", "÷"].includes(value); // Perbarui status terakhir apakah operator atau bukan
}

// Fungsi untuk menghapus karakter terakhir
function backspace() {
  display.value = display.value.slice(0, -1); // Hapus karakter terakhir
  if (display.value === "") {
    display.value = "0"; // Jika kosong setelah penghapusan, setel ke "0"
  }
}

// Fungsi untuk menghitung hasil ekspresi
function calculate() {
  try {
    let expression = display.value.replace(/\./g, ""); // Hapus titik pemisah ribuan
    expression = expression.replace(/\,/g, "."); // Ganti koma dengan titik agar bisa dikalkulasi
    expression = expression.replace(/×/g, "*").replace(/÷/g, "/"); // Ganti simbol perkalian dan pembagian dengan yang bisa diproses oleh JavaScript

    // Mengubah persen (%) menjadi desimal
    // Menggunakan regex untuk menemukan angka dengan simbol persen (%) di dalam ekspresi
    expression = expression.replace(/(\d+(\.\d+)?)%/g, (match, number) => {
      // Menemukan indeks operator sebelumnya dalam ekspresi
      let prevOperatorIndex = expression.lastIndexOf(match) - 1;

      // Mengambil karakter sebelum angka persen untuk melihat apakah itu operator matematika
      let prevOperator = expression[prevOperatorIndex];

      // Mencari angka sebelumnya yang berada sebelum operator terakhir yang ditemukan
      let prevNumberMatch = expression
        .slice(0, prevOperatorIndex)
        .match(/(\d+[\d,.]*)$/);

      // Mengubah angka sebelumnya menjadi tipe float, dengan mengganti koma (,) ke titik (.)
      let prevNumber = prevNumberMatch
        ? parseFloat(prevNumberMatch[0].replace(/,/g, ""))
        : 0;

      // Jika ada angka sebelumnya dan operator matematika (+, -, *, /) valid, hitung persen relatif
      if (prevNumber && ["+", "-", "*", "/"].includes(prevOperator)) {
        return ((prevNumber * parseFloat(number)) / 100).toString();
      }

      // Jika tidak ada operator sebelumnya, hitung persen langsung (dibagi 100)
      return (parseFloat(number) / 100).toString();
    });

    const result = eval(expression); // Evaluasi ekspresi matematika

    if (result !== undefined) {
      const formattedResult = formatNumber(result.toLocaleString("id-ID")); // Format hasil
      addToHistory(`${display.value} = ${formattedResult}`); // Tambahkan ke riwayat
      display.value = formattedResult; // Tampilkan hasil
    }
  } catch (error) {
    alert("Perhitungan tidak valid"); // Tampilkan pesan error jika terjadi kesalahan
  }
}

// Fungsi untuk menambahkan simbol persen
function percentage() {
  if (display.value !== "") {
    display.value += "%"; // Tambahkan simbol persen ke tampilan
  }
}

// Fungsi untuk mengubah tanda positif/negatif
function toggleSign() {
  if (display.value !== "0") {
    display.value = display.value.startsWith("-")
      ? display.value.substring(1)
      : "-" + display.value;
  }
}

// Fungsi untuk menambahkan entri ke riwayat
function addToHistory(entry) {
  const listItem = document.createElement("li"); // Buat elemen <li> baru
  listItem.textContent = entry; // Tambahkan teks hasil perhitungan
  listItem.onclick = function () {
    display.value = entry.split(" = ")[0]; // Setel tampilan ke nilai sebelumnya ketika diklik
  };
  historyList.appendChild(listItem); // Tambahkan ke daftar riwayat
}

// Fungsi untuk menghapus riwayat
function clearHistory() {
  historyList.innerHTML = ""; // Kosongkan daftar riwayat
}

// Fungsi untuk menangani input dari keyboard
function handleKeyboardInput(event) {
  let key = event.key;

  if (key === "*") key = "×"; // Ubah "*" menjadi "×"
  if (key === "/") key = "÷"; // Ubah "/" menjadi "÷"
  if (key === ",") key = ","; // Pastikan koma tetap koma

  // Jika tombol yang ditekan adalah angka, operator, atau koma, tambahkan ke tampilan
  if (
    !isNaN(key) ||
    key === "." ||
    key === "," ||
    ["+", "-", "×", "÷", "%"].includes(key)
  ) {
    appendToDisplay(key);
  } else if (key === "Enter") {
    calculate(); // Hitung hasil jika tombol Enter ditekan
  } else if (key === "Backspace") {
    backspace(); // Hapus karakter terakhir jika Backspace ditekan
  } else if (key === "Escape") {
    clearDisplay(); // Bersihkan tampilan jika Escape ditekan
  } else if (event.shiftKey && event.key === "Tab") {
    toggleSign(); // Ubah tanda angka jika Shift + Tab ditekan
    event.preventDefault();
  }

  // Fitur pindah ke index2.html ketika Alt + 2 ditekan
  if (event.altKey && key === "2") {
    window.location.href = "index2.html";
  }
}

document.addEventListener("keydown", handleKeyboardInput); // Tambahkan event listener untuk keyboard input

// Dropdown menu
const dropdownButton = document.querySelector(".dropdown button"); // Ambil tombol dropdown
const dropdownContent = document.querySelector(".dropdown-content"); // Ambil isi dropdown

// Menampilkan atau menyembunyikan dropdown saat tombol diklik
dropdownButton.addEventListener("click", function () {
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});
