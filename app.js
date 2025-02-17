// Fungsi untuk menambahkan angka ke tampilan utama
function appendToDisplay(value) {
    const primaryDisplay = document.getElementById("primary-display"); // Ambil elemen tampilan utama

    // Jika tampilan masih "0", ganti dengan angka pertama (hindari angka tambahan)
    if (primaryDisplay.innerText === "0" && value !== "," && value !== "+/-") {
        primaryDisplay.innerText = value;
    } 
    // Jika tombol koma ditekan, pastikan hanya ada satu koma dalam angka
    else if (value === "," && primaryDisplay.innerText.includes(",")) {
        return;
    } 
    // Jika tombol +/- ditekan, panggil fungsi toggleSign()
    else if (value === "+/-") {
        toggleSign();
    } 
    // Tambahkan angka ke tampilan jika kondisi di atas tidak terpenuhi
    else {
        primaryDisplay.innerText += value;
    }

    convertTemperature(); // Konversi suhu otomatis setelah input
}

// Fungsi untuk mengubah tanda positif/negatif angka
function toggleSign() {
    const primaryDisplay = document.getElementById("primary-display"); // Ambil elemen tampilan utama

    // Jika tampilan bukan nol, ubah tanda positif/negatif
    if (primaryDisplay.innerText !== "0") {
        primaryDisplay.innerText = primaryDisplay.innerText.startsWith('-')
            ? primaryDisplay.innerText.slice(1)  // Jika negatif, ubah ke positif
            : '-' + primaryDisplay.innerText;   // Jika positif, ubah ke negatif
    }

    convertTemperature(); // Perbarui hasil setelah mengubah tanda
}

// Fungsi untuk mengosongkan tampilan utama dan sekunder
function clearDisplay() {
    document.getElementById("primary-display").innerText = "0"; // Set tampilan utama ke nol
    document.getElementById("secondary-display").innerText = "0"; // Set tampilan hasil ke nol
}

// Fungsi untuk menghapus karakter terakhir dari tampilan utama
function backspace() {
    const primaryDisplay = document.getElementById("primary-display"); // Ambil elemen tampilan utama

    // Jika panjang teks lebih dari 1, hapus karakter terakhir
    if (primaryDisplay.innerText.length > 1) {
        primaryDisplay.innerText = primaryDisplay.innerText.slice(0, -1);
    } else {
        primaryDisplay.innerText = "0"; // Jika hanya tersisa satu karakter, set ke nol
    }

    convertTemperature(); // Perbarui hasil setelah menghapus karakter
}

// Fungsi utama untuk konversi suhu
function convertTemperature() {
    const primaryDisplay = document.getElementById("primary-display"); // Ambil elemen tampilan utama
    const fromUnit = document.getElementById("from-unit").value; // Ambil satuan asal
    const toUnit = document.getElementById("to-unit").value; // Ambil satuan tujuan
    
    // Ubah koma menjadi titik agar bisa dikonversi ke angka
    const inputValue = parseFloat(primaryDisplay.innerText.replace(",", "."));

    // Validasi input: tampilkan pesan error jika input tidak valid
    if (isNaN(inputValue)) {
        document.getElementById("secondary-display").innerText = "Invalid Input";
        return;
    }

    let convertedValue; // Variabel untuk menyimpan hasil konversi

    // Logika konversi suhu berdasarkan satuan asal dan tujuan
    if (fromUnit === 'Celsius') {
        convertedValue = (toUnit === 'Fahrenheit') ? (inputValue * 9/5) + 32
                      : (toUnit === 'Kelvin') ? inputValue + 273.15
                      : inputValue;
    } else if (fromUnit === 'Fahrenheit') {
        convertedValue = (toUnit === 'Celsius') ? (inputValue - 32) * 5/9
                      : (toUnit === 'Kelvin') ? ((inputValue - 32) * 5/9) + 273.15
                      : inputValue;
    } else if (fromUnit === 'Kelvin') {
        convertedValue = (toUnit === 'Celsius') ? inputValue - 273.15
                      : (toUnit === 'Fahrenheit') ? ((inputValue - 273.15) * 9/5) + 32
                      : inputValue;
    }

    // Format hasil agar tidak menampilkan nol berlebih
    const formattedValue = parseFloat(convertedValue.toFixed(10)) // Hilangkan nol di belakang koma
        .toString().replace(".", ",");

    document.getElementById("secondary-display").innerText = formattedValue; // Tampilkan hasil konversi
}

// Fungsi untuk menangkap input dari keyboard
document.addEventListener("keydown", function(event) {
    const key = event.key; // Ambil tombol yang ditekan

    // Cek apakah tombol yang ditekan adalah angka 0-9 atau koma
    if (!isNaN(key) || key === ",") {
        appendToDisplay(key);
    }
    // Jika tombol backspace ditekan, hapus karakter terakhir
    else if (key === "Backspace") {
        backspace();
    }
    // Jika tombol Enter ditekan, lakukan konversi suhu
    else if (key === "Enter") {
        convertTemperature();
    }
    // Jika tombol "-" ditekan, ubah tanda negatif/positif
    else if (key === "-") {
        toggleSign();
    }
    // Jika tombol Esc ditekan, hapus semua konten tampilan
    else if (key === "Escape") {
        clearDisplay();
    }
    // Pindah halaman dengan kombinasi Alt + angka
    if (event.altKey && key === "1") {
        window.location.href = "index.html"; // Pindah ke halaman index.html saat Alt + 1 ditekan
    }
});

// Dropdown untuk memilih unit suhu
const dropdownButton = document.querySelector('.dropdown button'); // Ambil tombol dropdown
const dropdownContent = document.querySelector('.dropdown-content'); // Ambil konten dropdown

// Menambahkan event listener untuk menampilkan atau menyembunyikan dropdown saat diklik
dropdownButton.addEventListener('click', function() {
  dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
});
