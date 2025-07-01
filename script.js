// Sample Data for each platform (replace with API calls later)
const sampleData = {
  defender: [
    { hostname: "WS-001", status: "Healthy", health: "Good", lastSeen: "2025-06-30" },
    { hostname: "SRV-005", status: "Missing Agent", health: "N/A", lastSeen: "2025-06-28" },
    { hostname: "WS-008", status: "Unhealthy", health: "Critical", lastSeen: "2025-06-29" },
  ],
  arcticwolf: [
    { hostname: "WS-002", status: "Healthy", health: "Good", lastSeen: "2025-06-30" },
    { hostname: "WS-003", status: "Healthy", health: "Good", lastSeen: "2025-06-29" },
  ],
  sccm: [
    { hostname: "SRV-001", status: "Healthy", health: "Good", lastSeen: "2025-06-30" },
    { hostname: "WS-004", status: "Missing Agent", health: "N/A", lastSeen: "2025-06-27" },
  ],
  rapid7: [
    { hostname: "WS-006", status: "Unhealthy", health: "Warning", lastSeen: "2025-06-25" },
    { hostname: "SRV-002", status: "Healthy", health: "Good", lastSeen: "2025-06-29" },
  ],
  crossref: [
    { hostname: "WS-001", defender: "Healthy", arcticwolf: "Healthy", sccm: "Missing", rapid7: "Healthy" },
    { hostname: "SRV-005", defender: "Missing", arcticwolf: "N/A", sccm: "Healthy", rapid7: "Unhealthy" },
  ],
};

let currentPlatform = "defender";

const tabs = document.querySelectorAll(".tab-btn");
const tableContainer = document.getElementById("table-container");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");

function renderTable(data) {
  if (!data || data.length === 0) {
    tableContainer.innerHTML = "<p>No data available.</p>";
    return;
  }

  // Determine columns dynamically based on first item keys
  const columns = Object.keys(data[0]);

  // Build table headers
  let html = "<table><thead><tr>";
  for (const col of columns) {
    html += `<th>${col.charAt(0).toUpperCase() + col.slice(1)}</th>`;
  }
  html += "</tr></thead><tbody>";

  // Build table rows
  for (const row of data) {
    html += "<tr>";
    for (const col of columns) {
      html += `<td>${row[col] ?? ""}</td>`;
    }
    html += "</tr>";
  }

  html += "</tbody></table>";
  tableContainer.innerHTML = html;
}

function filterTable() {
  const query = searchInput.value.toLowerCase();
  let filtered;

  if (currentPlatform === "crossref") {
    filtered = sampleData.crossref.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  } else {
    filtered = sampleData[currentPlatform].filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }
  renderTable(filtered);
}

function setActiveTab(tabBtn) {
  tabs.forEach(t => {
    t.classList.remove("active");
    t.setAttribute("aria-selected", "false");
    t.setAttribute("tabindex", "-1");
  });

  tabBtn.classList.add("active");
  tabBtn.setAttribute("aria-selected", "true");
  tabBtn.setAttribute("tabindex", "0");
  currentPlatform = tabBtn.getAttribute("data-platform");

  searchInput.value = "";
  renderTable(sampleData[currentPlatform]);
}

tabs.forEach(tabBtn => {
  tabBtn.addEventListener("click", () => {
    setActiveTab(tabBtn);
  });
});

searchInput.addEventListener("input", filterTable);

refreshBtn.addEventListener("click", () => {
  // Placeholder for refresh function, ideally fetch data from backend
  alert("Refresh triggered - backend connection pending AWS access.");
});

// Initial render
renderTable(sampleData[currentPlatform]);
