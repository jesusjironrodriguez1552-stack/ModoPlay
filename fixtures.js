import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Target } from 'lucide-react';
// import clubes from './clubes.js'; // Descomenta esta línea en tu proyecto

import clubes from './clubes.js'; // Descomenta esta línea en tu proyecto

const EFootballTournament = () => {
  const [activeTab, setActiveTab] = useState('grupos');
  const [grupos, setGrupos] = useState([]);
  const [partidosGrupos, setPartidosGrupos] = useState([]);
  const [eliminatorias, setEliminatorias] = useState({
    octavos: [],
    cuartos: [],
    semis: [],
    final: []
  });

  // Calcular estadísticas del torneo
  const stats = {
    totalJugadores: clubes.length,
    numGrupos: Math.ceil(clubes.length / 3),
    partidosPorGrupo: 3, // En grupos de 3: 3 partidos por grupo
    totalPartidosGrupos: Math.ceil(clubes.length / 3) * 3,
    clasificados: Math.ceil(clubes.length / 3) * 2 // Primeros y segundos de cada grupo
  };

  // Función para mezclar array (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Crear grupos dinámicamente
  const crearGrupos = () => {
    const jugadoresMezclados = shuffleArray([...clubes]);
    const numGrupos = Math.ceil(clubes.length / 3);
    const nuevosGrupos = [];

    for (let i = 0; i < numGrupos; i++) {
      const equiposGrupo = jugadoresMezclados.slice(i * 3, (i + 1) * 3);
      
      // Solo crear grupo si tiene al menos 2 equipos
      if (equiposGrupo.length >= 2) {
        nuevosGrupos.push({
          nombre: `Grupo ${String.fromCharCode(65 + i)}`,
          equipos: equiposGrupo,
          tabla: equiposGrupo.map(equipo => ({
            ...equipo,
            partidos: 0,
            ganados: 0,
            empatados: 0,
            perdidos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferencia: 0,
            puntos: 0
          }))
        });
      }
    }

    setGrupos(nuevosGrupos);
    generarPartidosGrupos(nuevosGrupos);
  };

  // Generar partidos de grupos
  const generarPartidosGrupos = (gruposData) => {
    const todosLosPartidos = [];

    gruposData.forEach((grupo, grupoIndex) => {
      const equipos = grupo.equipos;
      const partidosGrupo = [];

      // Generar partidos round-robin
      for (let i = 0; i < equipos.length; i++) {
        for (let j = i + 1; j < equipos.length; j++) {
          partidosGrupo.push({
            id: `${grupoIndex}-${i}-${j}`,
            grupo: grupo.nombre,
            grupoIndex,
            local: equipos[i],
            visitante: equipos[j],
            jornada: partidosGrupo.length + 1,
            estado: 'pendiente',
            resultado: { local: null, visitante: null }
          });
        }
      }

      todosLosPartidos.push(...partidosGrupo);
    });

    setPartidosGrupos(todosLosPartidos);
  };

  // Obtener clasificados de grupos
  const obtenerClasificados = () => {
    const clasificados = [];
    
    grupos.forEach((grupo) => {
      const tablaOrdenada = [...grupo.tabla].sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.diferencia !== a.diferencia) return b.diferencia - a.diferencia;
        return b.golesFavor - a.golesFavor;
      });
      
      // Agregar primero y segundo de cada grupo
      if (tablaOrdenada[0]) {
        clasificados.push({ 
          ...tablaOrdenada[0], 
          posicion: `1° ${grupo.nombre}`,
          grupoOrigen: grupo.nombre 
        });
      }
      if (tablaOrdenada[1]) {
        clasificados.push({ 
          ...tablaOrdenada[1], 
          posicion: `2° ${grupo.nombre}`,
          grupoOrigen: grupo.nombre 
        });
      }
    });

    return clasificados;
  };

  // Generar eliminatorias
  const generarEliminatorias = () => {
    const clasificados = obtenerClasificados();
    const numClasificados = clasificados.length;
    
    // Ajustar a potencia de 2 más cercana para el bracket
    const potenciasDeDos = [2, 4, 8, 16, 32];
    const numEliminatorias = potenciasDeDos.find(p => p >= numClasificados) || 16;
    
    const clasificadosParaEliminatorias = shuffleArray(clasificados.slice(0, numEliminatorias));

    const nuevasEliminatorias = {
      octavos: [],
      cuartos: [],
      semis: [],
      final: []
    };

    // Crear primera ronda según el número de clasificados
    let primeraRonda = 'octavos';
    let numPartidosPrimeraRonda = numEliminatorias / 2;

    if (numEliminatorias <= 4) {
      primeraRonda = 'semis';
      numPartidosPrimeraRonda = 2;
    } else if (numEliminatorias <= 8) {
      primeraRonda = 'cuartos';
      numPartidosPrimeraRonda = 4;
    }

    // Crear partidos de la primera ronda
    for (let i = 0; i < numPartidosPrimeraRonda; i++) {
      const local = clasificadosParaEliminatorias[i * 2];
      const visitante = clasificadosParaEliminatorias[i * 2 + 1];
      
      if (local && visitante) {
        nuevasEliminatorias[primeraRonda].push({
          id: `${primeraRonda}-${i}`,
          local,
          visitante,
          estado: 'pendiente',
          resultado: { local: null, visitante: null }
        });
      }
    }

    // Crear estructura para siguientes fases (TBD)
    const fases = ['cuartos', 'semis', 'final'];
    const numPartidos = [4, 2, 1];

    fases.forEach((fase, faseIndex) => {
      if (fase !== primeraRonda) {
        for (let i = 0; i < numPartidos[faseIndex]; i++) {
          nuevasEliminatorias[fase].push({
            id: `${fase}-${i}`,
            local: null,
            visitante: null,
            estado: 'pendiente',
            resultado: { local: null, visitante: null },
            dependeDe: faseIndex === 0 ? 
              (primeraRonda === 'octavos' ? [`octavos-${i*2}`, `octavos-${i*2+1}`] : [`${primeraRonda}-${i*2}`, `${primeraRonda}-${i*2+1}`]) :
              [`${fases[faseIndex-1]}-${i*2}`, `${fases[faseIndex-1]}-${i*2+1}`]
          });
        }
      }
    });

    setEliminatorias(nuevasEliminatorias);
  };

  // Inicializar al cargar el componente
  useEffect(() => {
    crearGrupos();
  }, []);

  const PartidosGrupo = ({ grupo }) => {
    const partidosDelGrupo = partidosGrupos.filter(p => p.grupo === grupo.nombre);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-blue-500">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
          <Users className="mr-2" size={20} />
          {grupo.nombre} ({grupo.equipos.length} equipos)
        </h3>
        
        {/* Tabla del grupo */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-gray-700">Clasificación</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border">Pos</th>
                  <th className="text-left p-2 border">Equipo</th>
                  <th className="text-center p-2 border">PJ</th>
                  <th className="text-center p-2 border">G</th>
                  <th className="text-center p-2 border">E</th>
                  <th className="text-center p-2 border">P</th>
                  <th className="text-center p-2 border">GF</th>
                  <th className="text-center p-2 border">GC</th>
                  <th className="text-center p-2 border">DG</th>
                  <th className="text-center p-2 border">Pts</th>
                </tr>
              </thead>
              <tbody>
                {grupo.tabla
                  .sort((a, b) => {
                    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
                    if (b.diferencia !== a.diferencia) return b.diferencia - a.diferencia;
                    return b.golesFavor - a.golesFavor;
                  })
                  .map((equipo, index) => (
                    <tr key={equipo.name} className={`${index < 2 ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'}`}>
                      <td className="p-2 border text-center font-bold">
                        {index + 1}
                        {index < 2 && <span className="text-green-600 ml-1">✓</span>}
                      </td>
                      <td className="p-2 border">
                        <div>
                          <div className="font-medium">{equipo.club}</div>
                          <div className="text-xs text-gray-500">{equipo.name}</div>
                          {equipo.id && <div className="text-xs text-gray-400">ID: {equipo.id}</div>}
                        </div>
                      </td>
                      <td className="text-center p-2 border">{equipo.partidos}</td>
                      <td className="text-center p-2 border text-green-600">{equipo.ganados}</td>
                      <td className="text-center p-2 border text-yellow-600">{equipo.empatados}</td>
                      <td className="text-center p-2 border text-red-600">{equipo.perdidos}</td>
                      <td className="text-center p-2 border">{equipo.golesFavor}</td>
                      <td className="text-center p-2 border">{equipo.golesContra}</td>
                      <td className="text-center p-2 border font-medium">{equipo.diferencia > 0 ? '+' : ''}{equipo.diferencia}</td>
                      <td className="text-center p-2 border font-bold text-blue-600">{equipo.puntos}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-green-600">
            ✓ Clasifican a eliminatorias (1° y 2° puesto)
          </div>
        </div>

        {/* Partidos del grupo */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Fixture</h4>
          {partidosDelGrupo.map((partido, index) => (
            <div key={partido.id} className="flex items-center justify-between bg-gray-50 p-3 mb-2 rounded border">
              <div className="flex-1">
                <span className="font-medium">{partido.local.club}</span>
                <div className="text-xs text-gray-500">{partido.local.name}</div>
              </div>
              <div className="px-4 text-center">
                <div className="text-sm text-gray-600">J{partido.jornada}</div>
                <div className="font-bold">VS</div>
              </div>
              <div className="flex-1 text-right">
                <span className="font-medium">{partido.visitante.club}</span>
                <div className="text-xs text-gray-500">{partido.visitante.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const EliminatoriasView = () => {
    const clasificados = obtenerClasificados();
    
    return (
      <div className="space-y-6">
        {/* Resumen de clasificados */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold text-green-600 mb-3 flex items-center">
            <Trophy className="mr-2" size={20} />
            Equipos Clasificados ({clasificados.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {clasificados.map((equipo, index) => (
              <div key={equipo.name} className="bg-green-50 p-3 rounded border border-green-200">
                <div className="font-medium">{equipo.club}</div>
                <div className="text-sm text-gray-600">{equipo.name}</div>
                <div className="text-xs text-green-600">{equipo.posicion}</div>
                <div className="text-xs text-gray-500">{equipo.puntos} pts • DG: {equipo.diferencia}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bracket eliminatorio */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center">
            <Target className="mr-2" size={20} />
            Bracket Eliminatorio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Octavos de Final */}
            {eliminatorias.octavos.length > 0 && (
              <div>
                <h4 className="font-bold mb-3 text-center bg-red-100 p-2 rounded">
                  Octavos de Final ({eliminatorias.octavos.length} partidos)
                </h4>
                {eliminatorias.octavos.map((partido, index) => (
                  <div key={partido.id} className="bg-gray-50 p-3 mb-2 rounded text-sm border">
                    <div className="font-medium">{partido.local?.club || 'TBD'}</div>
                    <div className="text-xs text-gray-500">{partido.local?.name || ''}</div>
                    <div className="text-center text-xs my-1 font-bold">VS</div>
                    <div className="font-medium">{partido.visitante?.club || 'TBD'}</div>
                    <div className="text-xs text-gray-500">{partido.visitante?.name || ''}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Cuartos de Final */}
            {eliminatorias.cuartos.length > 0 && (
              <div>
                <h4 className="font-bold mb-3 text-center bg-orange-100 p-2 rounded">
                  Cuartos de Final ({eliminatorias.cuartos.length} partidos)
                </h4>
                {eliminatorias.cuartos.map((partido, index) => (
                  <div key={partido.id} className="bg-gray-50 p-3 mb-2 rounded text-sm border">
                    <div className="font-medium">{partido.local?.club || `Ganador Oct. ${index * 2 + 1}`}</div>
                    <div className="text-center text-xs my-1 font-bold">VS</div>
                    <div className="font-medium">{partido.visitante?.club || `Ganador Oct. ${index * 2 + 2}`}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Semifinales */}
            <div>
              <h4 className="font-bold mb-3 text-center bg-yellow-100 p-2 rounded">
                Semifinales ({eliminatorias.semis.length} partidos)
              </h4>
              {eliminatorias.semis.map((partido, index) => (
                <div key={partido.id} className="bg-gray-50 p-3 mb-2 rounded text-sm border">
                  <div className="font-medium">{partido.local?.club || `Ganador Cuarto ${index * 2 + 1}`}</div>
                  <div className="text-center text-xs my-1 font-bold">VS</div>
                  <div className="font-medium">{partido.visitante?.club || `Ganador Cuarto ${index * 2 + 2}`}</div>
                </div>
              ))}
            </div>

            {/* Final */}
            <div>
              <h4 className="font-bold mb-3 text-center bg-green-100 p-2 rounded">
                🏆 FINAL
              </h4>
              {eliminatorias.final.map((partido, index) => (
                <div key={partido.id} className="bg-gradient-to-r from-yellow-50 to-green-50 p-4 mb-2 rounded-lg text-sm border-2 border-yellow-300">
                  <div className="font-bold text-center text-yellow-700">FINAL</div>
                  <div className="font-medium mt-2">{partido.local?.club || 'Ganador Semi 1'}</div>
                  <div className="text-center text-sm my-2 font-bold">VS</div>
                  <div className="font-medium">{partido.visitante?.club || 'Ganador Semi 2'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-700 mb-2">Información del Torneo:</h4>
            <div className="text-sm text-blue-600 space-y-1">
              <p><strong>• Total de jugadores:</strong> {stats.totalJugadores}</p>
              <p><strong>• Fase de grupos:</strong> {stats.numGrupos} grupos</p>
              <p><strong>• Clasificados:</strong> {clasificados.length} equipos a eliminatorias</p>
              <p><strong>• Sistema:</strong> Primeros y segundos de cada grupo</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Trophy className="mr-3 text-yellow-500" size={40} />
            Liga eFootball 2025
          </h1>
          <p className="text-gray-600 mb-4">
            {stats.totalJugadores} jugadores • {stats.numGrupos} grupos • Sistema eliminatorio
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>📊 Partidos de grupos: {stats.totalPartidosGrupos}</span>
            <span>🏆 Clasifican: {stats.clasificados}</span>
          </div>
        </div>

        {/* Navegación */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md p-1 flex">
            <button
              onClick={() => setActiveTab('grupos')}
              className={`px-6 py-2 rounded-md transition-all flex items-center ${
                activeTab === 'grupos'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users size={20} className="mr-2" />
              Fase de Grupos
            </button>
            <button
              onClick={() => {
                setActiveTab('eliminatorias');
                generarEliminatorias();
              }}
              className={`px-6 py-2 rounded-md transition-all flex items-center ${
                activeTab === 'eliminatorias'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Target size={20} className="mr-2" />
              Eliminatorias
            </button>
          </div>
        </div>

        {/* Contenido */}
        {activeTab === 'grupos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {grupos.map((grupo, index) => (
              <PartidosGrupo key={index} grupo={grupo} />
            ))}
          </div>
        )}

        {activeTab === 'eliminatorias' && <EliminatoriasView />}



        {/* Footer con instrucciones */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-4">
          <h4 className="font-bold text-gray-700 mb-2">📋 Instrucciones de uso:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>1.</strong> Importa este componente en tu proyecto React</p>
            <p><strong>2.</strong> Descomenta la línea: <code className="bg-gray-100 px-1 rounded">import clubes from './clubes.js'</code></p>
            <p><strong>3.</strong> Elimina la constante local <code className="bg-gray-100 px-1 rounded">clubes</code> (línea 5-25)</p>
            <p><strong>4.</strong> ¡Listo! El sistema se adapta automáticamente a tu número de jugadores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EFootballTournament;
