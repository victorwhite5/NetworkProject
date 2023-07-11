from flask import jsonify
import cx_Oracle
import io
from PIL import Image
import base64


def convertir_a_json(cursor, rows):
    results = []
    columns = [d[0] for d in cursor.description]
    for row in rows:
        row_data = []
        for value in row:
            if isinstance(value, cx_Oracle.LOB):
                # Si el valor es un LOB, conviértelo a una cadena de texto en base64
                lob_data = value.read()
                lob_base64 = base64.b64encode(lob_data).decode('utf-8')
                row_data.append(lob_base64)
            else:
                row_data.append(value)
        results.append(dict(zip(columns, row_data)))
    return results


def get_all_productos():
    # Establecer la conexión
    username = 'C##REDES'  # Nombre de usuario de la base de datos
    password = 'REDES'  # Contraseña del usuario
    host = 'localhost'
    port = 1522
    service_name = 'XE'

    try:
        # Crear la cadena de conexión
        dsn = cx_Oracle.makedsn(host, port, service_name=service_name)

        # Establecer la conexión
        connection = cx_Oracle.connect(username, password, dsn)
        print("Conexión con Oracle establecida")

        # Crear el cursor
        cursor = connection.cursor()

        # Ejecutar la consulta SQL
        # Se buscan todos los productos
        cursor.execute("SELECT * FROM PRODUCTO")
        rows = cursor.fetchall()  # Se obtienen todos en la variable rows
        productos = convertir_a_json(cursor, rows)

        # Cerrar el cursor
        cursor.close()

        # Cerrar la conexión
        connection.close()
        # Se mandan al frontend
        return productos

    except cx_Oracle.Error as error:
        print("Error al conectar a Oracle: ", error)
        return jsonify({'message': 'Error al conectar a la base de datos'})
    ...


def get_producto(product_id):
    # Lógica para obtener un producto específico de la base de datos
    ...


def create_producto(product_data):
    # Lógica para crear un nuevo producto en la base de datos
    ...


def update_producto(product_id, product_data):
    # Lógica para actualizar un producto existente en la base de datos
    ...


def delete_producto(product_id):
    # Lógica para eliminar un producto existente de la base de datos
    ...
