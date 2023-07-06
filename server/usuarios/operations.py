from flask import jsonify, request
import cx_Oracle

def convertir_a_json(cursor, rows):
    results = []
    columns = [d[0] for d in cursor.description]
    for row in rows:
        results.append(dict(zip(columns, row)))
    return results

def get_usuarios(data):
    # Establecer la conexión
    username = 'C##REDES'  # Nombre de usuario de la base de datos
    password = 'REDES'  # Contraseña del usuario
    host = 'localhost'
    port = 1522
    service_name = 'XE'

    try:
        print('entro al try')
        # Crear la cadena de conexión
        dsn = cx_Oracle.makedsn(host, port, service_name=service_name)

        # Establecer la conexión
        connection = cx_Oracle.connect(username, password, dsn)
        print("Conexión con Oracle establecida")

        # Crear el cursor
        cursor = connection.cursor()

        # Se obtienen los datos que ingresó el usuario
        data = request.json
        print(data)

        # Ejecutar la consulta SQL
        cursor.execute("SELECT * FROM CLIENTE")  # Se buscan todos los usuarios
        rows = cursor.fetchall()  # Se obtienen todos en la variable rows
        print(rows)
        usuarios = convertir_a_json(cursor, rows)
        print(usuarios)
        sesion = False
        for usuario in usuarios:
            if data["username"] == usuario["USUARIO_CLI"] and data["password"] == usuario["CONTRASENA_CLI"]:
                sesion = True
                break

        if sesion:
            response = {'message': 'Datos válidos', 'status': 'success'}
        else:
            response = {
                'message': 'Usuario o contraseña inválidos', 'status': 'failed'}

        # Cerrar el cursor
        cursor.close()

        # Cerrar la conexión
        connection.close()
        print(response)
        return jsonify(response, sesion)

    except cx_Oracle.Error as error:
        print("Error al conectar a Oracle: ", error)
        return jsonify({'message': 'Error al conectar a la base de datos'})
    
def get_all_products():
    # Lógica para obtener todos los productos de la base de datos
    ...

def get_product(product_id):
    # Lógica para obtener un producto específico de la base de datos
    ...

def create_product(product_data):
    # Lógica para crear un nuevo producto en la base de datos
    ...

def update_product(product_id, product_data):
    # Lógica para actualizar un producto existente en la base de datos
    ...

def delete_product(product_id):
    # Lógica para eliminar un producto existente de la base de datos
    ...
