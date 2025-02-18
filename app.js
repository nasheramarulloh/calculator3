// Nih fungsi buat masukin angka ke layar kalkulator
function appendToDisplay(value) {
    const primaryDisplay = document.getElementById("primary-display"); // Ambil elemen layar utama

    // Kalo layar masih 0 dan bukan koma atau +/- yang diteken, langsung ganti aja biar gak nambahin angka aneh
    if (primaryDisplay.innerText === "0" && value !== "," && value !== "+/-") {
        primaryDisplay.innerText = value;
    } 
    // Biar gak double koma dalam satu angka, dicek dulu
    else if (value === "," && primaryDisplay.innerText.includes(",")) {
        return;
    } 
    // Buat ubah tanda positif/negatif
    else if (value === "+/-") {
        toggleSign();
    } 
    // Kalo kondisi di atas gak kena, tambahin aja angkanya ke layar
    else {
        primaryDisplay.innerText += value;
    }

    convertTemperature(); // Biar suhu otomatis dikonversi tiap input, gaspol!
}

// Nih fungsi buat ubah angka dari positif ke negatif atau sebaliknya
function toggleSign() {
    const primaryDisplay = document.getElementById("primary-display"); // Ambil elemen layar utama

    // Kalo layar bukan nol, kita ubah tanda
    if (primaryDisplay.innerText !== "0") {
        primaryDisplay.innerText = primaryDisplay.innerText.startsWith('-')
            ? primaryDisplay.innerText.slice(1)  // Kalo udah negatif, jadi positif
            : '-' + primaryDisplay.innerText;   // Kalo positif, jadi negatif
    }

    convertTemperature(); // Biar suhu tetep update, mantap kan?
}

// Ini buat nge-reset layar biar balik ke nol
function clearDisplay() {
    document.getElementById("primary-display").innerText = "0"; // Layar utama jadi nol lagi
    document.getElementById("secondary-display").innerText = "0"; // Layar hasil juga dibalikin ke nol
}

// Ini buat hapus angka satu per satu, kayak fitur backspace di keyboard
function backspace() {
    const primaryDisplay = document.getElementById("primary-display"); // Ambil layar utama

    // Kalo masih ada lebih dari 1 karakter, hapus yang terakhir
    if (primaryDisplay.innerText.length > 1) {
        primaryDisplay.innerText = primaryDisplay.innerText.slice(0, -1);
    } else {
        primaryDisplay.innerText = "0"; // Kalo tinggal satu angka, balik ke nol aja
    }

    convertTemperature(); // Biar suhu tetep update abis ngapus angka
}

// Ini inti dari konversi suhu, kita main logika suhu disini
function convertTemperature() {
    const primaryDisplay = document.getElementById("primary-display"); // Ambil layar utama
    const fromUnit = document.getElementById("from-unit").value; // Ambil satuan asal
    const toUnit = document.getElementById("to-unit").value; // Ambil satuan tujuan
    
    // Ubah koma ke titik biar bisa diitung
    const inputValue = parseFloat(primaryDisplay.innerText.replace(",", "."));

    // Kalo input bukan angka, kasih warning
    if (isNaN(inputValue)) {
        document.getElementById("secondary-display").innerText = "Invalid Input";
        return;
    }

    let convertedValue; // Variabel buat nyimpen hasil konversi

    // Ini logika buat konversi suhu, ada 3 jenis suhu: Celsius, Fahrenheit, Kelvin
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

    // Format hasil biar gak aneh-aneh tampilannya
    const formattedValue = parseFloat(convertedValue.toFixed(10)) // Hilangin nol di belakang koma
        .toString().replace(".", ",");

    document.getElementById("secondary-display").innerText = formattedValue; // Tampilkan hasil konversi
}

// Nih buat nangkep input dari keyboard
document.addEventListener("keydown", function(event) {
    const key = event.key; // Ambil tombol yang diteken

    // Kalo yang diteken angka atau koma, masukin ke layar
    if (!isNaN(key) || key === ",") {
        appendToDisplay(key);
    }
    // Backspace buat hapus angka terakhir
    else if (key === "Backspace") {
        backspace();
    }
    // Enter buat langsung konversi suhu
    else if (key === "Enter") {
        convertTemperature();
    }
    // "-" buat ubah tanda plus-minus
    else if (key === "-") {
        toggleSign();
    }
    // Esc buat reset tampilan
    else if (key === "Escape") {
        clearDisplay();
    }
    // Navigasi halaman pake kombinasi Alt + angka
    if (event.altKey && key === "1") {
        window.location.href = "index.html"; // Pindah ke halaman utama kalo Alt + 1 diteken
    }
});

// Ini buat dropdown menu suhu
const dropdownButton = document.querySelector('.dropdown button'); // Ambil tombol dropdown
const dropdownContent = document.querySelector('.dropdown-content'); // Ambil isi dropdown

// Tambahin event buat nampilin dropdown pas diklik
dropdownButton.addEventListener('click', function() {
  dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
});
