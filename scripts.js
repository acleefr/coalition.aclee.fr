const majorityThreshold = 310; // Seuil de la majorité
const checkboxes = document.querySelectorAll('#parties input[type="checkbox"]');
const totalSeatsElement = document.getElementById('total-seats');
const majorityStatusElement = document.getElementById('majority-status');

// Sélection de l'élément SVG où dessiner l'hémicycle avec D3.js
const svg = d3.select("#hemicycle")
    .append("svg")
    .attr("width", 600)
    .attr("height", 300);

// Définition de l'arc pour dessiner les tranches de l'hémicycle
const arc = d3.arc()
    .innerRadius(100)
    .outerRadius(150);

// Fonction pour mettre à jour les résultats
function updateResults() {
    let totalSeats = 0;
    let data = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const seats = parseInt(checkbox.getAttribute('data-seats'));
            totalSeats += seats;
            data.push({
                seats: seats,
                color: checkbox.getAttribute('data-color')
            });
        }
    });

    // Mise à jour de l'affichage du nombre total de sièges et du statut de la majorité
    totalSeatsElement.textContent = totalSeats;
    majorityStatusElement.textContent = totalSeats >= majorityThreshold ? 'Oui' : 'Non';

    // Calculer l'angle total disponible en radians (ici on utilise Math.PI pour demi-cercle)
    const totalAngle = Math.PI;

    // Calculer les angles proportionnels pour chaque tranche
    const totalSelectedSeats = data.reduce((sum, d) => sum + d.seats, 0);
    let startAngle = -Math.PI / 2;
    data.forEach(d => {
        d.startAngle = startAngle;
        d.endAngle = startAngle + (d.seats / totalSelectedSeats) * totalAngle;
        startAngle = d.endAngle;
    });

    // Supprimer les anciens arcs avant de dessiner de nouveaux
    svg.selectAll(".arc").remove();

    // Mettre à jour l'hémicycle avec les nouvelles données
    const arcs = svg.selectAll(".arc")
        .data(data);

    arcs.enter()
        .append("path")
        .attr("class", "arc")
        .attr("transform", "translate(300, 150)")
        .merge(arcs)
        .attr("d", arc)
        .attr("fill", d => d.color);

    arcs.exit().remove();
}

// Ajouter un écouteur d'événement pour chaque case à cocher afin de déclencher la mise à jour des résultats
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateResults);
});

// Appeler la fonction updateResults pour initialiser l'affichage avec les valeurs par défaut
updateResults();
