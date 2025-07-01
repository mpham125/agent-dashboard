// Mock sample data for each platform
const mockData = {
  defender: [
    { hostname: "WIN-DEF-001", status: "Healthy", health: "Good", lastSeen: "2025-06-30" },
    { hostname: "WIN-DEF-002", status: "Unhealthy", health: "Warning", lastSeen: "2025-06-28" },
  ],
  articwolf: [
    { hostname: "AW-001", status: "Healthy", health: "Good", lastSeen: "2025-06-29" },
    { hostname: "AW-002", status: "Missing Agent", health: "N/A", lastSeen: "2025-05-30" },
  ],
  sccm: [
    { hostname: "SCCM-001", status: "Healthy", health: "Good", lastSeen: "2025-06-30" },
    { hostname: "SCCM-002", status: "Unhealthy", health: "Warning", lastSeen: "2025-06-25" },
  ],
  rapid7: [
    { hostname: "R7-001", status: "Healthy", health: "Good", lastSeen: "2025-06-30" },
    { hostname: "R7-002", status: "Unhealthy", health: "Critical", lastSeen: "2025-06-26" },
  ],
  crossref: [
    // This would ideally be the cross reference data, simplified for now
    { hostname: "WIN-DEF-001", defender: "Healthy", articwolf: "Healthy", sccm: "Healthy", rapid7: "Healthy" },
    { hostname: "AW-002", defender: "Missing", articwolf: "Missing Agent", sccm: "Missing", rapid7: "Unhealthy" },
  ],
};

let currentPlatform = "defender";

const tabs = document.querySelectorAll(".tab-btn");
const tableContainer = document.getElementById("table-container");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");
const apiNote = document.getElementById("api-note");

// Render table based on currentPlatform and search filter
function renderTable() {
  const data = fetchAgentData(currentPlatform);
  const filter = searchInput.value.toLowerCase();

  // Filter data by hostname or status
  const filteredData = data.filter((item) => {
    return Object.values(item).some(
      (val) => val.toString().toLowerCase().includes(filter)
    );
  });

  if (filteredData.length === 0) {
    tableContainer.innerHTML = "<p>No matching data found.</p>";
    return;
  }

  let tableHtml = "<table><thead><tr>";

  // Define columns depending on platform
  if (currentPlatform === "crossref") {
    tableHtml +=
      "<th>Hostname</th><th>Defender</th><th>ArcticWolf</th><th>SCCM</th><th>Rapid7</th>";
  } else {
    tableHtml +=
      "<th>Hostname</th><th>Status</th><th>Health</th><th>Last Seen</th>";
  }
  tableHtml += "</tr></thead><tbody>";

  filteredData.forEach((row) => {
    tableHtml += "<tr>";
    if (currentPlatform === "crossref") {
      tableHtml += `<td>${row.hostname}</td><td>${row.defender || "-"}</td><td>${row.articwolf || "-"}</td><td>${row.sccm || "-"}</td><td>${row.rapid7 || "-"}</td>`;
    } else {
      tableHtml += `<td>${row.hostname}</td><td>${row.status}</td><td>${row.health}</td><td>${row.lastSeen}</td>`;
    }
    tableHtml += "</tr>";
  });

  tableHtml += "</tbody></table>";
  tableContainer.innerHTML = tableHtml;
}

// Stub for data fetching - currently returns mock data
function fetchAgentData(platform) {
  return mockData[platform] || [];
}

// Handle tab click
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentPlatform = tab.getAttribute("data-platform");
    searchInput.value = "";
    renderTable();
  });
});

// Handle search input change
searchInput.addEventListener("input", () => {
  renderTable();
});

// Handle refresh button click (for demo, just re-renders)
refreshBtn.addEventListener("click", () => {
  renderTable();
});

// Initial render
renderTable();
