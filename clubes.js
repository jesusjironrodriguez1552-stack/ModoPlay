// EQUIPOS PARTICIPANTES EN LA LIGA EFOOTBALL 2025
// Para agregar o quitar equipos, simplemente modifica este array
const jugadores = [
  { name: "Royyer10", club: "Inter" },
  { name: "Benny Caballero", club: "FC Barcelona" },
  { name: "LW🐉", club: "AC Milan" },
  { name: "the Andres", club: "Real Madrid" },
  { name: "alexander", club: "Santos" },
  { name: "399633", club: "Newcastle" },
  { name: "ElianVz17", club: "Venezuela" },
  { name: "Brn_14", club: "Arsenal", id: "ASEZ-609-571-075" },
  { name: "Ever Gutierrez", club: "SC Corinthians" },
  { name: "Santislowly", club: "Club América" },
  { name: "Máx", club: "Botafogo" },
  { name: "Bangbrousnetwork", club: "Ajax", id: "ASQL-020-982-058" },
  { name: "Angel3.1416", club: "Club América", id: "ASAA-031-059-500" },
  { name: "DorianBU", club: "FC Barcelona", id: "ASAA-064-323-667" },
  { name: "Alberto Sosa", club: "Manchester United", id: "ASAA-738-732-120" },
  { name: "carlosandreess", club: "Junior FC", id: "ASAA-000-436-279" },
  { name: "Esteban David Meriño", club: "Atlético Nacional", id: "ASNQ-494-301-322" },
  { name: "BRANZZINO-777", club: "Japón", id: "ASDN-004-617-039" },
  { name: "Carlos Andrés Hurtado Cuero", club: "Gomito58", id: "ASAA-789-208-113" },
  { name: "JEFFRY10", club: "Benfica", id: "ASBB-584-742-141" }
];


// ... tu código existente ...

// Exportación por defecto
export default clubes;
// NOTA: 
// - name: Nombre del jugador/usuario
// - club: Equipo que representa
// 
// El sistema calculará automáticamente:
// - Número total de equipos
// - Número de jornadas (equipos - 1) * 2
// - Número total de partidos (equipos * (equipos - 1))
//
// Compatible con cualquier número de equipos (mínimo 3 para que funcione el sistema de liga)
