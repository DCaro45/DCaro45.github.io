// ── Configuration ─────────────────────────────────────────────────────────────
const VM_BASE   = "http://35.209.106.206:5000";   // ← replace after IP is assigned
const SECRET    = "054ba91d47086be0e66970966c25db719735987bc5dee8de75bae309f6f1bcdb";            // ← replace with the value set in SHARED_SECRET env var
const PING_INTERVAL_MS  = 60 * 1000;         // heartbeat every
const POLL_INTERVAL_MS  = 1000;                   // readiness poll every
const POLL_TIMEOUT_MS   = 3 * 60 * 1000;           // give up waking after
//────────────────────────────────────────────────────────────

// ── DOM refs
const runBtn       = document.getElementById("runBtn");
const statusText   = document.getElementById("statusText");
const placeholder  = document.getElementById("placeholder");
const plotImg      = document.getElementById("plotImg");
const errorBox     = document.getElementById("errorBox");
const errorMsg     = document.getElementById("errorMsg");
const scrollBtn    = document.querySelector(".scroll-button a");
const paramNcf     = document.getElementById("param_ncf");
const paramEpsilon = document.getElementById("param_epsilon");
const labelNcf     = document.getElementById("label_ncf");
const labelEpsilon = document.getElementById("label_epsilon");

// ── Shared fetch helper (attaches secret header)
function apiFetch(path, options = {}) {
  return fetch(VM_BASE + path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "X-Shared-Secret": SECRET,
    },
  });
}

// ── Scroll button
window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 60 ? "block" : "none";
});

// ── Status helpers
function setStatus(state, text) {
  statusText.className = "status " + state;
  statusText.innerHTML = text;
}

function showPlaceholder() {
  placeholder.style.display = "";
  plotImg.classList.remove("visible");
  errorBox.classList.remove("visible");
}

function showPlot(src) {
  placeholder.style.display = "none";
  errorBox.classList.remove("visible");
  plotImg.src = src;
  plotImg.classList.add("visible");
}

function showError(msg) {
  placeholder.style.display = "none";
  plotImg.classList.remove("visible");
  errorMsg.textContent = msg || "Something went wrong. Check that the VM is running and try again.";
  errorBox.classList.add("visible");
}

// ── Slider labels
paramNcf.addEventListener("input", e => {
  labelNcf.textContent = parseInt(e.target.value).toLocaleString();
});
paramEpsilon.addEventListener("input", e => {
  labelEpsilon.textContent = parseFloat(e.target.value).toFixed(1);
});

// ── Heartbeat — keeps the VM alive while the user is on the page
let heartbeatTimer = null;

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    apiFetch("/ping").catch(() => {});   // fire-and-forget; VM may already be off
  }, PING_INTERVAL_MS);
}

function stopHeartbeat() {
  if (heartbeatTimer !== null) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

// ── Wait for VM to be reachable, then resolve
function waitForVM() {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    const poll = () => {
      apiFetch("/ping")
        .then(r => { if (r.ok) resolve(); else tryAgain(); })
        .catch(tryAgain);
    };
    function tryAgain() {
      if (Date.now() >= deadline) {
        reject(new Error("VM did not become reachable within 3 minutes."));
      } else {
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    }
    poll();
  });
}

// ── Page load — wake the VM and start heartbeat
(async function onLoad() {
  setStatus("running", '<div class="spinner"></div> Connecting\u2026');
  runBtn.disabled = true;

  try {
    // Send the first ping (this also triggers the Cloud Function to start the VM
    // if you wire the CF to be called from here instead — see note in Step 5 docs).
    // For now: the ping will fail while the VM is off, and waitForVM() will retry.
    await waitForVM();
    setStatus("", "");
    runBtn.disabled = false;
    startHeartbeat();
  } catch (err) {
    setStatus("error", '<i class="fas fa-times-circle"></i> VM unreachable — try refreshing');
    runBtn.disabled = false;   // still let user try manually
  }
})();

// ── Run simulation
async function runSimulation() {
  runBtn.disabled = true;
  setStatus("running", '<div class="spinner"></div> Running on VM\u2026');
  showPlaceholder();

  try {
    const res = await apiFetch("/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        N_CF:    parseInt(paramNcf.value),
        epsilon: parseFloat(paramEpsilon.value),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error("VM returned " + res.status + ": " + errText);
    }

    const contentType = res.headers.get("Content-Type") || "";

    if (contentType.includes("image/png")) {
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      showPlot(objectUrl);
      setStatus("success", '<i class="fas fa-check-circle"></i> Plot ready');

    } else if (contentType.includes("application/json")) {
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const src = data.image.startsWith("data:") ? data.image : "data:image/png;base64," + data.image;
      showPlot(src);
      setStatus("success", '<i class="fas fa-check-circle"></i> Plot ready');

    } else {
      throw new Error("Unexpected response format from VM.");
    }

  } catch (err) {
    console.error(err);
    showError(err.message);
    setStatus("error", '<i class="fas fa-times-circle"></i> Failed \u2014 see error above');
  } finally {
    runBtn.disabled = false;
  }
}
