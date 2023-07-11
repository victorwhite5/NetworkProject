from flask import jsonify, current_app
import cx_Oracle
import io
from PIL import Image
import base64
import json


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


def create_subasta(producto):
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
        insert_query = "INSERT INTO SUBASTA (precio_base, fecha_inicio, porcentaje_supera, fk_producto) VALUES (:precio_base, SYSDATE, ROUND(DBMS_RANDOM.VALUE * 16 + 5), :cod_pro)"
        cursor.execute(
            insert_query, precio_base=producto["PRECIO_BASE_PRO"], cod_pro=producto["COD_PRO"])
        response = {'message': 'Se crearon nuevas subastas'}

        # Cerrar el cursor
        cursor.close()

        # Cerrar la conexión
        connection.commit()
        connection.close()
        print(response)
        return jsonify(response)

    except cx_Oracle.Error as error:
        print("Error al conectar a Oracle: ", error)
        return jsonify({'message': 'Error al conectar a la base de datos'})
    ...


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
        cursor.execute(
            "select nombre_pro, imagen_pro, cod_sub, precio_base, fecha_inicio, porcentaje_supera from subasta, producto where fk_producto = cod_pro and fecha_fin is null")
        rows = cursor.fetchall()  # Se obtienen todos en la variable rows
        subastas = convertir_a_json(cursor, rows)

        # Cerrar el cursor
        cursor.close()

        # Cerrar la conexión
        connection.close()
        # Se mandan al frontend
        with current_app.app_context():
            return subastas

    except cx_Oracle.Error as error:
        print("Error al conectar a Oracle: ", error)
        return jsonify({'message': 'Error al conectar a la base de datos'})
