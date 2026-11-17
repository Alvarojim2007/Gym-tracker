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

        <button
            class="boton-comparar"
            onclick="mostrarGraficas()">

            Ver gráficas de progreso

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
        historial
            .map(
                (entrenamiento, indiceOriginal) => ({
                    entrenamiento,
                    indiceOriginal
                })
            )
            .filter(
                (registro) =>
                    registro.entrenamiento.dia === dia
            );

    entrenamientosDia.sort(
        (a, b) =>
            new Date(b.entrenamiento.fecha) -
            new Date(a.entrenamiento.fecha)
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
        (registro, indiceEntrenamiento) => {
            const entrenamiento =
                registro.entrenamiento;

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
                <button
                    type="button"
                    class="guardar"
                    onclick="editarEntrenamiento(
                        ${dia},
                        ${indiceEntrenamiento}
                    )">

                    Editar entrenamiento

                </button>
            `;

            html += `
                </div>
            `;
        }
    );

    contenido.innerHTML =
        html;
}


/* =========================
   EDITAR ENTRENAMIENTO
========================= */

function editarEntrenamiento(
    dia,
    indiceEntrenamiento
) {
    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];

    const entrenamientosDia =
        historial
            .map(
                (entrenamiento, indiceOriginal) => ({
                    entrenamiento,
                    indiceOriginal
                })
            )
            .filter(
                (registro) =>
                    registro.entrenamiento.dia === dia
            )
            .sort(
                (a, b) =>
                    new Date(b.entrenamiento.fecha) -
                    new Date(a.entrenamiento.fecha)
            );

    const registro =
        entrenamientosDia[
            indiceEntrenamiento
        ];

    if (
        !registro
    ) {
        return;
    }

    const entrenamiento =
        registro.entrenamiento;

    const fecha =
        new Date(
            entrenamiento.fecha
        );

    let html = `
        <button
            class="volver"
            onclick="mostrarHistorialDia(${dia})">

            ← Volver al entrenamiento

        </button>

        <h2>
            Editar entrenamiento
        </h2>

        <p>
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
        </p>
    `;

    entrenamiento.ejercicios.forEach(
        (ejercicio, indiceEjercicio) => {
            html += `
                <div
                    class="ejercicio"
                    data-indice-ejercicio="${indiceEjercicio}">

                    <h3>
                        ${ejercicio.nombre}
                    </h3>

                    <div class="series">
            `;

            ejercicio.series.forEach(
                (serie, indiceSerie) => {
                    html += `
                        <div class="serie">

                            <span>
                                Serie ${indiceSerie + 1}
                            </span>

                            <input
                                type="number"
                                step="0.5"
                                class="peso"
                                value="${serie.peso || ""}"
                                placeholder="Peso (kg)"
                            >

                            <input
                                type="number"
                                class="repeticiones"
                                value="${serie.repeticiones || ""}"
                                placeholder="Repeticiones"
                            >

                            <button
                                type="button"
                                class="boton-eliminar"
                                onclick="eliminarSerieEditada(this)">

                                Eliminar

                            </button>

                        </div>
                    `;
                }
            );

            html += `
                    </div>

                    <button
                        type="button"
                        class="anadir-serie"
                        onclick="anadirSerieEditada(this)">

                        + Añadir serie

                    </button>

                </div>
            `;
        }
    );

    html += `
        <button
            class="guardar"
            onclick="guardarEntrenamientoEditado(
                ${dia},
                ${registro.indiceOriginal}
            )">

            Guardar cambios

        </button>
    `;

    document.getElementById(
        "contenido"
    ).innerHTML =
        html;
}

function anadirSerieEditada(
    boton
) {
    const ejercicio =
        boton.closest(
            ".ejercicio"
        );

    const contenedor =
        ejercicio.querySelector(
            ".series"
        );

    const numero =
        contenedor.querySelectorAll(
            ".serie"
        ).length + 1;

    contenedor.insertAdjacentHTML(
        "beforeend",
        `
            <div class="serie">

                <span>
                    Serie ${numero}
                </span>

                <input
                    type="number"
                    step="0.5"
                    class="peso"
                    value=""
                    placeholder="Peso (kg)"
                >

                <input
                    type="number"
                    class="repeticiones"
                    value=""
                    placeholder="Repeticiones"
                >

                <button
                    type="button"
                    class="boton-eliminar"
                    onclick="eliminarSerieEditada(this)">

                    Eliminar

                </button>

            </div>
        `
    );
}

function eliminarSerieEditada(
    boton
) {
    const serie =
        boton.closest(
            ".serie"
        );

    if (
        serie
    ) {
        serie.remove();
    }

    const ejercicio =
        boton.closest(
            ".ejercicio"
        );

    const contenedor =
        ejercicio.querySelector(
            ".series"
        );

    contenedor
        .querySelectorAll(
            ".serie"
        )
        .forEach(
            (serieElemento, indice) => {
                serieElemento
                    .querySelector(
                        "span"
                    )
                    .textContent =
                        `Serie ${indice + 1}`;
            }
        );
}

function guardarEntrenamientoEditado(
    dia,
    indiceEntrenamiento
) {
    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];

    if (
        !historial[
            indiceEntrenamiento
        ]
    ) {
        alert(
            "No se ha encontrado el entrenamiento."
        );

        return;
    }

    const elementosEjercicio =
        document
            .getElementById(
                "contenido"
            )
            .querySelectorAll(
                ".ejercicio"
            );

    const ejercicios =
        [];

    elementosEjercicio.forEach(
        (ejercicioElemento) => {
            const nombre =
                ejercicioElemento
                    .querySelector(
                        "h3"
                    )
                    .textContent
                    .trim();

            const pesos =
                ejercicioElemento.querySelectorAll(
                    ".peso"
                );

            const repeticiones =
                ejercicioElemento.querySelectorAll(
                    ".repeticiones"
                );

            const series =
                [];

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

            if (
                series.length > 0
            ) {
                ejercicios.push({
                    nombre:
                        nombre,

                    series:
                        series
                });
            }
        }
    );

    historial[
        indiceEntrenamiento
    ].ejercicios =
        ejercicios;

    localStorage.setItem(
        "gymTrackerHistorial",
        JSON.stringify(
            historial
        )
    );

    alert(
        "Entrenamiento actualizado correctamente."
    );

    mostrarHistorialDia(
        dia
    );
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
            new Date(b.fecha) -
            new Date(a.fecha)
    );

    let html = "";

    let mejorPeso = 0;
    let mejorVolumen = 0;

    const registros =
        entrenamientos
            .map((entrenamiento) => ({
                entrenamiento,
                ejercicio:
                    entrenamiento.ejercicios.find(
                        (ejercicio) =>
                            ejercicio.nombre ===
                            nombreEjercicio
                    )
            }))
            .filter(
                (registro) =>
                    registro.ejercicio
            );

    if (registros.length === 0) {
        resultado.innerHTML = `
            <p>
                No hay datos para comparar
                este ejercicio.
            </p>
        `;

        return;
    }

    registros.forEach(
        (registro, indiceEntrenamiento) => {
            const entrenamiento =
                registro.entrenamiento;

            const ejercicio =
                registro.ejercicio;

            const ejercicioAnterior =
                registros[indiceEntrenamiento + 1]
                    ? registros[
                        indiceEntrenamiento + 1
                    ].ejercicio
                    : null;

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

                    const serieAnterior =
                        ejercicioAnterior
                            ? ejercicioAnterior.series[indice]
                            : null;

                    const pesoAnterior =
                        serieAnterior
                            ? parseFloat(
                                serieAnterior.peso
                            )
                            : NaN;

                    const repeticionesAnteriores =
                        serieAnterior
                            ? parseFloat(
                                serieAnterior.repeticiones
                            )
                            : NaN;

                    let clasePeso =
                        "mismo";

                    let claseRepeticiones =
                        "mismo";

                    let diferenciaPeso =
                        "";

                    let diferenciaRepeticiones =
                        "";

                    if (
                        !isNaN(pesoActual) &&
                        !isNaN(pesoAnterior)
                    ) {
                        const diferencia =
                            pesoActual -
                            pesoAnterior;

                        if (diferencia > 0) {
                            clasePeso =
                                "subida";
                        } else if (diferencia < 0) {
                            clasePeso =
                                "bajada";
                        }

                        diferenciaPeso =
                            diferencia > 0
                                ? `(+${diferencia} kg)`
                                : `(${diferencia} kg)`;
                    }

                    if (
                        !isNaN(repeticionesActuales) &&
                        !isNaN(repeticionesAnteriores)
                    ) {
                        const diferencia =
                            repeticionesActuales -
                            repeticionesAnteriores;

                        if (diferencia > 0) {
                            claseRepeticiones =
                                "subida";
                        } else if (diferencia < 0) {
                            claseRepeticiones =
                                "bajada";
                        }

                        diferenciaRepeticiones =
                            diferencia > 0
                                ? `(+${diferencia} reps)`
                                : `(${diferencia} reps)`;
                    }

                    let volumenSerie =
                        0;

                    if (
                        !isNaN(pesoActual) &&
                        !isNaN(repeticionesActuales)
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

                                ${diferenciaPeso}

                            </span>

                            ×

                            <span
                                class="${claseRepeticiones}">

                                ${
                                    serie.repeticiones ||
                                    "-"
                                }

                                repeticiones

                                ${diferenciaRepeticiones}

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

    resultado.innerHTML =
        html;
}


/* =========================
   GRÁFICAS DE PROGRESO
========================= */

function mostrarGraficas() {
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
            <button
                class="volver"
                onclick="mostrarHistorial()">

                ← Volver al historial

            </button>

            <h2>
                Gráficas de progreso
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
            Gráficas de progreso
        </h2>

        <p>
            Selecciona el día:
        </p>

        <select
            id="grafica-dia"
            class="selector-comparar"
            onchange="actualizarEjerciciosGrafica()">
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
            id="grafica-ejercicio"
            class="selector-comparar"
            onchange="dibujarGraficaProgreso()">
        </select>

        <p>
            Selecciona qué quieres ver:
        </p>

        <select
            id="grafica-metrica"
            class="selector-comparar"
            onchange="dibujarGraficaProgreso()">

            <option value="peso">
                Peso máximo
            </option>

            <option value="volumen">
                Volumen total
            </option>

            <option value="repeticiones">
                Repeticiones totales
            </option>

        </select>

        <div
            id="resumen-grafica"
            style="
                margin-top:20px;
                display:grid;
                grid-template-columns:repeat(4,minmax(0,1fr));
                gap:10px;
            ">
        </div>

        <div
            style="
                margin-top:25px;
                background:#111;
                border:1px solid #292929;
                border-radius:12px;
                padding:18px;
                overflow:hidden;
            ">

            <canvas
                id="grafica-progreso"
                width="1100"
                height="560"
                style="
                    width:100%;
                    height:auto;
                    display:block;
                ">
            </canvas>

        </div>

        <div
            id="detalle-grafica"
            style="
                margin-top:15px;
                background:#151515;
                border-radius:10px;
                padding:15px;
                color:#aaa;
                font-size:14px;
            ">
        </div>
    `;

    contenido.innerHTML =
        html;

    actualizarEjerciciosGrafica();
}


