/* =========================
   RUTINAS POR DEFECTO
========================= */

const rutinasPorDefecto = {
    1: {
        nombre: "Pecho + Hombro",
        ejercicios: [
            { nombre: "Press inclinado Smith", series: 2 },
            { nombre: "Press plano Smith", series: 2 },
            { nombre: "Cruze de poleas para pecho inferior", series: 2 },
            { nombre: "Press militar", series: 2 },
            { nombre: "Elevaciones laterales", series: 2 },
            { nombre: "Face pull", series: 2 }
        ]
    },

    2: {
        nombre: "Espalda + Bíceps",
        ejercicios: [
            { nombre: "Jalón al pecho", series: 3 },
            { nombre: "Remo sentado abierto", series: 3 },
            { nombre: "Remo con mancuerna", series: 2 },
            { nombre: "Pull over", series: 2 },
            { nombre: "Curl bíceps", series: 2 },
            { nombre: "Curl martillo", series: 2 },
            { nombre: "Antebrazo 1", series: 2, opcional: true },
            { nombre: "Antebrazo 2", series: 2, opcional: true }
        ]
    },

    3: {
        nombre: "Pierna",
        ejercicios: [
            { nombre: "Prensa", series: 2 },
            { nombre: "Extensión cuádriceps", series: 3 },
            { nombre: "Curl femoral", series: 3 },
            { nombre: "Peso muerto rumano", series: 2 },
            { nombre: "Abductores", series: 2 },
            { nombre: "Gemelos", series: 2 },
            { nombre: "Antebrazo 1", series: 2, opcional: true },
            { nombre: "Antebrazo 2", series: 2, opcional: true }
        ]
    },

    4: {
        nombre: "Descanso",
        ejercicios: []
    },

    5: {
        nombre: "Pecho + Tríceps",
        ejercicios: [
            { nombre: "Press inclinado Smith", series: 2 },
            { nombre: "Press plano Smith", series: 2 },
            { nombre: "Cruze de poleas para pecho inferior", series: 2 },
            { nombre: "Katana", series: 2 },
            { nombre: "Extensión tríceps", series: 2 },
            { nombre: "Ejercicio para medial", series: 2, opcional: true },
            { nombre: "Curl vallesian", series: 2, opcional: true }
        ]
    },

    6: {
        nombre: "Descanso",
        ejercicios: []
    },

    7: {
        nombre: "Descanso",
        ejercicios: []
    }
};


/* =========================
   CARGAR RUTINAS
========================= */

function cargarRutinas() {

    const guardadas =
        localStorage.getItem("gymTrackerRutinas");

    if (guardadas) {

        return JSON.parse(guardadas);

    }

    return JSON.parse(
        JSON.stringify(rutinasPorDefecto)
    );
}


let rutinas = cargarRutinas();


/* =========================
   MOSTRAR DÍA
========================= */

