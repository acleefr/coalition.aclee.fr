const TOTAL_SEATS = 577;
const MAJORITY_THRESHOLD = Math.floor(TOTAL_SEATS / 2) + 1; // 289

// Seat counts sum to 577 (Assemblée Nationale)
const parties = [
  { id: "lfi",   name: "La France insoumise",               seats: 78,  color: "#CC0000", bloc: "gauche" },
  { id: "pcf",   name: "Parti communiste français",          seats: 9,   color: "#8B0000", bloc: "gauche" },
  { id: "eco",   name: "Les Écologistes",                    seats: 28,  color: "#2E7D32", bloc: "gauche" },
  { id: "ps",    name: "Parti socialiste",                   seats: 69,  color: "#E91E63", bloc: "gauche" },
  { id: "dvg",   name: "Divers gauche",                      seats: 10,  color: "#F48FB1", bloc: "gauche" },
  { id: "dvc",   name: "Divers centre",                      seats: 5,   color: "#FFA726", bloc: "centre" },
  { id: "mdm",   name: "MoDem",                              seats: 33,  color: "#FF9800", bloc: "centre" },
  { id: "ens",   name: "Ensemble !",                         seats: 99,  color: "#1565C0", bloc: "centre" },
  { id: "hor",   name: "Horizons",                           seats: 26,  color: "#1976D2", bloc: "centre" },
  { id: "udi",   name: "Union des Démocrates et Indépendants", seats: 3, color: "#42A5F5", bloc: "centre" },
  { id: "lr",    name: "Les Républicains",                   seats: 39,  color: "#0D47A1", bloc: "droite" },
  { id: "dvd",   name: "Divers droite",                      seats: 26,  color: "#5C6BC0", bloc: "droite" },
  { id: "lrrn",  name: "LR-RN",                              seats: 17,  color: "#37474F", bloc: "droite" },
  { id: "rn",    name: "Rassemblement National",             seats: 125, color: "#1A237E", bloc: "extreme-droite" },
  { id: "ext",   name: "Extrême droite",                     seats: 1,   color: "#000051", bloc: "extreme-droite" },
  { id: "reg",   name: "Régionalistes",                      seats: 9,   color: "#78909C", bloc: "autres" },
];

const blocs = {
  "gauche":          { label: "Gauche",          accent: "#E91E63" },
  "centre":          { label: "Centre",           accent: "#FF9800" },
  "droite":          { label: "Droite",           accent: "#1565C0" },
  "extreme-droite":  { label: "Extrême droite",   accent: "#1A237E" },
  "autres":          { label: "Autres",           accent: "#78909C" },
};

// --- Build the party list UI ---
const partiesContainer = document.getElementById("parties");

Object.entries(blocs).forEach(([blocId, bloc]) => {
  const group = document.createElement("div");
  group.className = "bloc-group";
  group.dataset.bloc = blocId;

  const header = document.createElement("div");
  header.className = "bloc-header";
  header.innerHTML = `
    <span class="bloc-dot" style="background:${bloc.accent}"></span>
    <span class="bloc-label">${bloc.label}</span>
    <button class="bloc-toggle all" data-bloc="${blocId}" title="Tout sélectionner">+</button>
    <button class="bloc-toggle none" data-bloc="${blocId}" title="Tout désélectionner">−</button>
  `;
  group.appendChild(header);

  const items = document.createElement("div");
  items.className = "bloc-items";

  parties
    .filter(p => p.bloc === blocId)
    .forEach(p => {
      const label = document.createElement("label");
      label.className = "party-label";
      label.dataset.partyId = p.id;
      label.innerHTML = `
        <input type="checkbox" id="chk-${p.id}" data-party="${p.id}">
        <span class="color-swatch" style="background:${p.color}"></span>
        <span class="party-name">${p.name}</span>
        <span class="party-seats">${p.seats}</span>
      `;
      items.appendChild(label);
    });

  group.appendChild(items);
  partiesContainer.appendChild(group);
});

// --- Wire up bloc toggle buttons ---
document.querySelectorAll(".bloc-toggle.all").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(`[data-bloc="${btn.dataset.bloc}"] input[type="checkbox"]`)
      .forEach(cb => { cb.checked = true; });
    updateResults();
  });
});
document.querySelectorAll(".bloc-toggle.none").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(`[data-bloc="${btn.dataset.bloc}"] input[type="checkbox"]`)
      .forEach(cb => { cb.checked = false; });
    updateResults();
  });
});

// --- SVG setup ---
const W = 600, H = 320;
const CX = W / 2, CY = H - 60;
const INNER_R = 110, OUTER_R = 190;

