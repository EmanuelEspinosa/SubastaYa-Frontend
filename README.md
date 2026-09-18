# SubastaYa - Cliente Web (Frontend)

Interfaz de usuario y aplicación SPA (*Single Page Application*) desarrollada en **React 19 + Vite** para la plataforma de subastas en tiempo real **SubastaYa**, creada para la cátedra **Proyecto de Software** de la **Universidad Nacional Arturo Jauretche (UNAJ)**.

El cliente web ofrece una experiencia interactiva con temporizadores regresivos, alertas visuales en zona crítica, Billetera Virtual con desglose de fondos en Escrow, autenticación segura por JWT y maquetación responsive.

---
## ⚙️ **Servidor de API (Backend):**  
La API RESTful desarrollada en .NET 8 con Clean Architecture se encuentra disponible en su correspondiente repositorio de solución: **https://github.com/EmanuelEspinosa/SubastaYa-Backend.git**.

---

## 🛠️ Stack Tecnológico

* **Librería Core:** React 19 (Componentes Funcionales, Hooks, Context API).
* **Herramienta de Construcción / Bundler:** Vite 8.
* **Navegación / Rutas:** React Router DOM (`BrowserRouter`, `Routes`, `Route`).
* **Cliente HTTP:** Fetch API modularizado en servicios (`auctionService.js`, `authService.js`, `walletService.js`).
* **Gestión de Estado Global:** Context API (`AuthContext` para persistencia de token y usuario).
* **Estilos & UI:** CSS3 modularizado con variables de diseño, tarjetas interactivas y modales reutilizables (`ConfirmModal`).
* **Iconografía:** FontAwesome (`@fortawesome/react-fontawesome`) y React Icons.

---

## 📁 Estructura del Proyecto

El código fuente está organizado respetando la separación de responsabilidades:

```
SubastaYa-Frontend/
├── public/
└── src/
├── assets/
├── components/              # Vistas de negocio y contenedores principales
│   ├── Auth/                # Módulo de Autenticación
│   │   ├── Login/           # Formulario e inicio de sesión
│   │   └── Registro/        # Formulario de alta de usuario
│   ├── Contact/             # Formulario de contacto y consultas
│   ├── Footer/              # Pie de página de la aplicación
│   ├── Header/              # Encabezado principal
│   ├── Home/                # Vista de bienvenida e inicio
│   ├── Item/                # Tarjeta individual de subasta
│   ├── ItemDetail/          # Renderizado del detalle del artículo
│   ├── ItemDetailContainer/ # Carga asincrónica de la sala de subasta
│   ├── ItemList/            # Grilla del catálogo de subastas
│   ├── ItemListContainer/   # Contenedor principal con filtros de catálogo
│   └── Panel/               # Panel de control de usuario (Mi Panel)
│       ├── Billetera/       # Gestión de saldo y depósitos
│       ├── CrearSubasta/    # Formulario para publicar nuevos remates
│       ├── MisPublicaciones/# Gestión de subastas creadas por el usuario
│       ├── Pujas/           # Historial de ofertas realizadas
│       ├── MiPanel.css
│       └── MiPanel.jsx
├── context/                 # Estado global de la aplicación
│   └── AuthContext.jsx      # Contexto de autenticación, JWT y gestión de sesión
├── layout/                  # Componentes estructurales de maquetación y UI
│   ├── AboutUs/             # Sección "Sobre Nosotros" (Pilares del sistema)
│   ├── ConfirmModal/        # Modal emergente unificado para feedback
│   ├── FilterBar/           # Barra de filtros por categoría y estado
│   ├── MainLayout/          # Estructura base de maquetación web
│   ├── Newsletter/          # Formulario de suscripción a alertas
│   ├── Pagination/          # Controles de paginación
│   ├── ScrollToTop/         # Restablecimiento de scroll en navegación
│   └── Slider/              # Carrusel visual destacado
├── services/                # Capa de integración con la API REST
│   ├── apiConfig.js         # Configuración centralizada de URL base y .env
│   ├── authService.js       # Peticiones POST /api/auth (Login / Register)
│   ├── subastaService.js    # Peticiones a /api/auctions y registro de pujas
│   └── walletService.js     # Consultas de balance, depósitos e historial
├── App.css
├── App.jsx                  # Definición del enrutador principal
├── index.css
└── main.jsx                 # Punto de entrada de React con Vite
```