function mostrarDia(dia) {

    const contenido =
        document.getElementById("contenido");

    const rutina = rutinas[dia];

    if (rutina.ejercicios.length === 0) {

        contenido.innerHTML = `
            <h2>
                Día ${dia} — ${rutina.nombre}
            </h2>

            <p class="descanso">
                Hoy toca descansar.
            </p>
        `;

        return;
    }

    let html = `
        <h2>
            Día ${dia} — ${rutina.nombre}
        </h2>

        <div class="ejercicios">
    `;


    rutina.ejercicios.forEach(
        (ejercicio, indice) => {

            const ultimoEntrenamiento =
                obtenerUltimoEntrenamientoEjercicio(
                    dia,
                    ejercicio.nombre
                );


            html += `
                <div class="ejercicio">

                    <h3>
                        ${ejercicio.nombre}
                        ${
                            ejercicio.opcional
                                ? " (Opcional)"
                                : ""
                        }
                    </h3>
            `;


            /* =========================
               ÚLTIMO ENTRENAMIENTO
            ========================= */

            if (ultimoEntrenamiento) {

                const fecha =
                    new Date(
                        ultimoEntrenamiento.fecha
                    );

                html += `
                    <div class="ultimo-entrenamiento">

                        <div class="ultimo-entrenamiento-titulo">

                            Último entrenamiento:
                            ${fecha.toLocaleDateString(
                                "es-ES"
                            )}

                        </div>
                `;


                ultimoEntrenamiento.series.forEach(
                    (serie, indiceSerie) => {

                        html += `
                            <div class="ultimo-serie">

                                <span>
                                    Serie ${indiceSerie + 1}
                                </span>

                                <span>
                                    ${
                                        serie.peso || "-"
                                    } kg
                                </span>

                                <span>
                                    ${
                                        serie.repeticiones ||
                                        "-"
                                    } repeticiones
                                </span>

                            </div>
                        `;
                    }
                );


                html += `
                    </div>
                `;
            }


            html += `
                <div
                    class="series"
                    id="series-${indice}">
            `;


            for (
                let i = 1;
                i <= ejercicio.series;
                i++
            ) {

                let pesoAnterior = "";
                let repeticionesAnteriores = "";

                if (
                    ultimoEntrenamiento &&
                    ultimoEntrenamiento.series[i - 1]
                ) {

                    pesoAnterior =
                        ultimoEntrenamiento
                            .series[i - 1]
                            .peso || "";

                    repeticionesAnteriores =
                        ultimoEntrenamiento
                            .series[i - 1]
                            .repeticiones || "";
                }


                html += crearSerieHTML(
                    i,
                    pesoAnterior,
                    repeticionesAnteriores
                );
            }


            html += `
                </div>

                <button
                    type="button"
                    class="anadir-serie"
                    onclick="anadirSerie(${indice})">

                    + Añadir serie

                </button>

                </div>
            `;
        }
    );


    html += `
        </div>

        <button
            type="button"
            class="guardar"
            onclick="guardarEntrenamiento(${dia})">

            Guardar entrenamiento

        </button>
    `;


    contenido.innerHTML = html;
}


/* =========================
   CREAR SERIE
========================= */

function crearSerieHTML(
    numero,
    pesoAnterior = "",
    repeticionesAnteriores = ""
) {

    return `
        <div class="serie">

            <span>
                Serie ${numero}
            </span>

            <input
                type="number"
                step="0.5"
                placeholder="Peso (kg)"
                class="peso"
                value="${pesoAnterior}"
            >

            <input
                type="number"
                placeholder="Repeticiones"
                class="repeticiones"
                value="${repeticionesAnteriores}"
            >

        </div>
    `;
}


/* =========================
   AÑADIR SERIE
========================= */

function anadirSerie(indiceEjercicio) {

    const contenedor =
        document.getElementById(
            `series-${indiceEjercicio}`
        );

    const numeroNuevaSerie =
        contenedor.querySelectorAll(".serie")
            .length + 1;


    contenedor.insertAdjacentHTML(
        "beforeend",
        crearSerieHTML(
            numeroNuevaSerie
        )
    );
}


/* =========================
   OBTENER ÚLTIMO ENTRENAMIENTO
========================= */

function obtenerUltimoEntrenamientoEjercicio(
    dia,
    nombreEjercicio
) {

    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];


    const entrenamientos =
        historial.filter(
            (entrenamiento) => {

                if (
                    entrenamiento.dia !== dia
                ) {
                    return false;
                }


                return entrenamiento.ejercicios.some(
                    (ejercicio) =>
                        ejercicio.nombre ===
                        nombreEjercicio
                );
            }
        );


    if (entrenamientos.length === 0) {
        return null;
    }


    entrenamientos.sort(
        (a, b) =>
            new Date(b.fecha) -
            new Date(a.fecha)
    );


    const entrenamiento =
        entrenamientos[0];


    const ejercicio =
        entrenamiento.ejercicios.find(
            (e) =>
                e.nombre ===
                nombreEjercicio
        );


    if (!ejercicio) {
        return null;
    }


    return {
        fecha: entrenamiento.fecha,
        series: ejercicio.series
    };
}


/* =========================
   GUARDAR ENTRENAMIENTO
========================= */

