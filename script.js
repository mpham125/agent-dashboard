const sampleData = {
  defender: [
    {
      hostname: "WS-1234",
      status: "Installed",
      health: "Healthy",
      ip: "192.168.1.101",
      os: "Windows 10",
      version: "4.18.2108.9",
    },
    {
      hostname: "SRV-5678",
      status: "Installed",
      health: "Unhealthy",
      ip: "192.168.1.200",
      os: "Windows Server",
      version: "4.18.2108.9",
    },
  ],
  arcticwolf: [
    {
      hostname: "AW-1001",
      status: "Missing",
      health: "N/A",
      ip: "10.10.0.5",
      os: "Linux",
      version: "2.3.4",
    },
  ],
  sccm: [
    {
      hostname: "SCCM-001",
      status: "Installed",
      health: "Healthy",
      ip: "10.0.0.1",
      os: "Windows 11",
      version: "5.2.0",
    },
  ],
  rapid7: [
    {
      hostname: "R7-9999",
      status: "Installed",
      health: "Healthy",
      ip: "172.16.0.10",
      os: "Windows 10",
      version: "3.1.7",
    },
  ],
  crossref: [],
};

let currentPlatform = "defender";
let currentData = [];
let filteredData = [];
let currentSort = { key: null, ascending: true };

const tabs = document.querySelectorAll(".tab-btn");
const tableContainer = document.getElementById("table-container");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const osFilter = document.getElementById("osFilter");
const exportBtn = document.getElementById("exportBtn");
const refreshBtn = document.getElementById("refreshBtn");

function init() {
  setupTabs();
  loadPlatformData(currentPlatform);
  setupFilters();
  setupExport();
  setupRefresh();
  setupAutoRefresh();
}

function setupTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("active")) return;
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
        t.setAttribute("tabindex", "-1");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      tab.setAttribute("tabindex", "0");
      currentPlatform = tab.dataset.platform;
      loadPlatformData(currentPlatform);
      resetFilters();
    });
  });
}

function resetFilters() {
  searchInput.value = "";
  statusFilter.value = "";
  osFilter.value = "";
}

function loadPlatformData(platform) {
  if (platform === "crossref") {
    currentData = [];
    const labelMap = {
      defender: "Defender",
      arcticwolf: "ArcticWolf",
      sccm: "SCCM",
      rapid7: "Rapid7",
    };

    Object.entries(sampleData).forEach(([key, data]) => {
      if (key !== "crossref") {
        const platformData = data.map((item) => ({
          ...item,
          platform: labelMap[key] || key,
        }));
        currentData = currentData.concat(platformData);
      }
    });
  } else {
    currentData = sampleData[platform] || [];
  }

  currentSort = { key: null, ascending: true };
  applyFiltersAndRender();
}

function setupFilters() {
  [searchInput, statusFilter, osFilter].forEach((el) => {
    el.addEventListener("input", applyFiltersAndRender);
    el.addEventListener("change", applyFiltersAndRender);
  });
}

function applyFiltersAndRender() {
  const searchVal = searchInput.value.trim().toLowerCase();
  const statusVal = statusFilter.value;
  const osVal = osFilter.value;

  filteredData = currentData.filter((item) => {
    const matchesSearch =
      item.hostname.toLowerCase().includes(searchVal) ||
      (item.status && item.status.toLowerCase().includes(searchVal));
    const matchesStatus = statusVal ? item.status === statusVal : true;
    const matchesOS = osVal ? item.os === osVal : true;

    return matchesSearch && matchesStatus && matchesOS;
  });

  applySort();
  renderTable();
}

function applySort() {
  if (!currentSort.key) return;
  filteredData.sort((a, b) => {
    let valA = a[currentSort.key] ?? "";
    let valB = b[currentSort.key] ?? "";

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return currentSort.ascending ? -1 : 1;
    if (valA > valB) return currentSort.ascending ? 1 : -1;
    return 0;
  });
}

function renderTable() {
  if (filteredData.length === 0) {
    tableContainer.innerHTML = "<p>No data to display.</p>";
    return;
  }

  const isCrossRef = currentPlatform === "crossref";

  let html = `<table class="table" role="grid" aria-label="Agent Data Table">
    <thead>
      <tr>
        ${isCrossRef ? renderSortableHeader("platform", "Platform") : ""}
        ${renderSortableHeader("hostname", "Hostname")}
        ${renderSortableHeader("status", "Status")}
        ${renderSortableHeader("health", "Health")}
        ${renderSortableHeader("ip", "IP Address")}
        ${renderSortableHeader("os", "Operating System")}
        ${renderSortableHeader("version", "Version")}
      </tr>
    </thead>
    <tbody>
  `;

  filteredData.forEach((row) => {
    html += `<tr>
      ${isCrossRef ? `<td>${row.platform || ""}</td>` : ""}
      <td>${row.hostname}</td>
      <td>${row.status}</td>
      <td>${row.health}</td>
      <td>${row.ip}</td>
      <td>${row.os}</td>
      <td>${row.version}</td>
    </tr>`;
  });

  html += "</tbody></table>";
  tableContainer.innerHTML = html;

  document.querySelectorAll("th.sortable").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.key;
      if (currentSort.key === key) {
        currentSort.ascending = !currentSort.ascending;
      } else {
        currentSort.key = key;
        currentSort.ascending = true;
      }
      applyFiltersAndRender();
    });
  });
}

function renderSortableHeader(key, label) {
  const isSorted = currentSort.key === key;
  const arrow = isSorted ? (currentSort.ascending ? "▲" : "▼") : "";
  const sortedClass = isSorted ? (currentSort.ascending ? "sorted-asc" : "sorted-desc") : "";
  return `<th class="sortable ${sortedClass}" data-key="${key}" scope="col">${label} <span class="sort-arrow">${arrow}</span></th>`;
}

function setupExport() {
  exportBtn.addEventListener("click", () => {
    if (filteredData.length === 0) {
      alert("No data to export.");
      return;
    }
    exportToCSV(filteredData);
  });
}

function exportToCSV(data) {
  const includePlatform = currentPlatform === "crossref";
  const headers = includePlatform
    ? ["Platform", "Hostname", "Status", "Health", "IP Address", "OS", "Version"]
    : ["Hostname", "Status", "Health", "IP Address", "OS", "Version"];

  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    const values = headers.map((header) => {
      const key = header.toLowerCase().replace(/ /g, "");
      return `"${(row[key] || row[header.toLowerCase()]) ?? ""}"`;
    });
    csvRows.push(values.join(","));
  });

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `agent-dashboard-${currentPlatform}.csv`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function setupRefresh() {
  refreshBtn.addEventListener("click", () => {
    loadPlatformData(currentPlatform);
  });
}

function setupAutoRefresh() {
  setInterval(() => {
    loadPlatformData(currentPlatform);
  }, 5 * 60 * 1000); // every 5 minutes
}

init();
