# Guía de Migración de Base de Datos (Local -> VPS)

Esta guía te ayudará a exportar tus datos locales y restaurarlos en el servidor VPS donde ya está corriendo Docker.

## 1. Exportar la base de datos local (Desde tu Windows)

Dependiendo de cómo ejecutes PostgreSQL en tu máquina local, elige la Opción A o B.

### Opción A: Si tienes PostgreSQL instalado directamente en Windows

Abre PowerShell y navega a la carpeta donde quieras guardar el respaldo:

```powershell
# Reemplaza 'postgres' con tu usuario local si es diferente
# Te pedirá la contraseña después de ejecutar el comando
pg_dump -U postgres -h localhost -d inventario_db --clean --if-exists > respaldo_inventario.sql
```

### Opción B: Si usas Docker en tu máquina local

Si localmente también usas Docker, primero identifica el nombre de tu contenedor de base de datos con `docker ps` y luego ejecuta:

```powershell
# Reemplaza 'nombre_contenedor_db' con el nombre real de tu contenedor local
docker exec -t nombre_contenedor_db pg_dumpall -c -U postgres > respaldo_inventario.sql
```

---

## 2. Subir el archivo al VPS

Usa el comando `scp` en PowerShell para enviar el archivo `.sql` a tu servidor.

```powershell
# Reemplaza 'usuario', 'ip_vps' y la ruta destino según corresponda
scp .\respaldo_inventario.sql root@<IP_DE_TU_VPS>:/root/
```

*Nota: Si usas una llave SSH, agrega `-i ruta/a/tu/llave.pem` antes del nombre del archivo.*

---

## 3. Restaurar en el VPS (Docker)

Conéctate a tu VPS mediante SSH:

```powershell
ssh root@<IP_DE_TU_VPS>
```

Una vez dentro del VPS, sigue estos pasos para inyectar los datos en el contenedor de Docker que creamos con `docker-compose`.

1.  **Copiar el archivo dentro del contenedor**:
    El contenedor de base de datos se llama `inventario_db` (según nuestro `docker-compose.yml`).

    ```bash
    docker cp respaldo_inventario.sql inventario_db:/tmp/respaldo_inventario.sql
    ```

2.  **Ejecutar la restauración**:

    ```bash
    # Esto borrará los datos actuales en el VPS y pondrá los de tu respaldo
    docker exec -i inventario_db psql -U postgres -d inventario_db -f /tmp/respaldo_inventario.sql
    ```

    *Si recibes errores de que la base de datos no existe, puedes crearla primero:*
    ```bash
    docker exec -i inventario_db psql -U postgres -c "CREATE DATABASE inventario_db;"
    ```

3.  **Verificar**:
    Entra a la consola interactiva de Postgres para confirmar que están las tablas:

    ```bash
    docker exec -it inventario_db psql -U postgres -d inventario_db
    # Dentro de psql ejecuta:
    \dt
    # Para salir:
    \q
    ```

## Solución de Problemas Comunes

*   **Error de versión**: Si tu Postgres local es una versión mucho más nueva que la del VPS (Postgres 15), podría haber conflictos. Trata de usar la misma versión o exportar con opciones de compatibilidad.
*   **Contraseñas**: Si `pg_dump` local falla por autenticación, puedes configurar la variable de entorno `PGPASSWORD` antes del comando en PowerShell: `$env:PGPASSWORD='tu_password_local'`.