function guardarEntrenamiento(dia) {

    const contenido =
        document.getElementById(
            "contenido"
        );


    const ejercicios =
        contenido.querySelectorAll(
            ".ejercicio"
        );


    const entrenamiento = {

        fecha:
            new Date().toISOString(),

        dia: dia,

        ejercicios: []
    };


    ejercicios.forEach(
        (ejercicioElemento) => {

            const nombre =
                ejercicioElemento
                    .querySelector("h3")
                    .textContent
                    .replace(
                        "(Opcional)",
                        ""
                    )
                    .trim();


            const pesos =
                ejercicioElemento
                    .querySelectorAll(
                        ".peso"
                    );


            const repeticiones =
                ejercicioElemento
                    .querySelectorAll(
                        ".repeticiones"
                    );


            const series = [];


            for (
                let i = 0;
                i < pesos.length;
                i++
            ) {

                series.push({

                    peso:
                        pesos[i].value,

                    repeticiones:
                        repeticiones[i].value

                });
            }


            entrenamiento.ejercicios.push({

                nombre:
                    nombre,

                series:
                    series

            });
        }
    );


    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];


    historial.push(
        entrenamiento
    );


    localStorage.setItem(
        "gymTrackerHistorial",
        JSON.stringify(
            historial
        )
    );


    alert(
        "Entrenamiento guardado correctamente."
    );
}


/* =========================
   HISTORIAL
========================= */

function mostrarHistorial() {

    const contenido =
        document.getElementById(
            "contenido"
        );


    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];


    if (
        historial.length === 0
    ) {

        contenido.innerHTML = `
            <h2>Historial</h2>

            <p>
                No hay entrenamientos
                guardados todavía.
            </p>
        `;

        return;
    }


    const diasGuardados = [];


    historial.forEach(
        (entrenamiento) => {

            if (
                !diasGuardados.includes(
                    entrenamiento.dia
                )
            ) {

                diasGuardados.push(
                    entrenamiento.dia
                );
            }
        }
    );


    diasGuardados.sort(
        (a, b) => a - b
    );


    let html = `
        <h2>Historial</h2>

        <p>
            Selecciona el día que
            quieres consultar:
        </p>

        <div style="margin-top: 20px;">
    `;


    diasGuardados.forEach(
        (dia) => {

            html += `
                <button
                    class="historial-dia"
                    onclick="mostrarHistorialDia(${dia})">

                    Día ${dia} —
                    ${rutinas[dia].nombre}

                </button>
            `;
        }
    );


    html += `
        </div>

        <button
            class="boton-comparar"
            onclick="mostrarComparar()">

            Comparar progreso

        </button>
    `;


    contenido.innerHTML =
        html;
}


/* =========================
   HISTORIAL DE UN DÍA
========================= */

function mostrarHistorialDia(dia) {

    const contenido =
        document.getElementById(
            "contenido"
        );


    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];


    const entrenamientosDia =
        historial.filter(
            (entrenamiento) =>
                entrenamiento.dia === dia
        );


    entrenamientosDia.sort(
        (a, b) =>
            new Date(b.fecha) -
            new Date(a.fecha)
    );


    let html = `
        <button
            class="volver"
            onclick="mostrarHistorial()">

            ← Volver al historial

        </button>

        <h2>
            Día ${dia} —
            ${rutinas[dia].nombre}
        </h2>
    `;


    entrenamientosDia.forEach(
        (entrenamiento) => {

            const fecha =
                new Date(
                    entrenamiento.fecha
                );


            html += `
                <div class="ejercicio">

                    <h3>
                        ${fecha.toLocaleDateString(
                            "es-ES"
                        )}

                        ${fecha.toLocaleTimeString(
                            "es-ES",
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )}
                    </h3>
            `;


            entrenamiento.ejercicios.forEach(
                (ejercicio) => {

                    html += `
                        <div style="margin-top: 20px;">

                            <strong>
                                ${ejercicio.nombre}
                            </strong>
                    `;


                    ejercicio.series.forEach(
                        (serie, indice) => {

                            html += `
                                <p
                                    style="margin-top: 8px;">

                                    Serie
                                    ${indice + 1}:

                                    ${
                                        serie.peso ||
                                        "-"
                                    } kg ×

                                    ${
                                        serie.repeticiones ||
                                        "-"
                                    } repeticiones

                                </p>
                            `;
                        }
                    );


                    html += `
                        </div>
                    `;
                }
            );


            html += `
                </div>
            `;
        }
    );


    contenido.innerHTML =
        html;
}


