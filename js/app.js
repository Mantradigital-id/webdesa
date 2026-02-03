// Ganti dengan URL Apps Script JSONP
const apiUrl = "https://script.google.com/macros/s/AKfycbwIqQ5QIvBvy_tH5qxStKjVKEAph_9Y7em5TIw-4pmKbfSM_WJf3uI1oLo6NycHnlkijg/exec?callback=handleData";

// Callback JSONP
function handleData(data) {
    if(!data || data.length === 0) return;

    // ================= TABEL PENDUDUK =================
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

    // ================= PIE CHARTS =================
    function createPieChart(ctxId, dataObj, colors){
        new Chart(document.getElementById(ctxId).getContext('2d'), {
            type: 'pie',
            data: {
                labels: Object.keys(dataObj),
                datasets: [{
                    data: Object.values(dataObj),
                    backgroundColor: colors
                }]
            },
            options: { responsive: true }
        });
    }

    // Dusun
    const dusunCount = {};
    data.forEach(d => dusunCount[d.Dusun] = (dusunCount[d.Dusun]||0)+1);
    createPieChart('dusunChart', dusunCount, ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40']);

    // Gender
    const genderCount = {};
    data.forEach(d => genderCount[d["Jenis Kelamin"]] = (genderCount[d["Jenis Kelamin"]]||0)+1);
    createPieChart('genderChart', genderCount, ['#36A2EB','#FF6384']);

    // Umur (Kategori)
    const ageGroups = { "Anak (<17)":0, "Dewasa (17-59)":0, "Lansia (60+)":0 };
    data.forEach(d => {
        const age = parseInt(d.Umur);
        if(age < 17) ageGroups["Anak (<17)"]++;
        else if(age <= 59) ageGroups["Dewasa (17-59)"]++;
        else ageGroups["Lansia (60+)"]++;
    });
    createPieChart('ageChart', ageGroups, ['#FFCE56','#4BC0C0','#9966FF']);

    // Pendidikan
    const educationCount = {};
    data.forEach(d => educationCount[d.Pendidikan] = (educationCount[d.Pendidikan]||0)+1);
    createPieChart('educationChart', educationCount, ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40']);

    // Pekerjaan
    const jobCount = {};
    data.forEach(d => jobCount[d.Pekerjaan] = (jobCount[d.Pekerjaan]||0)+1);
    createPieChart('jobChart', jobCount, ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FFA500']);

    // Status Kawin
    const maritalCount = {};
    data.forEach(d => maritalCount[d["Status Kawin"]] = (maritalCount[d["Status Kawin"]]||0)+1);
    createPieChart('maritalChart', maritalCount, ['#36A2EB','#FF6384','#FFCE56']);
}

// Tambahkan JSONP script
(function(){
    const script = document.createElement('script');
    script.src = apiUrl;
    document.body.appendChild(script);
})();
