// Importamos las funciones necesarias de Firestore
import { doc, setDoc } from 'firebase/firestore'; 
// Importamos la instancia de Firestore (db) desde la configuración
import { db } from './firebaseConfig.js'; 
import '../style.css';

// Función auxiliar para generar un ID simple (alternativa a doc(db, 'collection').id)
function generateFirestoreId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export default function mostrarFormularioDigimon() {
    const app = document.getElementById("app");
    
    // Contenedor principal del formulario con estilos Tailwind para centrarlo y darle una buena apariencia
    app.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div id="formContainer" class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-blue-600">
                <h2 class="text-3xl font-extrabold mb-6 text-center text-gray-800">Crear Perfil Digimon</h2>
                <p class="text-center text-sm text-gray-500 mb-6">Guarda tu objeto Digimon directamente en Firestore.</p>
                
                <!-- Contenedor para mensajes de estado/error -->
                <div id="feedbackMessage" class="mb-4 p-3 rounded-lg text-sm hidden"></div>

                <div class="space-y-4">
                    <input type="text" id="digiName" placeholder="Nombre del Digimon (Ej: Agumon)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm" required>
                    <input type="text" id="digiLevel" placeholder="Nivel (Ej: Novato, Mega)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm" required>
                    <input type="text" id="digiType" placeholder="Tipo (Ej: Dragón, Bestia)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm" required>
                    <textarea id="digiAbility" placeholder="Habilidad especial o Ataque" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24 shadow-sm"></textarea>
                </div>

                <button id="btnGuardarDigimon" 
                        class="mt-6 w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-150 shadow-lg active:scale-95">
                    Guardar Perfil en Firestore
                </button>
            </div>
        </div>
    `;

    const btnGuardar = document.getElementById("btnGuardarDigimon");
    const feedbackMessage = document.getElementById("feedbackMessage");
    
    // Función para mostrar mensajes de feedback sin usar alert()
    const showFeedback = (message, type = 'success') => {
        feedbackMessage.textContent = message;
        feedbackMessage.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800');
        if (type === 'success') {
            feedbackMessage.classList.add('bg-green-100', 'text-green-800');
        } else {
            feedbackMessage.classList.add('bg-red-100', 'text-red-800');
        }
    };

    btnGuardar.addEventListener("click", async () => {
        btnGuardar.disabled = true;
        feedbackMessage.classList.add('hidden'); // Ocultar mensaje anterior

        const name = document.getElementById("digiName").value.trim();
        const level = document.getElementById("digiLevel").value.trim();
        const type = document.getElementById("digiType").value.trim();
        const ability = document.getElementById("digiAbility").value.trim();

        // Validación: Nombre, Nivel y Tipo son requeridos
        if (!name || !level || !type) {
            showFeedback("Por favor, completa al menos el Nombre, Nivel y Tipo del Digimon.", 'error');
            btnGuardar.disabled = false;
            return;
        }

        // 1. Crear el objeto con la información del formulario
        const digimonProfile = {
            nombre: name,
            nivel: level,
            tipo: type,
            habilidad: ability || 'Ninguna', // Valor por defecto si no se ingresa habilidad
            fechaCreacion: new Date().toISOString()
        };

        try {
            // 2. Guardar el objeto en Firestore.
            // Usamos un ID único generado con nuestra función auxiliar para el documento.
            const docId = generateFirestoreId(); 
            
            // Colección: 'digimon_perfiles'
            await setDoc(doc(db, 'digimon_perfiles', docId), digimonProfile);

            showFeedback(`✅ Perfil de ${name} guardado con éxito. ID: ${docId}.`, 'success');

            // Limpiar formulario después de guardar
            document.getElementById("digiName").value = '';
            document.getElementById("digiLevel").value = '';
            document.getElementById("digiType").value = '';
            document.getElementById("digiAbility").value = '';

        } catch (error) {
            console.error("Error al guardar el perfil del Digimon:", error);
            showFeedback(`❌ Error al guardar el perfil: ${error.message}`, 'error');
        } finally {
            btnGuardar.disabled = false;
        }
    });
}