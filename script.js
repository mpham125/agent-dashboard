const tabs = ["Defender", "Arctic Wolf", "SCCM", "Rapid7", "Cross-Reference"];
let currentTab = "Defender";

document.addEventListener("DOMContentLoaded", () => {
  loadTab(currentTab);
  document.getElementById("search").addEventListener("input", filterTable);
});

function loadTab(tabName) {
  currentTab = tabName;
  document.getElementById("content").innerHTML = generateTable(tabName);
  filterTable(); // Apply any search filters if needed
}

function generateTable(platform) {
  const headers = ["Machine Name", "Agent Version", "Status", "Last Seen"];
  const sampleData = [
    { name: "DESKTOP-001", version: "1.2.3", status: "Healthy", lastSeen: "2025-06-30" },
    { name: "SERVER-002", version: "2.1.0", status: "Outdated", lastSeen: "2025-06-28" },
    { name: "LAPTOP-003", version: "1.0.0", status: "Missing", lastSeen: "2025-06-29" }
  ];

  let html = `<h2>${platform} Agents</h2><table id="data-table"><thead><tr>`;
  headers.forEach(h => html += `<th>${h}</th>`);
  html += `</tr></thead><tbody>`;

  sampleData.forEach(d => {
    html += `<tr>
      <td>${d.name}</td>
      <td>${d.version}</td>
      <td>${d.status}</td>
      <td>${d.lastSeen}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  return html;
}

function filterTable() {
  const input = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#data-table tbody tr");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}
