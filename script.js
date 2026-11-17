const rutinas = {
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


function mostrarDia(dia) {

    const contenido = document.getElementById("contenido");
    const rutina = rutinas[dia];

    if (rutina.ejercicios.length === 0) {

        contenido.innerHTML = `
            <h2>Día ${dia} — ${rutina.nombre}</h2>
            <p class="descanso">Hoy toca descansar.</p>
        `;

        return;
    }

    let html = `
        <h2>Día ${dia} — ${rutina.nombre}</h2>
        <div class="ejercicios">
    `;

    rutina.ejercicios.forEach((ejercicio) => {

        html += `
    <div class="ejercicio" style="
        background: #292929;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 25px;
    ">

        <h3 style="
            font-size: 20px;
            margin-bottom: 18px;
        ">
            ${ejercicio.nombre}
            ${ejercicio.opcional ? " (Opcional)" : ""}
        </h3>

        <div class="series">
`;

        for (let i = 1; i <= ejercicio.series; i++) {

            html += `
                <div class="serie">
                    <span>Serie ${i}</span>

                    <input
                        type="number"
                        step="0.5"
                        placeholder="Peso (kg)"
                        class="peso"
                    >

                    <input
                        type="number"
                        placeholder="Repeticiones"
                        class="repeticiones"
                    >
                </div>
            `;
        }

        html += `
                </div>

            </div>
        `;
    });

    html += `
        </div>

        <button class="guardar" onclick="guardarEntrenamiento(${dia})">
            Guardar entrenamiento
        </button>
    `;

    contenido.innerHTML = html;
}


function guardarEntrenamiento(dia) {

    const contenido = document.getElementById("contenido");
    const ejercicios = contenido.querySelectorAll(".ejercicio");

    const entrenamiento = {
        fecha: new Date().toISOString(),
        dia: dia,
        ejercicios: []
    };

    ejercicios.forEach((ejercicioElemento) => {

        const nombre = ejercicioElemento.querySelector("h3").textContent.trim();
        const pesos = ejercicioElemento.querySelectorAll(".peso");
        const repeticiones = ejercicioElemento.querySelectorAll(".repeticiones");

        const series = [];

        for (let i = 0; i < pesos.length; i++) {

            series.push({
                peso: pesos[i].value,
                repeticiones: repeticiones[i].value
            });
        }

        entrenamiento.ejercicios.push({
            nombre: nombre,
            series: series
        });
    });

    const historial =
        JSON.parse(localStorage.getItem("gymTrackerHistorial")) || [];

    historial.push(entrenamiento);

    localStorage.setItem(
        "gymTrackerHistorial",
        JSON.stringify(historial)
    );

    alert("Entrenamiento guardado correctamente.");
}
