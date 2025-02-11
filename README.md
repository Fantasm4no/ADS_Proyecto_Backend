# Instrucciones para Configurar la Base de Datos y Ejecutar la Aplicación


## 1. Creación Manual de la Base de Datos en pgAdmin

Para configurar la base de datos manualmente en pgAdmin, sigue estos pasos:

1. Abre pgAdmin y conéctate a tu servidor PostgreSQL.
2. En el panel izquierdo, haz clic derecho en "Databases" y selecciona "Create" > "Database".
3. En el campo **Database name**, ingresa `gym_DB` o el nombre de tu preferencia.
4. En la pestaña **Owner**, selecciona o ingresa el usuario que deseas asignar (por ejemplo, `postgres` o cualquier usuario que hayas creado).
5. Haz clic en "Save" para crear la base de datos.

---

## 2. Restauración de la Base de Datos desde el Backup

### Opción 1: Usando pgAdmin

1. Abre pgAdmin y selecciona la base de datos `gym_DB` en el panel izquierdo.
2. Haz clic derecho sobre `gym_DB` y selecciona la consola.
3. Ejecuta `\q` para salir de la consola y poder navegar en tus archivos locales.
4. Ingresa a la ruta donde se descargó el archivo `gym_db_backup.sql` con el comando `cd`.
5. Ejecuta los siguientes comandos:
   ```sh
   set PGPASSWORD=tu_contraseña
   psql -U tu_usuario -d gym_DB -h localhost -p 5432 -f gym_db_backup.sql
   ```
6. La base de datos se restaurará con todas las tablas y datos preexistentes.

---

## 3. Configuración de la Aplicación
Primeramente debes clonar los dos repositorios "ADS_Proyecto" y el repositorio "frontend" en una sola carpeta.
Luego sigue los siguientes pasos:

Para ejecutar la aplicación correctamente, es necesario configurar las credenciales de acceso a la base de datos en los archivos `db.js` y `.env`.

### Modificar el Archivo `.env`

1. Abre el archivo `.env` ubicado en la carpeta del proyecto.

2. Asegúrate de que contenga las siguientes configuraciones:

   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=gym_DB
   DB_PORT=5432
   ```

3. Guarda los cambios.

### Modificar el Archivo `db.js`

1. En la carpeta del proyecto, abre el archivo `db.js`.

2. Asegúrate de que la configuración coincida con las credenciales que configuraste en el `.env`:

   ```js
   const { Pool } = require('pg');
   require('dotenv').config();

   const pool = new Pool({
     user: process.env.DB_USER || "usuarioExample",         // Usuario de PostgreSQL
     host: process.env.DB_HOST || "localhost",       // Host (puede ser localhost o remoto)
     database: process.env.DB_NAME || "gym_DB",  // Nombre de la base de datos
     password: process.env.DB_PASS || "Clave12345", // Contraseña del usuario asignado a tu base de datos.
     port: process.env.DB_PORT || 5432,             // Puerto de conexión (por defecto 5432)
   });

   module.exports = pool;
   ```

3. Guarda los cambios.

---

## 4. Instalación y Ejecución de la Aplicación

Para ejecutar la aplicación, sigue estos pasos:

1. Asegúrate de haber clonado el repositorio e instalado **Node.js** y **npm**.
2. Abre una terminal y navega hasta la carpeta del backend con:
   ```sh
   cd ADS_Proyecto/Backend
   ```
3. Ejecuta el siguiente comando para instalar las dependencias:
   ```sh
   npm install
   ```
4. Inicia el servidor con:
   ```sh
   node server.js
   ```

### Para ejecutar el frontend:

1. En otra terminal, navega a la carpeta del frontend con:
   ```sh
   cd /frontend
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Ejecuta el frontend con:
   ```sh
   npm run serve
   ```

---

## 5. Explicación del Funcionamiento de la Aplicación

La aplicación `EG Fitness Gym` permite:

- **Usuarios:** Registrarse, iniciar sesión y ver información sobre servicios, productos y membresías.
- **Administradores:** Gestionar productos, rutinas, membresías y usuarios.
- **Carrito de Compras:** Los clientes pueden agregar productos y membresías al carrito antes de confirmar su compra.
- **Historial de Compras:** Se registran todas las compras realizadas por los usuarios.

### Tecnologías Utilizadas

- **Backend:** Node.js con Express y PostgreSQL.
- **Frontend:** Vue.js.
- **Base de Datos:** PostgreSQL.

---

## 6. Notas Adicionales

- Es importante cambiar las credenciales en `.env` y `db.js`.
- Se recomienda ejecutar la aplicación en un entorno de desarrollo antes de desplegarla en producción.
- Si hay errores de conexión, verificar que PostgreSQL esté en ejecución y las credenciales sean correctas.

