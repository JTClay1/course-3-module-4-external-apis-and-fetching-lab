// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

function clearUI() {
  const out = document.getElementById("alerts-display");
  const err = document.getElementById("error-message");
  out.innerHTML = "";
  err.textContent = "";
  err.classList.add("hidden");
}

function showSummary(title, count) {
  const out = document.getElementById("alerts-display");
  const p = document.createElement("p");
  p.id = "summary";
  p.textContent = `${title}: ${count}`;
  out.appendChild(p);
}

function showHeadlines(features) {
  const out = document.getElementById("alerts-display");
  const ul = document.createElement("ul");
  ul.id = "alerts-list";

  features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = (f && f.properties && f.properties.headline) || "—";
    ul.appendChild(li);
  });

  out.appendChild(ul);
}

function showError(message) {
  const err = document.getElementById("error-message");
  err.textContent = message;
  err.classList.remove("hidden");
}

async function fetchWeatherAlerts(state) {
  try {
    const s = String(state).trim().toUpperCase();

    // validate: exactly two letters
    if (!/^[A-Z]{2}$/.test(s)) {
      throw new Error("Enter a valid 2-letter state code (e.g., NY).");
    }

    clearUI();

    const res = await fetch(weatherApi + s);
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    const data = await res.json();

    const features = Array.isArray(data.features) ? data.features : [];
    showSummary(
      data.title || "Current watches, warnings, and advisories",
      features.length
    );
    showHeadlines(features);

    // hide any old error
    const err = document.getElementById("error-message");
    err.textContent = "";
    err.classList.add("hidden");
  } catch (err) {
    clearUI();
    showError(err.message || "Something went wrong.");
  }
}

const submitButton = document.getElementById("fetch-alerts");
submitButton.addEventListener("click", () => {
  const input = document.getElementById("state-input");
  const state = input.value.trim().toUpperCase();
  fetchWeatherAlerts(state);
  input.value = ""; // lab/tests expect clearing on click
});