---

## ⚙️ Configuración de la API & Gestión de Puertos (`apiConfig.js`)

El punto de contacto con el backend se centraliza en `src/services/apiConfig.js`:

```javascript
// Lee la variable local del archivo .env.local; si no existe, usa por defecto el puerto HTTPS 7000
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7000/api";
export const API_URL = API_BASE_URL;
export default API_BASE_URL;
```

**Comportamiento según el entorno de ejecución**

1. Perfil HTTPS (Visual Studio / dotnet run --launch-profile https): 
Por defecto, la API levanta en https://localhost:7000/api. En este escenario, el frontend se conecta automáticamente sin requerir archivos de configuración adicionales.

2. Perfil HTTP (VS Code / dotnet run estándar): 
Si el backend se inicia únicamente en el puerto HTTP http://localhost:5120/api, se debe crear un archivo .env.local en la raíz del proyecto frontend con la siguiente variable:

```
VITE_API_URL=http://localhost:5120/api
```
---

## ⏱️ Sala de Subastas & Carga Asincrónica (ItemDetailContainer)
* La vista de detalle de la subasta (ItemDetailContainer.jsx) gestiona la carga unificada del artículo y su historial de ofertas mediante peticiones asíncronas paralelas:

- **Carga Concurrente Operativa:** Al ingresar a la sala (useEffect por id), el componente ejecuta en paralelo getSubastaById(id) y getHistorialPujas(id) mediante Promise.all, optimizando el tiempo de respuesta visual.

- **Sincronización del Estado:** Obtiene el estado actualizado del remate (Activa, Finalizada, Desierta), el precio actual, la oferta líder y el listado histórico de pujas anonimizadas.

* **Temporizador Regresivo:** Renderiza la cuenta regresiva en base a la fechaFin oficial devuelta por el backend.

---

## 🔑 Autenticación & Cabeceras Bearer Token (JWT)
* Persistencia de Sesión: Tras validar las credenciales en /api/auth/login, el token JWT se guarda en el localStorage del navegador bajo la clave subastaYa_token.

* Inyección de Cabeceras HTTP: Los servicios que realizan acciones protegidas (como createSubasta, realizarPuja o deposit) obtienen el token guardado e inyectan la cabecera en cada petición HTTP:

```javascript
headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
}
```
* Cierre de Sesión: La función logout() de AuthContext remueve la clave del localStorage, restablece el estado global a visitante y redirige al usuario.

---

## 📌 Credenciales de Prueba para Evaluación
Para probar las funcionalidades de la aplicación (crear subastas, realizar ofertas, verificar saldo retenido en Escrow o simular depósitos), se puede ingresar con los siguientes usuarios predeterminados:

🔑 Contraseña universal para todos los usuarios: 123456

* comprador1@test.com — Postor líder actual (cuenta con $45.000 retenidos en Escrow).

* comprador2@test.com — Usuario solvente con $200.000 disponibles para realizar pujas.

* sinfondos@test.com — Usuario con $500 disponible para validar el rechazo de ofertas por saldo insuficiente.

* vendedor@test.com — Cuenta registrada con perfil de vendedor.

---

## 🚀 Guía de Instalación y Puesta en Marcha

### Prerrequisitos
* Node.js v18.x o superior instalado.
* npm (incluido con Node.js).

### Pasos para ejecutar:
1. Clonar el repositorio:

```javascript
git clone https://github.com/EmanuelEspinosa/SubastaYa-Frontend.git
cd SubastaYa-Frontend
```

2. Instalar dependencias:

```javascript
npm install
```

3. Iniciar el servidor de desarrollo: 
```
npm run dev
```

4. Acceder a la Aplicación:

Abrir el navegador en la dirección indicada por Vite (habitualmente http://localhost:5173).