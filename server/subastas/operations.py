from flask import jsonify
import cx_Oracle
import io
from PIL import Image
import base64

def convertir_a_json(cursor, rows):
    results = []
    columns = [d[0] for d in cursor.description]
    print(cursor.description)
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

def get_all_subastas():
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
        # Se buscan todos los subastas
        cursor.execute("select nombre_pro, imagen_pro, cod_sub, precio_base, fecha_inicio, porcentaje_supera from subasta, producto where fk_producto = cod_pro")
        rows = cursor.fetchall()  # Se obtienen todos en la variable rows
        print(rows)
        subastas = convertir_a_json(cursor, rows)
        print(subastas)

        # Cerrar el cursor
        cursor.close()

        # Cerrar la conexión
        connection.close()
        # Se mandan al frontend
        return jsonify(subastas)

    except cx_Oracle.Error as error:
        print("Error al conectar a Oracle: ", error)
        return jsonify({'message': 'Error al conectar a la base de datos'})