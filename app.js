const TOOL_CORP_ID = 98012419;

// --------------------
// TOKEN HANDLING
// --------------------
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");

if (tokenFromUrl) {
  setToken(tokenFromUrl);
  window.history.replaceState({}, document.title, "/dashboard");
}

function getToken() {
  return localStorage.getItem("session");
}

function setToken(token) {
  localStorage.setItem("session", token);
}

// --------------------
// START APP
// --------------------
checkAuth();

// --------------------
// AUTH CHECK
// --------------------
async function checkAuth() {
  const token = getToken();

  if (!token) {
    return showLogin();
  }

  try {
    const res = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return showLogin();
    }

    const data = await res.json();
    renderDashboard(data);

  } catch (err) {
    console.error(err);
    showLogin();
  }
}

// --------------------
// UI STATES
// --------------------
function showLoading(show) {
  const el = document.getElementById("loading");
  if (el) el.style.display = show ? "block" : "none";
}

function showLogin() {
  showLoading(false);

  const login = document.getElementById("loginContainer");
  const dash = document.getElementById("dashboardContainer");

  if (login) login.style.display = "block";
  if (dash) dash.style.display = "none";
}

// --------------------
// DASHBOARD RENDER
// --------------------
function renderDashboard(data) {
  showLoading(false);

  const login = document.getElementById("loginContainer");
  const dash = document.getElementById("dashboardContainer");

  if (login) login.style.display = "none";
  if (dash) dash.style.display = "block";

  const characters = data?.characters || [];
  const main = data?.main_character;

  if (!characters.length) {
    return showLogin();
  }

  const mainName = document.getElementById("mainCharName");
  if (mainName && main) {
    mainName.innerText = `Main: ${main.character_name}`;
  }

  const list = document.getElementById("characterList");
  if (!list) return;

  list.innerHTML = "";

  characters.forEach(char => {
    const card = document.createElement("div");
    card.className = "character-card";

    const isMember = char.is_member;
    const status = char.recruitment_status || "new";

    let statusLabel = "New";
    if (status === "applied") statusLabel = "Applied";
    if (status === "approved") statusLabel = "Approved";

    card.innerHTML = `
      <div class="char-left">
        <img src="${char.portrait_url}" class="portrait" />
      </div>

      <div class="char-body">
        <h3>${char.character_name}</h3>

        <p class="corp">${char.corporation_name}</p>
        <p class="alliance">${char.alliance_name || "No Alliance"}</p>

        <div class="badges">
          <span class="badge ${isMember ? "member" : "external"}">
            ${isMember ? "Member" : "External"}
          </span>
          
          <span class="badge role">
            ${char.role_label || ""}
          </span>
        </div>
      </div>

      <div class="char-actions">

        ${
          isMember
            ? `<button class="btn disabled">Connected</button>`
            : `<button class="btn apply">Apply</button>`
        }

        <button class="btn discord">
          Discord
        </button>

      </div>
    `;

    // --------------------
    // APPLY BUTTON
    // --------------------
    const applyBtn = card.querySelector(".apply");

    if (applyBtn) {
      applyBtn.onclick = async () => {
        applyBtn.innerText = "Submitting...";
        applyBtn.disabled = true;

        try {
          const token = getToken();

          const res = await fetch("/api/apply", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (!res.ok) throw new Error("Apply failed");

          applyBtn.innerText = "Applied ✔";

        } catch (err) {
          console.error(err);
          applyBtn.innerText = "Apply";
          applyBtn.disabled = false;
        }
      };
    }

    // --------------------
    // DISCORD BUTTON
    // --------------------
    const discordBtn = card.querySelector(".discord");

    if (discordBtn) {
      discordBtn.onclick = () => {
        alert("Discord integration coming next step");
      };
    }

    list.appendChild(card);
  });
}


  // --------------------
  // BASIC INFO
  // --------------------
  const charName = document.getElementById("charName");
  const corp = document.getElementById("corp");
  const alliance = document.getElementById("alliance");
  const status = document.getElementById("status");

  if (charName) charName.innerText = character.character_name;

  if (corp) {
    corp.innerText = meta?.corporation_name || character.corporation_id;
  }
  
  if (alliance) {
    alliance.innerText =
      meta?.alliance_name || "No Alliance";
  }

  // --------------------
  // STATUS
  // --------------------
  const isMember = character.corporation_id === TOOL_CORP_ID;

  if (status) {
    status.innerText = isMember ? "Member" : "External Applicant";
  }

  // --------------------
  // APPLY BUTTON
  // --------------------
  const applyBtn = document.getElementById("applyBtn");

  if (applyBtn) {
    applyBtn.style.display = isMember ? "none" : "block";

    applyBtn.onclick = async () => {
      applyBtn.innerText = "Submitting...";
      applyBtn.disabled = true;

      try {
        const token = getToken();

        const res = await fetch("/api/apply", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Apply failed");

        applyBtn.innerText = "Applied ✔";

      } catch (err) {
        console.error(err);
        applyBtn.innerText = "Apply";
        applyBtn.disabled = false;
      }
    };
  }

  // --------------------
  // DISCORD BUTTON (placeholder)
  // --------------------
  const discordBtn = document.getElementById("discordBtn");

  if (discordBtn) {
    discordBtn.onclick = () => {
      alert("Discord integration coming next step");
    };
  }

