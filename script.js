// URL App Script JSON
const API_URL = "https://script.google.com/macros/s/AKfycbxOQ5FBhNDSLgTNnhiGO8U_5V_Ug79CWjvtsnNQVFOHWzOi725JIoV0-j5dpLk2QMENyA/exec";

// Fetch data dari App Script
async function fetchData() {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data;
}

// Render tabel penduduk
function renderTable(data) {
    const table = document.getElementById("penduduk-table");
    table.innerHTML = "";
    data.forEach(item => {
        table.innerHTML += `
            <tr class="border-b hover:bg-green-50">
                <td class="p-2">${item.NIK}</td>
                <td class="p-2">${item.Nama}</td>
                <td class="p-2">${item["Jenis Kelamin"]}</td>
                <td class="p-2">${item.Pekerjaan}</td>
                <td class="p-2">${item.Pendidikan}</td>
                <td class="p-2">${item.Dusun}</td>
            </tr>
        `;
    });
}

// Buat Pie Chart
function createPieChart(id, labels, values, colors) {
    const ctx = document.getElementById(id).getContext("2d");
    return new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" },
            }
        }
    });
}

// Render semua chart
function renderCharts(data) {
    // Gender
    const genderCounts = {};
    data.forEach(d => {
        genderCounts[d["Jenis Kelamin"]] = (genderCounts[d["Jenis Kelamin"]] || 0) + 1;
    });
    createPieChart("chartGender", Object.keys(genderCounts), Object.values(genderCounts), ["#34D399","#60A5FA"]);

    // Pekerjaan
    const jobCounts = {};
    data.forEach(d => jobCounts[d.Pekerjaan] = (jobCounts[d.Pekerjaan]||0)+1);
    createPieChart("chartJob", Object.keys(jobCounts), Object.values(jobCounts), ["#FBBF24","#F87171","#34D399","#60A5FA","#A78BFA"]);

    // Pendidikan
    const eduCounts = {};
    data.forEach(d => eduCounts[d.Pendidikan] = (eduCounts[d.Pendidikan]||0)+1);
    createPieChart("chartEdu", Object.keys(eduCounts), Object.values(eduCounts), ["#FBBF24","#F87171","#34D399","#60A5FA","#A78BFA"]);

    // Dusun
    const dusunCounts = {};
    data.forEach(d => dusunCounts[d.Dusun] = (dusunCounts[d.Dusun]||0)+1);
    createPieChart("chartDusun", Object.keys(dusunCounts), Object.values(dusunCounts), ["#FBBF24","#F87171","#34D399","#60A5FA","#A78BFA"]);
}

// Main
async function main() {
    const data = await fetchData();
    renderTable(data);
    renderCharts(data);
}

main();
