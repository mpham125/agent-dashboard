// Dummy data for demo; replace this with a fetch() call to your backend
const mockData = [
  {
    DeviceName: "WIN-001",
    OnboardingStatus: "Onboarded",
    SensorHealthState: "Healthy",
    OSPlatform: "Windows 11",
    LastSeen: "2025-06-30T10:30:00Z"
  },
  {
    DeviceName: "WIN-002",
    OnboardingStatus: "Onboarded",
    SensorHealthState: "Warning",
    OSPlatform: "Windows Server 2019",
    LastSeen: "2025-06-29T23:45:00Z"
  }
];

function renderTable(data) {
  const tbody = document.getElementById("device-table-body");
  tbody.innerHTML = "";

  data.forEach(device => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${device.DeviceName}</td>
      <td>${device.OnboardingStatus}</td>
      <td>${device.SensorHealthState}</td>
      <td>${device.OSPlatform}</td>
      <td>${new Date(device.LastSeen).toLocaleString()}</td>
    `;

    tbody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Replace with API fetch in production
  renderTable(mockData);
});
