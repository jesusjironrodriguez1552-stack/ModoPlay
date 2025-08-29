// EQUIPOS PARTICIPANTES EN LA LIGA EFOOTBALL 2025
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

// Definir grupos con los nombres directos de los participantes
const grupos = {
    A: [
        "Royyer10 (Inter)",                    // #1
        "alexander (Santos)",                  // #5  
        "Ever Gutierrez (SC Corinthians)",     // #9
        "Angel3.1416 (Club América)",          // #13
        "Esteban David Meriño (Atlético Nacional)", // #17
        "JEFFRY10 (Benfica)"                  // #21
    ],
    B: [
        "Benny Caballero (FC Barcelona)",     // #2
        "399633 (Newcastle)",                 // #6
        "Santislowly (Club América)",         // #10
        "DorianBU (FC Barcelona)",            // #14
        "BRANZZINO-777 (Japón)"               // #18
    ],
    C: [
        "LW🐉 (AC Milan)",                     // #3
        "ElianVz17 (Venezuela)",              // #7
        "Máx (Botafogo)",                     // #11
        "Alberto Sosa (Manchester United)",   // #15
        "Carlos Andrés Hurtado Cuero (Gomito58)" // #19
    ],
    D: [
        "the Andres (Real Madrid)",           // #4
        "Brn_14 (Arsenal)",                   // #8
        "Bangbrousnetwork (Ajax)",            // #12
        "carlosandreess (Junior FC)"          // #16
    ]
};