/* =========================
   COMPARAR
========================= */

function mostrarComparar() {

    const contenido =
        document.getElementById(
            "contenido"
        );


    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];


    if (
        historial.length === 0
    ) {

        contenido.innerHTML = `
            <h2>
                Comparar progreso
            </h2>

            <p>
                Necesitas guardar al menos
                un entrenamiento.
            </p>
        `;

        return;
    }


    const diasGuardados = [];


    historial.forEach(
        (entrenamiento) => {

            if (
                !diasGuardados.includes(
                    entrenamiento.dia
                )
            ) {

                diasGuardados.push(
                    entrenamiento.dia
                );
            }
        }
    );


    diasGuardados.sort(
        (a, b) => a - b
    );


    let html = `
        <button
            class="volver"
            onclick="mostrarHistorial()">

            ← Volver al historial

        </button>

        <h2>
            Comparar progreso
        </h2>

        <p>
            Selecciona el día:
        </p>

        <select
            id="selector-dia"
            class="selector-comparar"
            onchange="actualizarEjerciciosComparar()">
    `;


    diasGuardados.forEach(
        (dia) => {

            html += `
                <option value="${dia}">
                    Día ${dia} —
                    ${rutinas[dia].nombre}
                </option>
            `;
        }
    );


    html += `
        </select>

        <p>
            Selecciona el ejercicio:
        </p>

        <select
            id="selector-ejercicio"
            class="selector-comparar"
            onchange="mostrarResultadoComparacion()">
        </select>

        <div
            id="resultado-comparacion">
        </div>
    `;


    contenido.innerHTML =
        html;


    actualizarEjerciciosComparar();
}


/* =========================
   ACTUALIZAR EJERCICIOS
========================= */

function actualizarEjerciciosComparar() {

    const selectorDia =
        document.getElementById(
            "selector-dia"
        );


    const selectorEjercicio =
        document.getElementById(
            "selector-ejercicio"
        );


    if (
        !selectorDia ||
        !selectorEjercicio
    ) {
        return;
    }


    const dia =
        parseInt(
            selectorDia.value
        );


    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];


    const entrenamientosDia =
        historial.filter(
            (entrenamiento) =>
                entrenamiento.dia === dia
        );


    const nombresEjercicios = [];


    entrenamientosDia.forEach(
        (entrenamiento) => {

            entrenamiento.ejercicios.forEach(
                (ejercicio) => {

                    if (
                        !nombresEjercicios.includes(
                            ejercicio.nombre
                        )
                    ) {

                        nombresEjercicios.push(
                            ejercicio.nombre
                        );
                    }
                }
            );
        }
    );


    selectorEjercicio.innerHTML =
        "";


    nombresEjercicios.forEach(
        (nombre) => {

            const opcion =
                document.createElement(
                    "option"
                );


            opcion.value =
                nombre;


            opcion.textContent =
                nombre;


            selectorEjercicio.appendChild(
                opcion
            );
        }
    );


    mostrarResultadoComparacion();
}


/* =========================
   RESULTADO COMPARACIÓN
========================= */