/* =========================
   ACTUALIZAR EJERCICIOS
========================= */

function actualizarEjerciciosGrafica() {
    const selectorDia =
        document.getElementById(
            "grafica-dia"
        );

    const selectorEjercicio =
        document.getElementById(
            "grafica-ejercicio"
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

    dibujarGraficaProgreso();
}


/* =========================
   OBTENER DATOS GRÁFICA
========================= */

function obtenerDatosGrafica(
    dia,
    nombreEjercicio,
    metrica
) {
    const historial =
        JSON.parse(
            localStorage.getItem(
                "gymTrackerHistorial"
            )
        ) || [];

    const entrenamientos =
        historial
            .filter(
                (entrenamiento) =>
                    entrenamiento.dia === dia
            )
            .sort(
                (a, b) =>
                    new Date(a.fecha) -
                    new Date(b.fecha)
            );

    const datos = [];

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

            let valor = 0;

            if (
                metrica === "peso"
            ) {
                const pesos =
                    ejercicio.series
                        .map(
                            (serie) =>
                                parseFloat(
                                    serie.peso
                                )
                        )
                        .filter(
                            (peso) =>
                                !isNaN(
                                    peso
                                )
                        );

                if (
                    pesos.length === 0
                ) {
                    return;
                }

                valor =
                    Math.max(
                        ...pesos
                    );
            } else if (
                metrica === "volumen"
            ) {
                ejercicio.series.forEach(
                    (serie) => {
                        const peso =
                            parseFloat(
                                serie.peso
                            );

                        const repeticiones =
                            parseFloat(
                                serie.repeticiones
                            );

                        if (
                            !isNaN(
                                peso
                            ) &&
                            !isNaN(
                                repeticiones
                            )
                        ) {
                            valor +=
                                peso *
                                repeticiones;
                        }
                    }
                );

                if (
                    valor === 0
                ) {
                    return;
                }
            } else if (
                metrica === "repeticiones"
            ) {
                ejercicio.series.forEach(
                    (serie) => {
                        const repeticiones =
                            parseFloat(
                                serie.repeticiones
                            );

                        if (
                            !isNaN(
                                repeticiones
                            )
                        ) {
                            valor +=
                                repeticiones;
                        }
                    }
                );

                if (
                    valor === 0
                ) {
                    return;
                }
            }

            datos.push({
                fecha:
                    entrenamiento.fecha,

                valor:
                    valor
            });
        }
    );

    return datos;
}


