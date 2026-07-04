function init() {
  const params = new URLSearchParams(window.location.search);

  const characterId = params.get("character_id");
  const characterName = params.get("character_name");

  if (!characterId || !characterName) {
    window.location.href = "/";
    return;
  }

  renderDashboard(characterId, characterName);
}

function renderDashboard(id, name) {
  document.getElementById("status").innerHTML =
    `<p>✔ EVE Authenticated</p>`;

  document.getElementById("mainCharacter").innerHTML =
    `<p><b>${name}</b></p><p>ID: ${id}</p>`;
}

function addCharacter() {
  window.location.href = "https://everecruiter-api.onrender.com/auth/eve/login";
}

init();