function mostrarResultadoComparacion() {

    const selectorDia =
        document.getElementById(
            "selector-dia"
        );


    const selectorEjercicio =
        document.getElementById(
            "selector-ejercicio"
        );


    const resultado =
        document.getElementById(
            "resultado-comparacion"
        );


    if (
        !selectorDia ||
        !selectorEjercicio ||
        !resultado
    ) {
        return;
    }


    const dia =
        parseInt(
            selectorDia.value
        );


    const nombreEjercicio =
        selectorEjercicio.value;


    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];


    let entrenamientos =
        historial.filter(
            (entrenamiento) =>
                entrenamiento.dia === dia
        );


    entrenamientos.sort(
        (a, b) =>
            new Date(a.fecha) -
            new Date(b.fecha)
    );


    let html = "";


    let seriesAnteriores = [];


    let mejorPeso = 0;
    let mejorVolumen = 0;


    entrenamientos.forEach(
        (entrenamiento) => {

            const ejercicio =
                entrenamiento.ejercicios.find(
                    (e) =>
                        e.nombre ===
                        nombreEjercicio
                );


            if (!ejercicio) {
                return;
            }


            const fecha =
                new Date(
                    entrenamiento.fecha
                );


            let volumenEntrenamiento =
                0;


            html += `
                <div class="comparacion">

                    <h3>
                        ${fecha.toLocaleDateString(
                            "es-ES"
                        )}

                        ${fecha.toLocaleTimeString(
                            "es-ES",
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )}
                    </h3>
            `;


            ejercicio.series.forEach(
                (serie, indice) => {

                    const pesoActual =
                        parseFloat(
                            serie.peso
                        );


                    const repeticionesActuales =
                        parseFloat(
                            serie.repeticiones
                        );


                    let clasePeso =
                        "mismo";


                    let claseRepeticiones =
                        "mismo";


                    const serieAnterior =
                        seriesAnteriores[
                            indice
                        ];


                    if (
                        serieAnterior
                    ) {

                        const pesoAnterior =
                            parseFloat(
                                serieAnterior.peso
                            );


                        const repeticionesAnterior =
                            parseFloat(
                                serieAnterior
                                    .repeticiones
                            );


                        if (
                            !isNaN(
                                pesoActual
                            ) &&
                            !isNaN(
                                pesoAnterior
                            )
                        ) {

                            if (
                                pesoActual >
                                pesoAnterior
                            ) {

                                clasePeso =
                                    "subida";

                            }
                            else if (
                                pesoActual <
                                pesoAnterior
                            ) {

                                clasePeso =
                                    "bajada";
                            }
                        }


                        if (
                            !isNaN(
                                repeticionesActuales
                            ) &&
                            !isNaN(
                                repeticionesAnterior
                            )
                        ) {

                            if (
                                repeticionesActuales >
                                repeticionesAnterior
                            ) {

                                claseRepeticiones =
                                    "subida";

                            }
                            else if (
                                repeticionesActuales <
                                repeticionesAnterior
                            ) {

                                claseRepeticiones =
                                    "bajada";
                            }
                        }
                    }


                    let volumenSerie =
                        0;


                    if (
                        !isNaN(
                            pesoActual
                        ) &&
                        !isNaN(
                            repeticionesActuales
                        )
                    ) {

                        volumenSerie =
                            pesoActual *
                            repeticionesActuales;


                        volumenEntrenamiento +=
                            volumenSerie;
                    }


                    html += `
                        <div
                            class="comparacion-serie">

                            <strong>
                                Serie
                                ${indice + 1}
                            </strong>

                            <span
                                class="${clasePeso}">

                                ${
                                    serie.peso ||
                                    "-"
                                } kg

                            </span>

                            ×

                            <span
                                class="${claseRepeticiones}">

                                ${
                                    serie.repeticiones ||
                                    "-"
                                }

                                repeticiones

                            </span>

                            ${
                                volumenSerie > 0
                                    ? `
                                        <span
                                            class="volumen">

                                            →
                                            ${volumenSerie}
                                            kg

                                        </span>
                                      `
                                    : ""
                            }

                        </div>
                    `;
                }
            );


            if (
                volumenEntrenamiento >
                mejorVolumen
            ) {

                mejorVolumen =
                    volumenEntrenamiento;
            }


            const pesosValidos =
                ejercicio.series
                    .map(
                        (serie) =>
                            parseFloat(
                                serie.peso
                            )
                    )
                    .filter(
                        (peso) =>
                            !isNaN(peso)
                    );


            if (
                pesosValidos.length > 0
            ) {

                const pesoMaximo =
                    Math.max(
                        ...pesosValidos
                    );


                if (
                    pesoMaximo >
                    mejorPeso
                ) {

                    mejorPeso =
                        pesoMaximo;
                }
            }


            /*
             * Guardamos las series actuales
             * para compararlas con las
             * mismas series del próximo
             * entrenamiento.
             */
            seriesAnteriores =
                ejercicio.series.map(
                    (serie) => ({
                        peso:
                            serie.peso,

                        repeticiones:
                            serie.repeticiones
                    })
                );


            html += `
                    <div
                        class="volumen-entrenamiento">

                        Volumen total:

                        <strong>
                            ${volumenEntrenamiento}
                            kg
                        </strong>

                    </div>

                </div>
            `;
        }
    );


    if (
        html === ""
    ) {

        html = `
            <p>
                No hay datos para comparar
                este ejercicio.
            </p>
        `;

    }
    else {

        html += `
            <div
                class="mejores-marcas">

                <h3>
                    Mejores marcas
                </h3>

                <p>
                    Mejor peso:

                    <strong>
                        ${mejorPeso}
                        kg
                    </strong>
                </p>

                <p>
                    Mejor volumen:

                    <strong>
                        ${mejorVolumen}
                        kg
                    </strong>
                </p>

            </div>
        `;
    }


    resultado.innerHTML =
        html;
}


