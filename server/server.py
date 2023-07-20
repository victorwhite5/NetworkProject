from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
from productos.routes import productos_bp
from usuarios.routes import usuarios_bp
from subastas.routes import subastas_bp
from ofertas.routes import ofertas_bp
from flask_cors import CORS
from productos.operations import get_all_productos
from subastas.operations import create_subasta
from subastas.operations import get_all_subastas
from usuarios.operations import handle_client
from subastas.operations import terminar_subasta
import cx_Oracle
import random
import threading
import time
import signal
import os
import socket

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Registrar los blueprints de productos y clientes
app.register_blueprint(productos_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(subastas_bp)
app.register_blueprint(ofertas_bp)


def generarTiempoAleatorio():
    minuto = random.randint(1, 4)
    segundos = random.randint(0, 59)
    return f"00:{minuto:02}:{segundos:02}"


def restar_segundo(tiempo):
    horas, minutos, segundos = tiempo.split(':')
    total_segundos = int(horas) * 3600 + int(minutos) * 60 + int(segundos) - 1
    nueva_hora = total_segundos // 3600
    nuevo_minuto = (total_segundos % 3600) // 60
    nuevo_segundo = total_segundos % 60
    return f"{nueva_hora:02}:{nuevo_minuto:02}:{nuevo_segundo:02}"


def restar_un_segundo(producto):
    global mi_subasta
    while not inicio:
        time.sleep(1)
    mi_subasta = producto
    print('Empezó la subasta')
    while producto['tiempo'] != '00:00:00':
        time.sleep(1)
        producto['tiempo'] = restar_segundo(producto['tiempo'])
    with app.app_context():
        terminar_subasta(producto)
        print(
            f"La subasta por el producto: {producto['NOMBRE_PRO']} se ha terminado terminado, la ha ganado {producto['ofertante']}, por un monto final de: {producto['monto']}")
    # threading.current_thread()._stop()
    # Aquí puedes realizar alguna acción adicional cuando el tiempo del producto se agote


@app.route('/api/obtenerSubastas')
def obtener_subastas():
    return subastas


@app.route('/api/actualizarDatosSubasta', methods=['POST'])
def actualizar_subasta():
    # print(request.json)
    # print(mi_usuario)
    # print(mi_subasta)
    for subasta in subastas:
        if (subasta['COD_SUB'] == request.json['subasta']):
            subasta['monto'] = request.json['monto_oferta']
            subasta['ofertante'] = request.json['ofertante']
            print(
                f">S Producto: {subasta['NOMBRE_PRO']}, reicibio una oferta por: {subasta['monto']}, por: {mi_usuario['cod']} = {request.json['ofertante']}")
    return


inicio = False


@app.route('/api/inicio', methods=['POST'])
def actualizar_inicio():
    print('llegó a inicio')
    global inicio
    inicio = True
    return inicio


def handle_client(client_socket, client_address, cod, nombre, usuario, cartera, ip):
    try:
        # Implementa aquí la lógica para manejar las solicitudes del cliente
        print('Este es el hilo de: ', nombre)
        print('los datos de: ', nombre, 'son: ', cod, usuario, cartera, ip)

        local_ip, local_port = client_socket.getsockname()
        print(
            f"El cliente está recibiendo datos en el puerto local {local_port}")

        # Recibir y procesar los datos del cliente
        while True:
            hilos_activos = threading.enumerate()
            for hilo in hilos_activos:
                print(f"Nombre: {hilo.name}")
            print('salio del for')
            data = client_socket.recv(1024)
            print('paso el data')
            if not data:
                print('Se cerró la conexión')
                break
            print('pasó el IF')

            # Procesar los datos recibidos del cliente, si es necesario

            # Enviar una respuesta al cliente (opcional)
            # client_socket.send(b"Mensaje recibido")
        print('salió del while true')
    except Exception as e:
        print(
            f"Error al manejar cliente {client_address[0]}:{client_address[1]}", e)
    finally:
        # Cerrar la conexión con el cliente
        print('desconectó el hilo')
        client_socket.close()


@app.route('/api/obtenerDatosUsuario', methods=['GET'])
def obtener_datos():
    return datos_usuario


@socketio.on('connect')
def test_connect():
    emit('conectado')


@socketio.on('disconnect')
def test_disconnect():
    emit('client disconnected')


@socketio.on('message')
def test_data(data):
    emit(data)


@app.route('/api/hilo_usuario', methods=['POST'])
def handle_hilo_usuario():
    try:
        data = request.get_json()
        global datos_usuario
        datos_usuario = data
        cod = data['cod']
        nombre = data['nombre']
        usuario = data['usuario']
        cartera = data['cartera']
        ip = data['ip']
        # Crear un socket para manejar la conexión del cliente
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # Reemplaza el puerto (12345) con el puerto correcto para tu servidor
        client_socket.connect(('192.168.0.127', 5000))
        # Crear un hilo para manejar la conexión del cliente
        client_thread = threading.Thread(
            target=handle_client, name=usuario, args=(client_socket, ip, cod, nombre, usuario, cartera, ip))
        client_thread.start()
        print('Creó el hilo correctamente')
        # Responder al frontend que la solicitud fue recibida correctamente.
        return jsonify({'message': 'Solicitud recibida correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def main():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('192.168.0.127', 5000))
    server_socket.listen(5)

    print("Servidor en espera de conexiones...")


if __name__ == '__main__':
    with app.app_context():
        productos = get_all_productos()

        threads = []
        count = 0
        for producto in productos:
            create_subasta(producto)

        subastas = get_all_subastas()
        for subasta in subastas:
            print('SUBASTA')
            subasta['tiempo'] = generarTiempoAleatorio()
            print('tiempo al crear = ', subasta['tiempo'])
            subasta['ofertante'] = None
            subasta['monto'] = subasta["PRECIO_BASE"]
            global t
            t = threading.Thread(target=restar_un_segundo,
                                 name=subasta['COD_SUB'], args=(subasta,))
            threads.append(t)
            t.start()

            # Crear un hilo para el usuario
    main()

    # Iniciar la aplicación Flask
    socketio.run(app, host='192.168.0.127', port=5000)
