# Guía de Despliegue en VPS con Docker

Esta guía detalla los pasos para desplegar la aplicación "Inventario Torneos" en un servidor VPS utilizando Docker y Docker Compose.

## Prerrequisitos en el VPS

Asegúrate de tener instalados los siguientes componentes en tu servidor:

1.  **Git**: Para clonar el repositorio.
2.  **Docker**: Para ejecutar los contenedores.
3.  **Docker Compose**: Para orquestar los servicios.

## Pasos de Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd inventario_torneos
```

### 2. Configurar Variables de Entorno

El proyecto incluye un archivo `.env` en la raíz con valores por defecto. **Es importante cambiar las contraseñas para producción.**

Edita el archivo `.env`:

```bash
nano .env
```

Ajusta las siguientes variables según sea necesario:

```ini
DB_NAME=inventario_db
DB_USER=postgres
DB_PASS=tu_contraseña_segura_db
DB_HOST=postgres
PORT=4000
JWT_SECRET=tu_secreto_jwt_muy_largo_y_seguro
```

> **Nota:** No necesitas cambiar `DB_HOST` ni `PORT` a menos que tengas conflictos específicos, ya que estos son internos de la red de Docker.

### 3. Construir y Levantar los Contenedores

Ejecuta el siguiente comando para construir las imágenes e iniciar los servicios en segundo plano:

```bash
docker-compose up -d --build
```

### 4. Verificar el Estado

Puedes comprobar que los contenedores estén corriendo con:

```bash
docker-compose ps
```

Deberías ver tres servicios activos:
- `inventario_db` (PostgreSQL)
- `inventario_backend` (Node.js API)
- `inventario_frontend` (Nginx + React)

### 5. Acceder a la Aplicación

La aplicación estará disponible en el puerto 80 de tu VPS. Accede a través de tu navegador:

```
http://<IP_DE_TU_VPS>
```

o si tienes un dominio configurado:

```
http://tu-dominio.com
```

## Mantenimiento

### Ver logs

Para ver los logs de todos los servicios:
```bash
docker-compose logs -f
```

Para ver los logs solo del backend:
```bash
docker-compose logs -f backend
```

### Actualizar la aplicación

Si realizas cambios en el código y los subes al repositorio:

1.  Descarga los cambios:
    ```bash
    git pull
    ```
2.  Reconstruye los contenedores:
    ```bash
    docker-compose up -d --build
    ```

### Respaldo de Base de Datos

Los datos de PostgreSQL se guardan en un volumen de Docker llamado `postgres_data`. Para hacer un backup:

```bash
docker exec -t inventario_db pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
```

## Estructura de Docker

- **Frontend**: Servido por Nginx en el puerto 80. Nginx también actúa como proxy inverso, redirigiendo las peticiones que empiezan con `/api` hacia el backend.
- **Backend**: Corre en el puerto 4000 (interno) y se conecta a la base de datos `postgres`.
- **Database**: PostgreSQL 15 corriendo en el puerto 5432 (interno).