// FASE DE GRUPOS - Partidos con nombres directos
const partidosGrupos = [
    // GRUPO A - 5 Jornadas (6 equipos)
    // Jornada 1
    { codigo: "grupoA_jornada1_partido1", fase: "grupos", grupo: "A", jornada: 1, local: "JEFFRY10 (Benfica)", visitante: "Royyer10 (Inter)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada1_partido2", fase: "grupos", grupo: "A", jornada: 1, local: "Esteban David Meriño (Atlético Nacional)", visitante: "alexander (Santos)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada1_partido3", fase: "grupos", grupo: "A", jornada: 1, local: "Angel3.1416 (Club América)", visitante: "Ever Gutierrez (SC Corinthians)", golesLocal: null, golesVisitante: null, jugado: false },
    
    // Jornada 2
    { codigo: "grupoA_jornada2_partido1", fase: "grupos", grupo: "A", jornada: 2, local: "Royyer10 (Inter)", visitante: "Esteban David Meriño (Atlético Nacional)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada2_partido2", fase: "grupos", grupo: "A", jornada: 2, local: "Angel3.1416 (Club América)", visitante: "JEFFRY10 (Benfica)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada2_partido3", fase: "grupos", grupo: "A", jornada: 2, local: "Ever Gutierrez (SC Corinthians)", visitante: "alexander (Santos)", golesLocal: null, golesVisitante: null, jugado: false },
    
    // Jornada 3
    { codigo: "grupoA_jornada3_partido1", fase: "grupos", grupo: "A", jornada: 3, local: "Royyer10 (Inter)", visitante: "Angel3.1416 (Club América)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada3_partido2", fase: "grupos", grupo: "A", jornada: 3, local: "Ever Gutierrez (SC Corinthians)", visitante: "Esteban David Meriño (Atlético Nacional)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada3_partido3", fase: "grupos", grupo: "A", jornada: 3, local: "alexander (Santos)", visitante: "JEFFRY10 (Benfica)", golesLocal: null, golesVisitante: null, jugado: false },
    
    // Jornada 4
    { codigo: "grupoA_jornada4_partido1", fase: "grupos", grupo: "A", jornada: 4, local: "Ever Gutierrez (SC Corinthians)", visitante: "Royyer10 (Inter)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada4_partido2", fase: "grupos", grupo: "A", jornada: 4, local: "alexander (Santos)", visitante: "Angel3.1416 (Club América)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada4_partido3", fase: "grupos", grupo: "A", jornada: 4, local: "JEFFRY10 (Benfica)", visitante: "Esteban David Meriño (Atlético Nacional)", golesLocal: null, golesVisitante: null, jugado: false },
    
    // Jornada 5
    { codigo: "grupoA_jornada5_partido1", fase: "grupos", grupo: "A", jornada: 5, local: "alexander (Santos)", visitante: "Royyer10 (Inter)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada5_partido2", fase: "grupos", grupo: "A", jornada: 5, local: "JEFFRY10 (Benfica)", visitante: "Ever Gutierrez (SC Corinthians)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoA_jornada5_partido3", fase: "grupos", grupo: "A", jornada: 5, local: "Esteban David Meriño (Atlético Nacional)", visitante: "Angel3.1416 (Club América)", golesLocal: null, golesVisitante: null, jugado: false },

    // GRUPO B - 5 Jornadas (5 equipos)
    // Jornada 1
    { codigo: "grupoB_jornada1_partido1", fase: "grupos", grupo: "B", jornada: 1, local: "BRANZZINO-777 (Japón)", visitante: "399633 (Newcastle)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoB_jornada1_partido2", fase: "grupos", grupo: "B", jornada: 1, local: "DorianBU (FC Barcelona)", visitante: "Santislowly (Club América)", golesLocal: null, golesVisitante: null, jugado: false },
    // Benny Caballero descansa en jornada 1
    
    // Jornada 2
    { codigo: "grupoB_jornada2_partido1", fase: "grupos", grupo: "B", jornada: 2, local: "Benny Caballero (FC Barcelona)", visitante: "BRANZZINO-777 (Japón)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoB_jornada2_partido2", fase: "grupos", grupo: "B", jornada: 2, local: "Santislowly (Club América)", visitante: "399633 (Newcastle)", golesLocal: null, golesVisitante: null, jugado: false },
    // DorianBU descansa en jornada 2
    
    // Jornada 3
    { codigo: "grupoB_jornada3_partido1", fase: "grupos", grupo: "B", jornada: 3, local: "DorianBU (FC Barcelona)", visitante: "Benny Caballero (FC Barcelona)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoB_jornada3_partido2", fase: "grupos", grupo: "B", jornada: 3, local: "Santislowly (Club América)", visitante: "BRANZZINO-777 (Japón)", golesLocal: null, golesVisitante: null, jugado: false },
    // 399633 descansa en jornada 3
    
    // Jornada 4
    { codigo: "grupoB_jornada4_partido1", fase: "grupos", grupo: "B", jornada: 4, local: "Benny Caballero (FC Barcelona)", visitante: "Santislowly (Club América)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoB_jornada4_partido2", fase: "grupos", grupo: "B", jornada: 4, local: "399633 (Newcastle)", visitante: "DorianBU (FC Barcelona)", golesLocal: null, golesVisitante: null, jugado: false },
    // BRANZZINO-777 descansa en jornada 4
    
    // Jornada 5
    { codigo: "grupoB_jornada5_partido1", fase: "grupos", grupo: "B", jornada: 5, local: "399633 (Newcastle)", visitante: "Benny Caballero (FC Barcelona)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoB_jornada5_partido2", fase: "grupos", grupo: "B", jornada: 5, local: "BRANZZINO-777 (Japón)", visitante: "DorianBU (FC Barcelona)", golesLocal: null, golesVisitante: null, jugado: false },
    // Santislowly descansa en jornada 5

    // GRUPO C - 5 Jornadas (5 equipos)
    // Jornada 1
    { codigo: "grupoC_jornada1_partido1", fase: "grupos", grupo: "C", jornada: 1, local: "Carlos Andrés Hurtado Cuero (Gomito58)", visitante: "ElianVz17 (Venezuela)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoC_jornada1_partido2", fase: "grupos", grupo: "C", jornada: 1, local: "Alberto Sosa (Manchester United)", visitante: "Máx (Botafogo)", golesLocal: null, golesVisitante: null, jugado: false },
    // LW🐉 descansa en jornada 1
    
    // Jornada 2
    { codigo: "grupoC_jornada2_partido1", fase: "grupos", grupo: "C", jornada: 2, local: "LW🐉 (AC Milan)", visitante: "Carlos Andrés Hurtado Cuero (Gomito58)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoC_jornada2_partido2", fase: "grupos", grupo: "C", jornada: 2, local: "Máx (Botafogo)", visitante: "ElianVz17 (Venezuela)", golesLocal: null, golesVisitante: null, jugado: false },
    // Alberto Sosa descansa en jornada 2
    
    // Jornada 3
    { codigo: "grupoC_jornada3_partido1", fase: "grupos", grupo: "C", jornada: 3, local: "Alberto Sosa (Manchester United)", visitante: "LW🐉 (AC Milan)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoC_jornada3_partido2", fase: "grupos", grupo: "C", jornada: 3, local: "Máx (Botafogo)", visitante: "Carlos Andrés Hurtado Cuero (Gomito58)", golesLocal: null, golesVisitante: null, jugado: false },
    // ElianVz17 descansa en jornada 3
    
    // Jornada 4
    { codigo: "grupoC_jornada4_partido1", fase: "grupos", grupo: "C", jornada: 4, local: "LW🐉 (AC Milan)", visitante: "Máx (Botafogo)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoC_jornada4_partido2", fase: "grupos", grupo: "C", jornada: 4, local: "ElianVz17 (Venezuela)", visitante: "Alberto Sosa (Manchester United)", golesLocal: null, golesVisitante: null, jugado: false },
    // Carlos Andrés Hurtado Cuero descansa en jornada 4
    
    // Jornada 5
    { codigo: "grupoC_jornada5_partido1", fase: "grupos", grupo: "C", jornada: 5, local: "ElianVz17 (Venezuela)", visitante: "LW🐉 (AC Milan)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoC_jornada5_partido2", fase: "grupos", grupo: "C", jornada: 5, local: "Carlos Andrés Hurtado Cuero (Gomito58)", visitante: "Alberto Sosa (Manchester United)", golesLocal: null, golesVisitante: null, jugado: false },
    // Máx descansa en jornada 5

    // GRUPO D - 5 Jornadas (4 equipos solamente)
    // Jornada 1
    { codigo: "grupoD_jornada1_partido1", fase: "grupos", grupo: "D", jornada: 1, local: "the Andres (Real Madrid)", visitante: "Brn_14 (Arsenal)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoD_jornada1_partido2", fase: "grupos", grupo: "D", jornada: 1, local: "carlosandreess (Junior FC)", visitante: "Bangbrousnetwork (Ajax)", golesLocal: null, golesVisitante: null, jugado: false },
    
    // Jornada 2
    { codigo: "grupoD_jornada2_partido1", fase: "grupos", grupo: "D", jornada: 2, local: "the Andres (Real Madrid)", visitante: "carlosandreess (Junior FC)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoD_jornada2_partido2", fase: "grupos", grupo: "D", jornada: 2, local: "Bangbrousnetwork (Ajax)", visitante: "Brn_14 (Arsenal)", golesLocal: null, golesVisitante: null, jugado: false },
    
    // Jornada 3
    { codigo: "grupoD_jornada3_partido1", fase: "grupos", grupo: "D", jornada: 3, local: "carlosandreess (Junior FC)", visitante: "Brn_14 (Arsenal)", golesLocal: null, golesVisitante: null, jugado: false },
    { codigo: "grupoD_jornada3_partido2", fase: "grupos", grupo: "D", jornada: 3, local: "Bangbrousnetwork (Ajax)", visitante: "the Andres (Real Madrid)", golesLocal: null, golesVisitante: null, jugado: false }
];

// Función para exportar los datos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        jugadores,
        grupos,
        partidosGrupos
    };
}
