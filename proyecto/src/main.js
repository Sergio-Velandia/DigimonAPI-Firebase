// Importamos los estilos globales
import './style.css'; 

// Importaciones de Vistas (asumiendo que están en la carpeta 'components')
import mostrarRegistro from "./components/registro.js";
import mostrarLogin from "./components/login.js";
import mostrarFormularioDigimon from './components/original.js'; 
import mostrarHome from "./components/home.js";
import mostrarLogout from "./components/logout.js";


// Importaciones de Firebase
// Asumiendo que esta ruta apunta al archivo donde se exportan 'auth' y 'db'
import { auth } from './components/firebaseConfig.js'; 
import { onAuthStateChanged } from 'firebase/auth';


// Función para limpiar el contenido principal y resetear la clase activa del menú
function loadView(viewFunction, activeButtonId) {
    document.getElementById("app").innerHTML = '';
    viewFunction();

    // Eliminar la clase activa de todos los botones
    const navButtons = document.querySelectorAll('#menu button');
    navButtons.forEach(btn => btn.classList.remove('nav-button-active'));

    // Añadir la clase activa al botón actual
    const activeButton = document.getElementById(activeButtonId);
    if (activeButton) {
        activeButton.classList.add('nav-button-active');
    }
}


// Escucha los cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
    // Si hay un usuario autenticado (Sesión iniciada)
    if (user) {
        // Muestra el menú de usuario autenticado
        document.getElementById("menu").innerHTML = `
            <nav class="flex justify-center space-x-4">
                <button id="menuHome" class="py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">Home</button>
                <button id="menuOriginal" class="py-2 px-4 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">Original (Digimon Form)</button>
                <button id="menuLogout" class="py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Logout</button>
            </nav>
        `;
        
        // Enlaza los Event Listeners a las funciones de vista usando la función loadView
        document.getElementById("menuHome").addEventListener("click", () => loadView(mostrarHome, "menuHome"));
        document.getElementById("menuOriginal").addEventListener("click", () => loadView(mostrarFormularioDigimon, "menuOriginal")); 
        document.getElementById("menuLogout").addEventListener("click", mostrarLogout);
        
        // Muestra la vista Home por defecto y la marca como activa
        loadView(mostrarHome, "menuHome");

    } else {
        // Si no hay usuario (Sesión cerrada)
        // Muestra el menú de autenticación
        document.getElementById("menu").innerHTML = `
            <nav class="flex justify-center space-x-4">
                <button id="menuLogin" class="py-2 px-4 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition">Login</button>
                <button id="menuRegistro" class="py-2 px-4 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition">Registro</button>
            </nav>
        `;
        
        // Enlaza los Event Listeners
        document.getElementById("menuLogin").addEventListener("click", () => loadView(mostrarLogin, "menuLogin"));
        document.getElementById("menuRegistro").addEventListener("click", () => loadView(mostrarRegistro, "menuRegistro"));
        
        // Muestra la vista Login por defecto y la marca como activa
        loadView(mostrarLogin, "menuLogin");
    }
});