/* =========================
   EDITOR DE RUTINAS
========================= */

function mostrarEditorRutinas() {

    const contenido =
        document.getElementById(
            "contenido"
        );


    let html = `
        <h2>
            Editar rutinas
        </h2>

        <p>
            Selecciona el día que
            quieres modificar:
        </p>

        <select
            id="editor-dia"
            class="editor-dia"
            onchange="cargarEditorDia()">

            <option value="1">
                Día 1 — ${rutinas[1].nombre}
            </option>

            <option value="2">
                Día 2 — ${rutinas[2].nombre}
            </option>

            <option value="3">
                Día 3 — ${rutinas[3].nombre}
            </option>

            <option value="4">
                Día 4 — ${rutinas[4].nombre}
            </option>

            <option value="5">
                Día 5 — ${rutinas[5].nombre}
            </option>

            <option value="6">
                Día 6 — ${rutinas[6].nombre}
            </option>

            <option value="7">
                Día 7 — ${rutinas[7].nombre}
            </option>

        </select>

        <div id="editor-contenido"></div>
    `;


    contenido.innerHTML =
        html;


    cargarEditorDia();
}


/* =========================
   CARGAR DÍA EN EDITOR
========================= */

function cargarEditorDia() {

    const selector =
        document.getElementById(
            "editor-dia"
        );


    const editor =
        document.getElementById(
            "editor-contenido"
        );


    if (
        !selector ||
        !editor
    ) {
        return;
    }


    const dia =
        parseInt(
            selector.value
        );


    const rutina =
        rutinas[dia];


    let html = `
        <div
            class="editor-ejercicio">

            <label>
                Nombre de la rutina
            </label>

            <input
                id="editor-nombre-rutina"
                type="text"
                value="${rutina.nombre}"
                style="
                    width:100%;
                    margin-top:8px;
                    padding:10px;
                    background:#111;
                    color:white;
                    border:1px solid #555;
                    border-radius:6px;
                "
            >

        </div>
    `;


    rutina.ejercicios.forEach(
        (ejercicio, indice) => {

            html += crearEditorEjercicioHTML(
                ejercicio,
                indice
            );
        }
    );


    html += `
        <button
            class="boton-anadir-ejercicio"
            onclick="anadirEjercicioEditor()">

            + Añadir ejercicio

        </button>

        <button
            class="boton-guardar-rutina"
            onclick="guardarRutinaEditada()">

            Guardar cambios

        </button>
    `;


    editor.innerHTML =
        html;
}


/* =========================
   CREAR EJERCICIO EDITOR
========================= */

function crearEditorEjercicioHTML(
    ejercicio,
    indice
) {

    return `
        <div
            class="editor-ejercicio"
            data-indice="${indice}">

            <div class="editor-fila">

                <input
                    type="text"
                    class="editor-nombre-ejercicio"
                    value="${ejercicio.nombre}"
                    placeholder="Nombre del ejercicio"
                >

                <input
                    type="number"
                    min="1"
                    class="editor-series-ejercicio"
                    value="${ejercicio.series}"
                    placeholder="Series"
                >

                <button
                    type="button"
                    class="boton-eliminar"
                    onclick="eliminarEjercicioEditor(this)">

                    Eliminar

                </button>

            </div>


            <label class="editor-opcional">

                <input
                    type="checkbox"
                    class="editor-opcional-ejercicio"
                    ${
                        ejercicio.opcional
                            ? "checked"
                            : ""
                    }
                >

                Ejercicio opcional

            </label>

        </div>
    `;
}


