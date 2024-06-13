# Proyecto Backend

## Instalación y configuración

1. Dentro de una consola en este directorio, instalar las dependencias

    ```bash
    npm install
    ```
    ó
    ```bash
    yarn install
    ```

2. Para correr el programa, debemos tener definidas las siguientes variables de entorno:

    ```bash
    PORT = XXXX
    SECRET_KEY: '<SECRET>'
    SESSION_EXPIRY_TIME: XXXX
    CNX_STRING = 'mongodb+srv://<username>:<password>@beyondthebasics.abcde.mongodb.net/'
    DB_NAME = '<database>'
    CLOUDINARY_NAME = '<cloud>'
    CLOUDINARY_API = '<API>'
    CLOUDINARY_SECRET = '<SECRET>'
    ```


3. Una vez instaladas todas las dependencias, inicializar el proyecto 

    ```bash
    npm start
    ```
    ó
    ```bash
    yarn start
    ```

## Documentación

### Endpoints

La documentación de los endpoints esta detallada en el archivo swagger.yaml


### MongoDB

La base de datos contara con las siguientes collections para su correcto funcionamiento:

#### Collections

Unicamente contaremos con las siguientes collections:

- Users
- Movies
- Sessions
- Genres