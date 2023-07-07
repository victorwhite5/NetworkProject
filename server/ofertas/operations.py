from flask import jsonify, request
import cx_Oracle
import io
from PIL import Image
import base64

def hacer_oferta(data):
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

        # Se obtienen los datos que ingresó el usuario
        data = request.json
        print(data)

        # Ejecutar la consulta SQL
        insert_query = "INSERT INTO OFERTA (MONTO_OFERTA, fk_subasta, fk_cliente) VALUES (:monto, :subasta, 1)"
        cursor.execute(insert_query, data)
        response = {'message': 'Oferta realizada con éxito'}

        # Cerrar el cursor
        cursor.close()

        # Cerrar la conexión
        connection.close()
        print(response)
        return jsonify(response)

    except cx_Oracle.Error as error:
        print("Error al conectar a Oracle: ", error)
        return jsonify({'message': 'Error al conectar a la base de datos'})