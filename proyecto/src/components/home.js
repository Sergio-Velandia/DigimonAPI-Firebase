// Importamos las funciones necesarias de Firestore
import { collection, query, onSnapshot } from 'firebase/firestore'; 
// Importamos la instancia de Firestore (db)
import { db } from './firebaseConfig.js'; 

export default async function mostrarHome() {
    const appContainer = document.getElementById("app");
    
    // Estructura de la vista Home
    appContainer.innerHTML = `
        <div class="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h2 class="text-4xl font-extrabold text-gray-800 mb-8 text-center">Perfiles Digimon Guardados</h2>
            
            <!-- Contenedor donde se cargarán las tarjetas -->
            <div id="digimon-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <p class="col-span-full text-center text-gray-600">Conectando con la base de datos...</p>
            </div>
        </div>
    `;

    const digimonListContainer = document.getElementById("digimon-list");
    const digimonCollectionRef = collection(db, 'digimon_perfiles');
    const q = query(digimonCollectionRef);

    try {
        // Establecer el listener en tiempo real con onSnapshot
        // onSnapshot escucha los cambios en la consulta (q)
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const perfiles = [];
            
            // Recorre todos los documentos recibidos
            snapshot.forEach((doc) => {
                perfiles.push({ id: doc.id, ...doc.data() });
            });

            // Limpiar contenedor antes de renderizar
            digimonListContainer.innerHTML = "";

            if (perfiles.length === 0) {
                digimonListContainer.innerHTML = `
                    <p class="col-span-full text-center text-lg text-gray-500 p-8 border border-dashed rounded-xl">
                        Aún no hay perfiles Digimon guardados. ¡Crea uno en la vista "Original"!
                    </p>
                `;
                return;
            }

            // Recorrer cada perfil y construir la tarjeta
            perfiles.forEach((perfil) => {
                const card = document.createElement("div");
                
                // Estilos de la tarjeta con Tailwind
                card.className = "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-yellow-500 flex flex-col";
                
                // Formateo de la fecha (si existe)
                const fecha = perfil.fechaCreacion ? 
                    new Date(perfil.fechaCreacion).toLocaleDateString() : 'N/A';

                card.innerHTML = `
                    <div class="flex items-center mb-4">
                        <span class="text-3xl mr-3" role="img" aria-label="Digimon icon">👾</span>
                        <h3 class="text-2xl font-bold text-gray-900">${perfil.nombre || 'Nombre Desconocido'}</h3>
                    </div>
                    
                    <div class="app-info w-full text-sm space-y-2">
                        <p class="text-gray-600">
                            <strong>Nivel:</strong> <span class="font-semibold text-yellow-600">${perfil.nivel || 'Desconocido'}</span>
                        </p>
                        <p class="text-gray-600">
                            <strong>Tipo:</strong> ${perfil.tipo || 'N/A'}
                        </p>
                        <p class="text-gray-600">
                            <strong>Habilidad:</strong> ${perfil.habilidad || 'Ninguna'}
                        </p>
                        <p class="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">
                            ID Documento: ${perfil.id} <br>
                            Guardado el: ${fecha}
                        </p>
                    </div>
                `;
                digimonListContainer.appendChild(card);
            });
        });
        
        // Es importante retornar la función de desuscripción.
        // En una app real, la usarías al cambiar de vista para detener la escucha.
        return unsubscribe;

    } catch (error) {
        console.error("Error al cargar los perfiles de Digimon:", error);
        digimonListContainer.innerHTML = "<p class='col-span-full text-center text-red-500'>Error al cargar los datos de Firestore 😢. Verifica la conexión y permisos.</p>";
    }
}