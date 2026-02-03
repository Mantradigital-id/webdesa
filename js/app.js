const apiUrl = "https://script.google.com/macros/s/AKfycbxOQ5FBhNDSLgTNnhiGO8U_5V_Ug79CWjvtsnNQVFOHWzOi725JIoV0-j5dpLk2QMENyA/exec"; // Ganti dengan URL Apps Script

fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    // =====================
    // Pie Chart Dusun
    // =====================
    const dusunCount = {};
    data.forEach(d => dusunCount[d.Dusun] = (dusunCount[d.Dusun] || 0) + 1);

    const ctx = document.getElementById('dusunChart').getContext('2d');
    new Chart(ctx, {
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

    // =====================
    // Tabel Penduduk
    // =====================
    const table = document.getElementById('pendudukTable');
    const headers = Object.keys(data[0]);

    // Buat header tabel
    const thead = table.querySelector('thead');
    const trHead = document.createElement('tr');
    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // Buat isi tabel
    const tbody = table.querySelector('tbody');
    data.forEach(row => {
      const tr = document.createElement('tr');
      headers.forEach(h => {
        const td = document.createElement('td');
        td.textContent = row[h];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error("Error fetching data:", err));