const svg = d3.select("#hemicycle")
  .append("svg")
  .attr("viewBox", `0 0 ${W} ${H}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

// Layer order: background → arcs → overlay (majority line + labels always on top)
svg.append("path")
  .attr("d", describeArc(CX, CY, OUTER_R + 10, -Math.PI, 0))
  .attr("fill", "#e8eaf6")
  .attr("stroke", "none");

const arcGroup = svg.append("g");

// Majority indicator — appended AFTER arcGroup so it renders on top of arcs
// midAngle = -π/2 in standard cos/sin gives (0, −r): a vertical line straight up from center
const midAngle = -Math.PI / 2;
const majLine = svg.append("g").attr("class", "majority-line");
majLine.append("line")
  .attr("x1", CX + INNER_R * Math.cos(midAngle))
  .attr("y1", CY + INNER_R * Math.sin(midAngle))
  .attr("x2", CX + (OUTER_R + 14) * Math.cos(midAngle))
  .attr("y2", CY + (OUTER_R + 14) * Math.sin(midAngle))
  .attr("stroke", "#333")
  .attr("stroke-width", 2)
  .attr("stroke-dasharray", "4 3");
majLine.append("text")
  .attr("x", CX + (OUTER_R + 22) * Math.cos(midAngle))
  .attr("y", CY + (OUTER_R + 22) * Math.sin(midAngle) - 6)
  .attr("text-anchor", "middle")
  .attr("font-size", "11")
  .attr("fill", "#555")
  .text(`${MAJORITY_THRESHOLD}`);

// Seat count label — also in overlay layer
const seatLabel = svg.append("text")
  .attr("x", CX)
  .attr("y", CY - 8)
  .attr("text-anchor", "middle")
  .attr("font-size", "28")
  .attr("font-weight", "700")
  .attr("fill", "#1a1a2e");

const seatSubLabel = svg.append("text")
  .attr("x", CX)
  .attr("y", CY + 14)
  .attr("text-anchor", "middle")
  .attr("font-size", "12")
  .attr("fill", "#666");

// Tooltip
const tooltip = d3.select("body").append("div").attr("class", "arc-tooltip");

const arcGen = d3.arc().innerRadius(INNER_R).outerRadius(OUTER_R);

function updateResults() {
  const selected = parties.filter(p => {
    const cb = document.getElementById(`chk-${p.id}`);
    return cb && cb.checked;
  });

  const totalSeats = selected.reduce((s, p) => s + p.seats, 0);
  const hasMajority = totalSeats >= MAJORITY_THRESHOLD;

  // Update summary panel
  document.getElementById("total-seats").textContent = totalSeats;
  const majEl = document.getElementById("majority-status");
  majEl.textContent = hasMajority ? "Oui ✓" : "Non";
  majEl.className = hasMajority ? "has-majority" : "no-majority";

  // Progress bar
  const pct = Math.min(totalSeats / MAJORITY_THRESHOLD * 100, 100);
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-fill").style.background =
    hasMajority ? "#2E7D32" : "#1565C0";
  document.getElementById("progress-label").textContent =
    hasMajority
      ? `+${totalSeats - MAJORITY_THRESHOLD} au-dessus de la majorité`
      : `${MAJORITY_THRESHOLD - totalSeats} sièges manquants`;

  // Seat label
  seatLabel.text(totalSeats || "");
  seatSubLabel.text(totalSeats ? `siège${totalSeats > 1 ? "s" : ""}` : "");

  // Build arc data for ALL parties (proportional to 577),
  // marking each as selected or not
  const selectedSet = new Set(selected.map(p => p.id));
  let startAngle = -Math.PI / 2;
  const data = parties.map(p => {
    const angle = (p.seats / TOTAL_SEATS) * Math.PI;
    const d = { ...p, startAngle, endAngle: startAngle + angle, active: selectedSet.has(p.id) };
    startAngle += angle;
    return d;
  });

  // Draw arcs — all parties always visible; inactive ones are dimmed
  arcGroup.selectAll(".arc").remove();
  arcGroup.selectAll(".arc")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("transform", `translate(${CX},${CY})`)
    .attr("d", arcGen)
    .attr("fill", d => d.active ? d.color : "#d0d4e8")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .attr("opacity", d => d.active ? 1 : 0.55)
    .on("mousemove", (event, d) => {
      const pct = ((d.seats / TOTAL_SEATS) * 100).toFixed(1);
      tooltip
        .style("display", "block")
        .style("left", event.pageX + 14 + "px")
        .style("top", event.pageY - 36 + "px")
        .html(`<strong>${d.name}</strong><br>${d.seats} sièges (${pct}%)`);
    })
    .on("mouseleave", () => tooltip.style("display", "none"));
}

// Helper: SVG arc path string for background shape
function describeArc(x, y, r, startAngle, endAngle) {
  const sx = x + r * Math.cos(startAngle);
  const sy = y + r * Math.sin(startAngle);
  const ex = x + r * Math.cos(endAngle);
  const ey = y + r * Math.sin(endAngle);
  return `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey} L ${x} ${y} Z`;
}

// Wire checkboxes
document.addEventListener("change", e => {
  if (e.target.matches("input[type='checkbox']")) updateResults();
});

updateResults();