/* =========================
   AÑADIR EJERCICIO
========================= */

function anadirEjercicioEditor() {

    const editor =
        document.getElementById(
            "editor-contenido"
        );


    const ejercicios =
        editor.querySelectorAll(
            ".editor-ejercicio"
        );


    /*
     * El primer editor-ejercicio
     * corresponde al nombre de la
     * rutina, por lo que contamos
     * solamente los que contienen
     * nombre de ejercicio.
     */
    const indice =
        ejercicios.length;


    const nuevoEjercicio = {

        nombre:
            "Nuevo ejercicio",

        series:
            2,

        opcional:
            false
    };


    editor.insertAdjacentHTML(
        "beforeend",
        crearEditorEjercicioHTML(
            nuevoEjercicio,
            indice
        )
    );


    /*
     * El botón de guardar queda
     * al final, así que lo movemos
     * después del nuevo ejercicio.
     */
    const botonAnadir =
        editor.querySelector(
            ".boton-anadir-ejercicio"
        );


    const botonGuardar =
        editor.querySelector(
            ".boton-guardar-rutina"
        );


    editor.insertBefore(
        botonAnadir,
        botonGuardar
    );
}


/* =========================
   ELIMINAR EJERCICIO
========================= */

function eliminarEjercicioEditor(
    boton
) {

    const ejercicio =
        boton.closest(
            ".editor-ejercicio"
        );


    if (!ejercicio) {
        return;
    }


    ejercicio.remove();
}


/* =========================
   GUARDAR RUTINA EDITADA
========================= */

function guardarRutinaEditada() {

    const selector =
        document.getElementById(
            "editor-dia"
        );


    const editor =
        document.getElementById(
            "editor-contenido"
        );


    if (
        !selector ||
        !editor
    ) {
        return;
    }


    const dia =
        parseInt(
            selector.value
        );


    const nombreRutina =
        document.getElementById(
            "editor-nombre-rutina"
        ).value.trim();


    if (
        nombreRutina === ""
    ) {

        alert(
            "El nombre de la rutina no puede estar vacío."
        );

        return;
    }


    const elementosEjercicio =
        editor.querySelectorAll(
            ".editor-ejercicio[data-indice]"
        );


    const ejercicios = [];


    for (
        let i = 0;
        i < elementosEjercicio.length;
        i++
    ) {

        const elemento =
            elementosEjercicio[i];


        const nombre =
            elemento
                .querySelector(
                    ".editor-nombre-ejercicio"
                )
                .value
                .trim();


        const series =
            parseInt(
                elemento
                    .querySelector(
                        ".editor-series-ejercicio"
                    )
                    .value
            );


        const opcional =
            elemento
                .querySelector(
                    ".editor-opcional-ejercicio"
                )
                .checked;


        if (
            nombre === ""
        ) {

            alert(
                "Todos los ejercicios deben tener nombre."
            );

            return;
        }


        if (
            isNaN(series) ||
            series < 1
        ) {

            alert(
                "El número de series debe ser como mínimo 1."
            );

            return;
        }


        ejercicios.push({

            nombre:
                nombre,

            series:
                series,

            ...(opcional
                ? { opcional: true }
                : {})
        });
    }


    rutinas[dia] = {

        nombre:
            nombreRutina,

        ejercicios:
            ejercicios
    };


    localStorage.setItem(
        "gymTrackerRutinas",
        JSON.stringify(
            rutinas
        )
    );


    alert(
        "Rutina guardada correctamente."
    );


    mostrarEditorRutinas();
}


/* =========================
   BOTÓN HISTORIAL
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const botonHistorial =
            document.getElementById(
                "boton-historial"
            );


        if (botonHistorial) {

            botonHistorial.addEventListener(
                "click",
                mostrarHistorial
            );
        }
    }
);
