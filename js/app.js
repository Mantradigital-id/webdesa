// Ganti dengan URL Apps Script kamu
const apiUrl = "https://script.google.com/macros/s/AKfycbwIqQ5QIvBvy_tH5qxStKjVKEAph_9Y7em5TIw-4pmKbfSM_WJf3uI1oLo6NycHnlkijg/exec?callback=handleData";

// =====================
// Fungsi callback JSONP
// =====================
function handleData(data) {
    console.log("Data diterima:", data);

    if(!data || data.length === 0){
        console.warn("Data kosong!");
        return;
    }

    // ---------------------
    // 1️⃣ TABEL PENDUDUK
    // ---------------------
    const table = document.getElementById('pendudukTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Clear sebelumnya
    thead.innerHTML = "";
    tbody.innerHTML = "";

    // Buat header tabel
    const headers = Object.keys(data[0]);
    const trHead = document.createElement('tr');
    headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // Buat isi tabel
    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(h => {
            const td = document.createElement('td');
            td.textContent = row[h];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    // ---------------------
    // 2️⃣ PIE CHART DUSUN
    // ---------------------
    const dusunCount = {};
    data.forEach(d => dusunCount[d.Dusun] = (dusunCount[d.Dusun] || 0) + 1);

    const ctxDusun = document.getElementById('dusunChart').getContext('2d');
    new Chart(ctxDusun, {
        type: 'pie',
        data: {
            labels: Object.keys(dusunCount),
            datasets: [{
                data: Object.values(dusunCount),
                backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40']
            }]
        },
        options: { responsive: true }
    });

    // ---------------------
    // 3️⃣ PIE CHART JENIS KELAMIN
    // ---------------------
    const genderCount = {};
    data.forEach(d => genderCount[d["Jenis Kelamin"]] = (genderCount[d["Jenis Kelamin"]] || 0) + 1);

    const ctxGender = document.getElementById('genderChart').getContext('2d');
    new Chart(ctxGender, {
        type: 'pie',
        data: {
            labels: Object.keys(genderCount),
            datasets: [{
                data: Object.values(genderCount),
                backgroundColor: ['#36A2EB','#FF6384']
            }]
        },
        options: { responsive: true }
    });
}

// ======================
// Tambahkan script JSONP ke halaman
// ======================
(function() {
    const script = document.createElement('script');
    script.src = apiUrl;
    document.body.appendChild(script);
})();
