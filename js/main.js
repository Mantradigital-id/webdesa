const apiUrl = "https://script.google.com/macros/s/AKfycbxOQ5FBhNDSLgTNnhiGO8U_5V_Ug79CWjvtsnNQVFOHWzOi725JIoV0-j5dpLk2QMENyA/exec"; 
let rawData = [], filteredData = [];

async function loadData() {
  const res = await fetch(apiUrl);
  rawData = await res.json();

  rawData.forEach(p => {
    const dob = new Date(p["Tanggal Lahir"]);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    p["Umur"] = age;
  });

  populateFilters();
  applyFilters();
}

function populateFilters() {
  const dusunSet = new Set(rawData.map(p => p["Dusun"]));
  const rtSet = new Set(rawData.map(p => p["RT"]));
  const rwSet = new Set(rawData.map(p => p["RW"]));

  const dusunSelect = document.getElementById("dusunFilter");
  const rtSelect = document.getElementById("rtFilter");
  const rwSelect = document.getElementById("rwFilter");

  dusunSet.forEach(d => dusunSelect.appendChild(new Option(d, d)));
  rtSet.forEach(d => rtSelect.appendChild(new Option(d, d)));
  rwSet.forEach(d => rwSelect.appendChild(new Option(d, d)));

  dusunSelect.addEventListener("change", applyFilters);
  rtSelect.addEventListener("change", applyFilters);
  rwSelect.addEventListener("change", applyFilters);
}

function applyFilters() {
  const dusun = document.getElementById("dusunFilter").value;
  const rt = document.getElementById("rtFilter").value;
  const rw = document.getElementById("rwFilter").value;

  filteredData = rawData.filter(p => 
    (dusun === "All" || p["Dusun"] === dusun) &&
    (rt === "All" || p["RT"] === rt) &&
    (rw === "All" || p["RW"] === rw)
  );

  renderDashboard();
  renderCharts();
  renderTable();
}

function renderDashboard() {
  document.getElementById("totalPenduduk").textContent = filteredData.length;
  document.getElementById("totalLaki").textContent = filteredData.filter(p=>p["Jenis Kelamin"]==="Laki-laki").length;
  document.getElementById("totalPerempuan").textContent = filteredData.filter(p=>p["Jenis Kelamin"]==="Perempuan").length;
  document.getElementById("totalRT").textContent = new Set(filteredData.map(p=>p["RT"])).size;
  document.getElementById("totalRW").textContent = new Set(filteredData.map(p=>p["RW"])).size;
}

let genderChartInstance, ageChartInstance, jobChartInstance, eduChartInstance;
function renderCharts() {
  const genderCount={Laki:0,Perempuan:0};
  filteredData.forEach(p => {
    if(p["Jenis Kelamin"]==="Laki-laki") genderCount.Laki++;
    else genderCount.Perempuan++;
  });

  if(genderChartInstance) genderChartInstance.destroy();
  genderChartInstance = new Chart(document.getElementById("genderChart"), {
    type:"pie",
    data:{
      labels:["Laki-laki","Perempuan"],
      datasets:[{data:[genderCount.Laki,genderCount.Perempuan],backgroundColor:["#36A2EB","#FF6384"]}]
    }
  });

  const ageRanges={'0-17':0,'18-30':0,'31-45':0,'46-60':0,'61+':0};
  filteredData.forEach(p => {
    const age = p["Umur"];
    if(age<=17) ageRanges['0-17']++;
    else if(age<=30) ageRanges['18-30']++;
    else if(age<=45) ageRanges['31-45']++;
    else if(age<=60) ageRanges['46-60']++;
    else ageRanges['61+']++;
  });

  if(ageChartInstance) ageChartInstance.destroy();
  ageChartInstance = new Chart(document.getElementById("ageChart"), {
    type:"bar",
    data:{
      labels:Object.keys(ageRanges),
      datasets:[{label:"Jumlah",data:Object.values(ageRanges),backgroundColor:"#4BC0C0"}]
    }
  });

  const jobCount={}, eduCount={};
  filteredData.forEach(p => {
    jobCount[p["Pekerjaan"]] = (jobCount[p["Pekerjaan"]]||0)+1;
    eduCount[p["Pendidikan"]] = (eduCount[p["Pendidikan"]]||0)+1;
  });

  if(jobChartInstance) jobChartInstance.destroy();
  jobChartInstance = new Chart(document.getElementById("jobChart"), {
    type:"pie",
    data:{
      labels:Object.keys(jobCount),
      datasets:[{data:Object.values(jobCount),backgroundColor:["#FF6384","#36A2EB","#FFCE56"]}]
    }
  });

  if(eduChartInstance) eduChartInstance.destroy();
  eduChartInstance = new Chart(document.getElementById("educationChart"), {
    type:"pie",
    data:{
      labels:Object.keys(eduCount),
      datasets:[{data:Object.values(eduCount),backgroundColor:["#36A2EB","#FF6384","#4BC0C0"]}]
    }
  });
}

function renderTable() {
  if($.fn.DataTable.isDataTable('#pendudukTable')) $('#pendudukTable').DataTable().destroy();
  const tbody = document.querySelector("#pendudukTable tbody");
  tbody.innerHTML = "";
  filteredData.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p["NIK"]}</td><td>${p["No KK"]}</td><td>${p["Nama"]}</td>
      <td>${p["Jenis Kelamin"]}</td><td>${p["Umur"]}</td><td>${p["Pekerjaan"]}</td>
      <td>${p["Pendidikan"]}</td><td>${p["Status Kawin"]}</td><td>${p["Alamat"]}</td><td>${p["Dusun"]}</td><td>${p["RT"]}</td><td>${p["RW"]}</td>
    `;
    tbody.appendChild(tr);
  });
  $('#pendudukTable').DataTable();
}

loadData();

