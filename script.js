// Existing platforms data example with added fields:

const sampleData = {
  defender: [
    {
      hostname: "workstation-01",
      status: "Healthy",
      health: "Good",
      lastSeen: "2025-07-01 14:23",
      ipAddress: "192.168.1.101",
      operatingSystem: "Windows 10 Pro",
      version: "4.18.2103.7"
    },
    {
      hostname: "server-02",
      status: "Unhealthy",
      health: "Error",
      lastSeen: "2025-06-30 09:11",
      ipAddress: "192.168.1.52",
      operatingSystem: "Windows Server 2019",
      version: "4.18.2103.7"
    },
  ],
  arcticwolf: [
    // similar structure
  ],
  sccm: [
    // similar structure
  ],
  rapid7: [
    // similar structure
  ],
  crossref: [
    // data combining info from platforms if needed
  ],
};

// Function to generate the table with the new fields

function renderTable(platform) {
  const container = document.getElementById("table-container");
  const data = sampleData[platform] || [];

  if (data.length === 0) {
    container.innerHTML = `<p>No data available for ${platform}</p>`;
    return;
  }

  // Build table headers including new fields
  const tableHeaders = [
    "Hostname",
    "Status",
    "Health",
    "Last Seen",
    "IP Address",
    "Operating System",
    "Version",
  ];

  let table = "<table><thead><tr>";
  tableHeaders.forEach(header => {
    table += `<th>${header}</th>`;
  });
  table += "</tr></thead><tbody>";

  data.forEach(item => {
    table += "<tr>";
    table += `<td>${item.hostname}</td>`;
    table += `<td>${item.status}</td>`;
    table += `<td>${item.health}</td>`;
    table += `<td>${item.lastSeen}</td>`;
    table += `<td>${item.ipAddress || "N/A"}</td>`;
    table += `<td>${item.operatingSystem || "N/A"}</td>`;
    table += `<td>${item.version || "N/A"}</td>`;
    table += "</tr>";
  });

  table += "</tbody></table>";
  container.innerHTML = table;
}

// The rest of your tab switching and filtering code remains the same,
// just make sure to call renderTable() with correct platform keys

// Example of calling renderTable for initial platform
renderTable("defender");
