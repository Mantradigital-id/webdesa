const apiUrl = "https://script.google.com/macros/s/AKfycbwIqQ5QIvBvy_tH5qxStKjVKEAph_9Y7em5TIw-4pmKbfSM_WJf3uI1oLo6NycHnlkijg/exec?callback=handleData";

function handleData(data){
    if(!data || data.length===0) return;

    // ======================= Ringkasan Cards =======================
    document.getElementById('totalPenduduk').querySelector('p').textContent = data.length;
    const dusunSet = new Set();
    let laki=0, perempuan=0;
    data.forEach(d=>{
        dusunSet.add(d.Dusun);
        if(d["Jenis Kelamin"]==="Laki-laki") laki++;
        else if(d["Jenis Kelamin"]==="Perempuan") perempuan++;
    });
    document.getElementById('totalDusun').querySelector('p').textContent = dusunSet.size;
    document.getElementById('totalLaki').querySelector('p').textContent = laki;
    document.getElementById('totalPerempuan').querySelector('p').textContent = perempuan;

    // ======================= Tabel Penduduk =======================
    const table = document.getElementById('pendudukTable');
    const thead = table.querySelector('thead'); const tbody = table.querySelector('tbody');
    thead.innerHTML=""; tbody.innerHTML="";
    const headers = Object.keys(data[0]);
    const trHead = document.createElement('tr');
    headers.forEach(h=>{const th=document.createElement('th');th.textContent=h;trHead.appendChild(th);});
    thead.appendChild(trHead);
    data.forEach(row=>{const tr=document.createElement('tr'); headers.forEach(h=>{const td=document.createElement('td'); td.textContent=row[h];tr.appendChild(td);});tbody.appendChild(tr);});

    // ======================= Charts =======================
    function createChart(ctxId,dataObj,type,colors,horizontal=false){
        const ctx = document.getElementById(ctxId).getContext('2d');
        return new Chart(ctx,{
            type: type,
            data:{labels:Object.keys(dataObj), datasets:[{label:ctxId,data:Object.values(dataObj),backgroundColor:colors}]},
            options:{indexAxis: horizontal?'y':'x', responsive:true, plugins:{legend:{position:'bottom'}}}
        });
    }

    // Dusun -> Pie
    const dusunCount = {}; data.forEach(d=>dusunCount[d.Dusun]=(dusunCount[d.Dusun]||0)+1);
    createChart('dusunChart',dusunCount,'pie',['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40']);

    // Gender -> Doughnut
    const genderCount={}; data.forEach(d=>genderCount[d["Jenis Kelamin"]]=(genderCount[d["Jenis Kelamin"]]||0)+1);
    createChart('genderChart',genderCount,'doughnut',['#36A2EB','#FF6384']);

    // Umur -> Bar
    const ageGroups = {"Anak (<17)":0,"Dewasa (17-59)":0,"Lansia (60+)":0};
    data.forEach(d=>{const age=parseInt(d.Umur); if(age<17) ageGroups["Anak (<17)"]++; else if(age<=59) ageGroups["Dewasa (17-59)"]++; else ageGroups["Lansia (60+)"]++;});
    createChart('ageChart',ageGroups,'bar',['#FFCE56','#4BC0C0','#9966FF']);

    // Pendidikan -> Horizontal Bar
    const educationCount={}; data.forEach(d=>educationCount[d.Pendidikan]=(educationCount[d.Pendidikan]||0)+1);
    createChart('educationChart',educationCount,'bar',['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40'],true);

    // Pekerjaan -> Horizontal Bar
    const jobCount={}; data.forEach(d=>jobCount[d.Pekerjaan]=(jobCount[d.Pekerjaan]||0)+1);
    createChart('jobChart',jobCount,'bar',['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FFA500'],true);

    // Status Kawin -> Doughnut
    const maritalCount={}; data.forEach(d=>maritalCount[d["Status Kawin"]] = (maritalCount[d["Status Kawin"]]||0)+1);
    createChart('maritalChart',maritalCount,'doughnut',['#36A2EB','#FF6384','#FFCE56']);
}

// JSONP Script
(function(){const script=document.createElement('script');script.src=apiUrl;document.body.appendChild(script);})();
