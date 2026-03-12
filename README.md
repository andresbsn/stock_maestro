# Sistema de Inventario y Ventas - Circuito PM

## Estructura del Proyecto

El sistema está dividido en dos carpetas principales:
- `backend/`: API Node.js + Express + Sequelize.
- `frontend/`: Aplicación React + Vite.

## Requisitos Previos

- Node.js instalado.
- PostgreSQL en ejecución.

## Configuración Backend

1.  Navegar a la carpeta `backend`:
    ```bash
    cd backend
    ```
2.  Instalar dependencias (si no se instalaron automáticamente):
    ```bash
    npm install
    ```
3.  Configurar variables de entorno:
    - Copiar el archivo `.env.example` a `.env`:
    ```bash
    cp .env.example .env
    ```
    - Editar `.env` y colocar las credenciales correctas de tu base de datos PostgreSQL (`DB_USER`, `DB_PASS`, `DB_NAME`). Asegúrate de crear la base de datos `inventario_db` (o la que definas) en tu motor SQL.

4.  Iniciar el servidor:
    ```bash
    npm start
    # o para desarrollo con autoreload:
    node src/server.js
    ```
    *Nota: Al iniciar, Sequelize intentará conectar. Si la opción `sync` está habilitada en `server.js`, se crearán las tablas.*

## Configuración Frontend

1.  Navegar a la carpeta `frontend`:
    ```bash
    cd frontend
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Iniciar servidor de desarrollo:
    ```bash
    npm run dev
    ```

## Arquitectura y Servicios Clave

El backend sigue una arquitectura por capas:
- **Models**: Definición de tablas y relaciones (Sequelize).
- **Services**: Lógica de negocio pesada, uso de transacciones y validaciones.
  - `stock.service.js`: Centraliza movimientos de inventario y Kardex.
  - `compras.service.js`, `ventas.service.js`, `transferencias.service.js`: Manejan sus flujos y llaman a `stock.service`.
- **Controllers**: Manejo de Request/Response HTTP.
- **Routes**: Definición de endpoints protegidos con Middleware de Auth.

## Usuarios por Defecto (Seed)

El sistema requiere crear un usuario Admin inicial manualmente en la base de datos o mediante un script de seed (pendiente de ejecución) para poder loguearse y crear los Complejos y demás usuarios.
