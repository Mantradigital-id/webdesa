// Ganti dengan URL Apps Script kamu (JSONP)
const apiUrl = "https://script.google.com/macros/s/AKfycbwIqQ5QIvBvy_tH5qxStKjVKEAph_9Y7em5TIw-4pmKbfSM_WJf3uI1oLo6NycHnlkijg/exec?callback=handleData";

// =====================
// Callback JSONP
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
    thead.innerHTML = "";
    tbody.innerHTML = "";

    const headers = Object.keys(data[0]);
    const trHead = document.createElement('tr');
    headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

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

    new Chart(document.getElementById('dusunChart').getContext('2d'), {
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

    new Chart(document.getElementById('genderChart').getContext('2d'), {
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

    // ---------------------
    // 4️⃣ PIE CHART UMUR (Kategori)
    // ---------------------
    const ageGroups = { "Anak (<17)":0, "Dewasa (17-59)":0, "Lansia (60+)":0 };
    data.forEach(d => {
        const age = parseInt(d.Umur);
        if(age < 17) ageGroups["Anak (<17)"]++;
        else if(age <= 59) ageGroups["Dewasa (17-59)"]++;
        else ageGroups["Lansia (60+)"]++;
    });

    new Chart(document.getElementById('ageChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: Object.keys(ageGroups),
            datasets: [{
                data: Object.values(ageGroups),
                backgroundColor: ['#FFCE56','#4BC0C0','#9966FF']
            }]
        },
        options: { responsive: true }
    });

    // ---------------------
    // 5️⃣ PIE CHART PENDIDIKAN
    // ---------------------
    const educationCount = {};
    data.forEach(d => educationCount[d.Pendidikan] = (educationCount[d.Pendidikan] || 0) + 1);

    new Chart(document.getElementById('educationChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: Object.keys(educationCount),
            datasets: [{
                data: Object.values(educationCount),
                backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40']
            }]
        },
        options: { responsive: true }
    });

    // ---------------------
    // 6️⃣ PIE CHART PEKERJAAN
    // ---------------------
    const jobCount = {};
    data.forEach(d => jobCount[d.Pekerjaan] = (jobCount[d.Pekerjaan] || 0) + 1);

    new Chart(document.getElementById('jobChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: Object.keys(jobCount),
            datasets: [{
                data: Object.values(jobCount),
                backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF9F40']
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
