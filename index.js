// Referensi ke elemen input tampilan
const display = document.getElementById("display"); // Ngambil elemen input tampilan buat nampilin hasil hitungan
const historyList = document.getElementById("history"); // Ngambil elemen daftar riwayat biar keliatan history perhitungan

display.value = "0"; // Awal mula tampilannya nol dulu biar ga kosong
let lastWasOperator = false; // Ngecek apakah yang terakhir diketik itu operator atau bukan

// Fungsi buat ngehapus tampilan
function clearDisplay() {
  display.value = "0"; // Kalo di-clear, tampilan balik lagi ke nol biar rapi
}

// Fungsi buat format angka biar ada titik pemisah ribuannya
function formatNumber(value) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Biar lebih gampang dibaca angkanya
}

// Fungsi buat nambahin karakter ke tampilan
function appendToDisplay(value) {
  if (value === "*") value = "×"; // Bintang diubah jadi kali biar cakep
  if (value === "/") value = "÷"; // Slash diubah jadi bagi biar ga bingung
  if (value === ",") value = ","; // Koma tetap koma, jangan diubah

  let lastChar = display.value.slice(-1); // Ambil karakter terakhir biar bisa dicek

  // Cek kalo ada dua operator berurutan, ganti yang terakhir aja
  if (["+", "-", "×", "÷"].includes(lastChar) && ["+", "-", "×", "÷"].includes(value)) {
    display.value = display.value.slice(0, -1) + value;
    return;
  }

  // Biar ga bisa masukin operator di awal kecuali minus
  if (display.value === "0" && ["+", "×", "÷"].includes(value)) {
    return;
  }

  // Kalo awalnya nol dan input angka, langsung ganti nolnya
  if (display.value === "0" && ![".", ",", "×", "÷", "+", "-"].includes(value)) {
    display.value = value;
  } else {
    display.value += value; // Tambahin ke tampilan kalo input valid
  }

  // Format ulang biar titik ribuan tetep ada
  display.value = formatNumber(display.value.replace(/\./g, ""));
  lastWasOperator = ["+", "-", "×", "÷"].includes(value);
}

// Fungsi buat hapus satu karakter terakhir
function backspace() {
  display.value = display.value.slice(0, -1); // Potong karakter terakhir
  if (display.value === "") {
    display.value = "0"; // Kalo kosong, tampilin "0" biar ga aneh
  }
}

// Fungsi buat ngitung hasil ekspresi
function calculate() {
  try {
    let expression = display.value.replace(/\./g, ""); // Hapus titik biar ga error
    expression = expression.replace(/\,/g, "."); // Koma jadi titik biar bisa dihitung
    expression = expression.replace(/×/g, "*").replace(/÷/g, "/"); // Simbol kalkulasi diubah biar JS ngerti

    // Ubah persen jadi desimal
    expression = expression.replace(/(\d+(\.\d+)?)%/g, (match, number) => {
      // Mencari angka yang diakhiri dengan tanda persen, seperti "10%"
      let prevOperatorIndex = expression.lastIndexOf(match) - 1;
      // Menentukan operator yang ada sebelum persen (misalnya +, -, *, /)
      let prevOperator = expression[prevOperatorIndex];
      // Mencari angka yang ada sebelum operator tersebut
      let prevNumberMatch = expression.slice(0, prevOperatorIndex).match(/(\d+[\d,.]*)$/);
      // Jika angka sebelumnya ditemukan, ubah menjadi tipe data float. Jika tidak, gunakan 0.
      let prevNumber = prevNumberMatch ? parseFloat(prevNumberMatch[0].replace(/,/g, "")) : 0;
    
      // Jika ada angka sebelumnya dan operator yang valid, hitung persentase berdasarkan angka sebelumnya
      if (prevNumber && ["+", "-", "*", "/"].includes(prevOperator)) {
        return ((prevNumber * parseFloat(number)) / 100).toString(); // Menghitung persentase dari angka sebelumnya
      }
    
      // Jika tidak ada angka sebelumnya, hitung persentase dari angka tersebut langsung
      return (parseFloat(number) / 100).toString();
    });
    
    const result = eval(expression); // Menjalankan ekspresi matematika dan mendapatkan hasilnya
    
    if (result !== undefined) {
      const formattedResult = formatNumber(result.toLocaleString("id-ID")); // Memformat hasil agar lebih rapi dan mudah dibaca
      addToHistory(`${display.value} = ${formattedResult}`); // Menambahkan hasil ke riwayat perhitungan agar bisa dilihat kembali
      display.value = formattedResult; // Menampilkan hasil di layar
    }
    } catch (error) {
      alert("Perhitungan tidak valid"); // Jika terjadi error, memberikan informasi kepada pengguna
    }
    
}

// Fungsi buat masukin simbol persen
function percentage() {
  if (display.value !== "") {
    display.value += "%"; // Tambahin persen ke tampilan
  }
}

// Fungsi buat ubah tanda positif-negatif
function toggleSign() {
  if (display.value !== "0") {
    display.value = display.value.startsWith("-") ? display.value.substring(1) : "-" + display.value;
  }
}

// Fungsi buat nambahin riwayat perhitungan
function addToHistory(entry) {
  const listItem = document.createElement("li"); // Bikin item baru di list
  listItem.textContent = entry; // Masukin teks hasil hitungan
  listItem.onclick = function () {
    display.value = entry.split(" = ")[0]; // Kalo diklik, tampilin lagi perhitungannya
  };
  historyList.appendChild(listItem); // Tambahin ke history list
}

// Fungsi buat ngehapus semua history
function clearHistory() {
  historyList.innerHTML = ""; // Langsung hapus semua isi history
}

// Fungsi buat nangkep input keyboard
function handleKeyboardInput(event) {
  let key = event.key;

  if (key === "*") key = "×";
  if (key === "/") key = "÷";
  if (key === ",") key = ",";

  if (!isNaN(key) || key === "." || key === "," || ["+", "-", "×", "÷", "%"].includes(key)) {
    appendToDisplay(key);
  } else if (key === "Enter") {
    calculate();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape") {
    clearDisplay();
  } else if (event.shiftKey && event.key === "Tab") {
    toggleSign();
    event.preventDefault();
  }

  if (event.altKey && key === "2") {
    window.location.href = "index2.html";
  }
}

document.addEventListener("keydown", handleKeyboardInput);

// Dropdown menu
const dropdownButton = document.querySelector(".dropdown button");
const dropdownContent = document.querySelector(".dropdown-content");

dropdownButton.addEventListener("click", function () {
  dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
});
