// ── Domain URL of running app.py ──────────
const url = "http://localhost:5000/run";

const runBtn     = document.getElementById("runBtn");
const statusText = document.getElementById("statusText");
const placeholder= document.getElementById("placeholder");
const plotImg    = document.getElementById("plotImg");
const errorBox   = document.getElementById("errorBox");
const errorMsg   = document.getElementById("errorMsg");
const scrollBtn  = document.querySelector(".scroll-button a");
const paramNcf   = document.getElementById("param_ncf");
const paramEpsilon = document.getElementById("param_epsilon");
const labelNcf   = document.getElementById("label_ncf");
const labelEpsilon = document.getElementById("label_epsilon");

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 60 ? "block" : "none";
});


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

paramNcf.addEventListener("input", e => {
  labelNcf.textContent = parseInt(e.target.value).toLocaleString();
});

paramEpsilon.addEventListener("input", e => {
  labelEpsilon.textContent = parseFloat(e.target.value).toFixed(1);
});

async function runSimulation() {
  runBtn.disabled = true;
  setStatus("running", '<div class="spinner"></div> Running on VM\u2026');
  showPlaceholder();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        N_CF: parseInt(document.getElementById("param_ncf").value),
        epsilon: parseFloat(document.getElementById("param_epsilon").value)
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error("VM returned " + res.status + ": " + errText);
    }

    const contentType = res.headers.get("Content-Type") || "";

    // Option A: VM returns raw image bytes (Content-Type: image/png)
    if (contentType.includes("image/png")) {
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      showPlot(url);
      setStatus("success", '<i class="fas fa-check-circle"></i> Plot ready');

    // Option B: VM returns JSON { "image": "data:image/png;base64,..." }
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