/* =========================
   FORMATEAR NÚMERO
========================= */

function formatearNumeroGrafica(
    valor
) {
    if (
        Number.isInteger(
            valor
        )
    ) {
        return String(
            valor
        );
    }

    return valor.toFixed(
        1
    );
}


/* =========================
   CALCULAR ESCALA
========================= */

function calcularEscalaGrafica(
    minimo,
    maximo
) {
    if (
        minimo === maximo
    ) {
        const margen =
            Math.max(
                Math.abs(
                    maximo
                ) * 0.15,
                1
            );

        return {
            minimo:
                Math.max(
                    0,
                    minimo -
                        margen
                ),

            maximo:
                maximo +
                margen
        };
    }

    const rango =
        maximo -
        minimo;

    const margen =
        rango *
        0.12;

    let escalaMinima =
        minimo -
        margen;

    let escalaMaxima =
        maximo +
        margen;

    if (
        minimo >= 0
    ) {
        escalaMinima =
            Math.max(
                0,
                escalaMinima
            );
    }

    return {
        minimo:
            escalaMinima,

        maximo:
            escalaMaxima
    };
}


/* =========================
   DIBUJAR GRÁFICA
========================= */

function dibujarGraficaProgreso() {
    const selectorDia =
        document.getElementById(
            "grafica-dia"
        );

    const selectorEjercicio =
        document.getElementById(
            "grafica-ejercicio"
        );

    const selectorMetrica =
        document.getElementById(
            "grafica-metrica"
        );

    const canvas =
        document.getElementById(
            "grafica-progreso"
        );

    const resumen =
        document.getElementById(
            "resumen-grafica"
        );

    const detalle =
        document.getElementById(
            "detalle-grafica"
        );

    if (
        !selectorDia ||
        !selectorEjercicio ||
        !selectorMetrica ||
        !canvas
    ) {
        return;
    }

    const dia =
        parseInt(
            selectorDia.value
        );

    const nombreEjercicio =
        selectorEjercicio.value;

    const metrica =
        selectorMetrica.value;

    const datos =
        obtenerDatosGrafica(
            dia,
            nombreEjercicio,
            metrica
        );

    const ctx =
        canvas.getContext(
            "2d"
        );

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (
        datos.length === 0
    ) {
        resumen.innerHTML = `
            <div
                style="
                    grid-column:1/-1;
                    background:#151515;
                    padding:20px;
                    border-radius:10px;
                    text-align:center;
                ">

                No hay suficientes datos
                para mostrar esta gráfica.

            </div>
        `;

        if (
            detalle
        ) {
            detalle.innerHTML =
                "";
        }

        return;
    }

    let tituloMetrica =
        "";

    let unidad =
        "";

    if (
        metrica === "peso"
    ) {
        tituloMetrica =
            "Peso máximo";

        unidad =
            "kg";
    } else if (
        metrica === "volumen"
    ) {
        tituloMetrica =
            "Volumen total";

        unidad =
            "kg";
    } else {
        tituloMetrica =
            "Repeticiones totales";

        unidad =
            "reps";
    }

    const valores =
        datos.map(
            (dato) =>
                dato.valor
        );

    const primero =
        valores[0];

    const actual =
        valores[
            valores.length -
            1
        ];

    const mejor =
        Math.max(
            ...valores
        );

    const minimo =
        Math.min(
            ...valores
        );

    const maximo =
        Math.max(
            ...valores
        );

    let cambio =
        0;

    if (
        primero !== 0
    ) {
        cambio =
            (
                (
                    actual -
                    primero
                ) /
                primero
            ) *
            100;
    }

    let claseCambio =
        "";

    if (
        cambio > 0
    ) {
        claseCambio =
            "subida";
    } else if (
        cambio < 0
    ) {
        claseCambio =
            "bajada";
    }

    resumen.innerHTML = `
        <div
            style="
                background:#151515;
                padding:14px;
                border-radius:10px;
                text-align:center;
                border:1px solid #292929;
            ">

            <div
                style="
                    color:#999;
                    font-size:13px;
                ">
                Inicial
            </div>

            <div
                style="
                    font-size:21px;
                    margin-top:5px;
                    font-weight:bold;
                ">
                ${formatearNumeroGrafica(
                    primero
                )}
                ${unidad}
            </div>

        </div>

        <div
            style="
                background:#151515;
                padding:14px;
                border-radius:10px;
                text-align:center;
                border:1px solid #292929;
            ">

            <div
                style="
                    color:#999;
                    font-size:13px;
                ">
                Actual
            </div>

            <div
                style="
                    font-size:21px;
                    margin-top:5px;
                    font-weight:bold;
                ">
                ${formatearNumeroGrafica(
                    actual
                )}
                ${unidad}
            </div>

        </div>

        <div
            style="
                background:#151515;
                padding:14px;
                border-radius:10px;
                text-align:center;
                border:1px solid #292929;
            ">

            <div
                style="
                    color:#999;
                    font-size:13px;
                ">
                Mejor
            </div>

            <div
                style="
                    font-size:21px;
                    margin-top:5px;
                    font-weight:bold;
                ">
                ${formatearNumeroGrafica(
                    mejor
                )}
                ${unidad}
            </div>

        </div>

        <div
            style="
                background:#151515;
                padding:14px;
                border-radius:10px;
                text-align:center;
                border:1px solid #292929;
            ">

            <div
                style="
                    color:#999;
                    font-size:13px;
                ">
                Cambio
            </div>

            <div
                class="${claseCambio}"
                style="
                    font-size:21px;
                    margin-top:5px;
                    font-weight:bold;
                ">
                ${
                    cambio > 0
                        ? "+"
                        : ""
                }${cambio.toFixed(
                    1
                )}%
            </div>

        </div>
    `;

    if (
        detalle
    ) {
        detalle.innerHTML = `
            <strong
                style="
                    color:#fff;
                ">
                ${datos.length}

                ${
                    datos.length === 1
                        ? "entrenamiento"
                        : "entrenamientos"
                }
            </strong>

            · Desde

            ${new Date(
                datos[0].fecha
            ).toLocaleDateString(
                "es-ES"
            )}

            hasta

            ${new Date(
                datos[
                    datos.length -
                    1
                ].fecha
            ).toLocaleDateString(
                "es-ES"
            )}

            · Rango:

            ${formatearNumeroGrafica(
                minimo
            )}

            –

            ${formatearNumeroGrafica(
                maximo
            )}

            ${unidad}
        `;
    }

    const ancho =
        canvas.width;

    const alto =
        canvas.height;

    const margenIzquierdo =
        82;

    const margenDerecho =
        35;

    const margenSuperior =
        70;

    const margenInferior =
        85;

    const anchoGrafica =
        ancho -
        margenIzquierdo -
        margenDerecho;

    const altoGrafica =
        alto -
        margenSuperior -
        margenInferior;

    const escala =
        calcularEscalaGrafica(
            minimo,
            maximo
        );

    const escalaMinima =
        escala.minimo;

    const escalaMaxima =
        escala.maximo;

    const rango =
        escalaMaxima -
        escalaMinima;

    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        0,
        0,
        ancho,
        alto
    );

    ctx.fillStyle =
        "#fff";

    ctx.font =
        "bold 21px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        `${tituloMetrica} — ${nombreEjercicio}`,
        ancho / 2,
        32
    );

    ctx.fillStyle =
        "#888";

    ctx.font =
        "13px Arial";

    ctx.fillText(
        `${datos.length} ${
            datos.length === 1
                ? "entrenamiento"
                : "entrenamientos"
        }`,
        ancho / 2,
        52
    );

    ctx.strokeStyle =
        "#444";

    ctx.lineWidth =
        1;

    ctx.beginPath();

    ctx.moveTo(
        margenIzquierdo,
        margenSuperior
    );

    ctx.lineTo(
        margenIzquierdo,
        alto -
            margenInferior
    );

    ctx.lineTo(
        ancho -
            margenDerecho,
        alto -
            margenInferior
    );

    ctx.stroke();

    const numeroLineas =
        5;

    ctx.font =
        "12px Arial";

    ctx.textAlign =
        "right";

    for (
        let i = 0;
        i <= numeroLineas;
        i++
    ) {
        const porcentaje =
            i /
            numeroLineas;

        const y =
            margenSuperior +
            altoGrafica *
                porcentaje;

        const valor =
            escalaMaxima -
            rango *
                porcentaje;

        ctx.strokeStyle =
            "#252525";

        ctx.beginPath();

        ctx.moveTo(
            margenIzquierdo,
            y
        );

        ctx.lineTo(
            ancho -
                margenDerecho,
            y
        );

        ctx.stroke();

        ctx.fillStyle =
            "#888";

        ctx.fillText(
            formatearNumeroGrafica(
                valor
            ),
            margenIzquierdo -
                12,
            y + 4
        );
    }

    const puntos = [];

    datos.forEach(
        (dato, indice) => {
            let x;

            if (
                datos.length === 1
            ) {
                x =
                    margenIzquierdo +
                    anchoGrafica /
                        2;
            } else {
                x =
                    margenIzquierdo +
                    (
                        indice /
                        (
                            datos.length -
                            1
                        )
                    ) *
                    anchoGrafica;
            }

            const y =
                margenSuperior +
                (
                    (
                        escalaMaxima -
                        dato.valor
                    ) /
                    rango
                ) *
                altoGrafica;

            puntos.push({
                x:
                    x,

                y:
                    y
            });
        }
    );

    if (
        puntos.length > 1
    ) {
        const gradiente =
            ctx.createLinearGradient(
                0,
                margenSuperior,
                0,
                alto -
                    margenInferior
            );

        gradiente.addColorStop(
            0,
            "rgba(77,171,247,0.22)"
        );

        gradiente.addColorStop(
            1,
            "rgba(77,171,247,0)"
        );

        ctx.fillStyle =
            gradiente;

        ctx.beginPath();

        ctx.moveTo(
            puntos[0].x,
            alto -
                margenInferior
        );

        puntos.forEach(
            (punto) => {
                ctx.lineTo(
                    punto.x,
                    punto.y
                );
            }
        );

        ctx.lineTo(
            puntos[
                puntos.length -
                1
            ].x,
            alto -
                margenInferior
        );

        ctx.closePath();

        ctx.fill();
    }

    ctx.strokeStyle =
        "#4dabf7";

    ctx.lineWidth =
        3;

    ctx.lineJoin =
        "round";

    ctx.lineCap =
        "round";

    ctx.beginPath();

    puntos.forEach(
        (punto, indice) => {
            if (
                indice === 0
            ) {
                ctx.moveTo(
                    punto.x,
                    punto.y
                );
            } else {
                ctx.lineTo(
                    punto.x,
                    punto.y
                );
            }
        }
    );

    ctx.stroke();

    puntos.forEach(
        (punto, indice) => {
            const dato =
                datos[indice];

            ctx.fillStyle =
                "rgba(77,171,247,0.18)";

            ctx.beginPath();

            ctx.arc(
                punto.x,
                punto.y,
                10,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle =
                "#111";

            ctx.beginPath();

            ctx.arc(
                punto.x,
                punto.y,
                6,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.strokeStyle =
                "#4dabf7";

            ctx.lineWidth =
                3;

            ctx.beginPath();

            ctx.arc(
                punto.x,
                punto.y,
                5,
                0,
                Math.PI * 2
            );

            ctx.stroke();

            ctx.fillStyle =
                "#fff";

            ctx.font =
                "bold 12px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                `${formatearNumeroGrafica(
                    dato.valor
                )} ${unidad}`,
                punto.x,
                punto.y - 16
            );

            const fecha =
                new Date(
                    dato.fecha
                );

            const fechaTexto =
                fecha.toLocaleDateString(
                    "es-ES",
                    {
                        day:
                            "2-digit",

                        month:
                            "2-digit"
                    }
                );

            ctx.fillStyle =
                "#888";

            ctx.font =
                "12px Arial";

            ctx.fillText(
                fechaTexto,
                punto.x,
                alto -
                    margenInferior +
                    25
            );
        }
    );

    ctx.fillStyle =
        "#666";

    ctx.font =
        "12px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "Evolución de tu rendimiento",
        ancho / 2,
        alto - 18
    );
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
            html +=
                crearEditorEjercicioHTML(
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
                ? {
                    opcional:
                        true
                }
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

        if (
            botonHistorial
        ) {
            botonHistorial.addEventListener(
                "click",
                mostrarHistorial
            );
        }
    }
);
