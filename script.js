let barangList = [];
const namaToko = "EarlStore";
const footerText = `TERIMA KASIH TELAH MEMBELI BELAH DI\n${namaToko}`;

function tambahBarang() {
    const namaBarang = document.getElementById("namaBarang").value;
    const hargaBarang = parseInt(document.getElementById("hargaBarang").value);

    if (namaBarang && hargaBarang) {
        barangList.push({ nama: namaBarang, harga: hargaBarang });

        updateBarangList();

        document.getElementById("namaBarang").value = "";
        document.getElementById("hargaBarang").value = "";
    } else {
        alert("Isi nama dan harga barang terlebih dahulu!");
    }
}

function updateBarangList() {
    let barangHTML = `<h4>Daftar Barang:</h4>`;
    barangList.forEach((item, index) => {
        barangHTML += `<p>${index + 1}. ${item.nama} - RM${formatHarga(item.harga)}</p>`;
    });
    document.getElementById("barangList").innerHTML = barangHTML;
}

// Fungsi untuk memformat harga menjadi dua desimal
function formatHarga(harga) {
    return (harga / 100).toFixed(2);
}

function buatStruk() {
    const idTransaksi = document.getElementById("idTransaksi").value;
    const hargaAdmin = parseInt(document.getElementById("hargaAdmin").value);
    const nomorTujuan = document.getElementById("nomorTujuan").value;

    // Hanya alert jika barang daftar kosong
    if (barangList.length === 0) {
        alert("Tambahkan barang terlebih dahulu sebelum membuat struk!");
        return;
    }

    let totalHarga = barangList.reduce((acc, item) => acc + item.harga, 0);
    let totalKeseluruhan = totalHarga + hargaAdmin;

    // Tanggal dan waktu
    const now = new Date();
    const tanggalCetak = now.toLocaleDateString("ms-MY", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    const waktuCetak = now.toLocaleTimeString("ms-MY");

    // Gambar struk di canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 650 + barangList.length * 40;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.textAlign = "center";

    // Header toko
    ctx.font = "bold 16px Courier";
    ctx.fillText(namaToko, canvas.width / 2, 30);
    ctx.font = "12px Courier";
    ctx.fillText(tanggalCetak + " " + waktuCetak, canvas.width / 2, 50);

    // Konten struk
    ctx.textAlign = "left";
    ctx.font = "14px Courier";
    let y = 80;
    ctx.fillText(`ID Transaksi: ${idTransaksi}`, 20, y);
    y += 20;
    ctx.fillText(`Nombor/Nama Pembeli: ${nomorTujuan}`, 20, y);
    y += 20;

    // Separator
    y += 10;
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(canvas.width - 20, y);
    ctx.stroke();
    y += 20;

    // Daftar barang dengan space antar barang
    barangList.forEach((item, index) => {
        ctx.fillText(`${index + 1}. ${item.nama} - RM${formatHarga(item.harga)}`, 20, y);
        y += 40; // Space lebih besar antar barang
    });

    // Separator sebelum total
    y -= 20;
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(canvas.width - 20, y);
    ctx.stroke();
    y += 30;

    // Total dan admin
    ctx.fillText(`Total: RM${formatHarga(totalHarga)}`, 20, y);
    y += 20;
    ctx.fillText(`Fee: RM${formatHarga(hargaAdmin)}`, 20, y);
    y += 20;
    ctx.fillText(`Total Keseluruhan: RM${formatHarga(totalKeseluruhan)}`, 20, y);

    // Footer
    y += 40;
    ctx.textAlign = "center";
    ctx.font = "12px Courier";
    footerText.split("\n").forEach(line => {
        ctx.fillText(line, canvas.width / 2, y);
        y += 20;
    });
}

function resetForm() {
    document.getElementById("formData").reset();
    barangList = [];
    document.getElementById("barangList").innerHTML = "";
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    alert("Form dan struk berhasil direset!");
}

function cetakGambar() {
    const canvas = document.getElementById("canvas");

    // Muatkan pustaka jsPDF melalui CDN
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js";
    script.onload = () => {
        const { jsPDF } = window.jspdf;

        // Buat PDF baru
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px", // Gunakan pixel agar konsisten dengan ukuran kanvas
            format: [canvas.width, canvas.height], // Pastikan ukuran sama dengan kanvas
        });

        // Ambil data gambar dari kanvas
        const imgData = canvas.toDataURL("image/png");

        // Tambahkan gambar ke PDF tanpa mengubah ukuran
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

        // Muat turun PDF
        pdf.save("Resit-pembayaran.pdf");
    };
    document.body.appendChild(script);
}
