from flask import Flask, request
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
    while producto['tiempo'] != '00:00:00':
        # print(f"Producto: {producto['nombre']} Tiempo: {producto['tiempo']}")
        if producto['tiempo'] == '00:01:00':
            print(
                f"A la subasta por el producto: {producto['NOMBRE_PRO']} le queda 1 minuto!")
        time.sleep(1)
        producto['tiempo'] = restar_segundo(producto['tiempo'])
    with app.app_context():
        terminar_subasta(producto)
        print(
            f"La subasta por el producto: {producto['NOMBRE_PRO']} se ha terminado terminado, la ha ganado {producto['ofertante']}, por un monto final de: {producto['monto']}")
    # threading.current_thread()._stop()
    # Aquí puedes realizar alguna acción adicional cuando el tiempo del producto se agote


@socketio.on('connect')
def on_connect():
    print('Client connected')


@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected')


@socketio.on('join_room')
def on_join_room(data):
    room_name = data['room']
    join_room(room_name)
    print(f"Usuario unido a la sala: {room_name}")


@app.route('/api/obtenerSubastas')
def obtener_subastas():
    return subastas


@app.route('/api/obtenerDatosUsuario', methods=['GET'])
def obtener_datos():
    return datos_usuario


@app.route('/api/actualizarDatosSubasta', methods=['POST'])
def actualizar_subasta():
    print('EN ACTUALIZAR SUBASTA')
    print(request.json)
    for subasta in subastas:
        if (subasta['COD_SUB'] == request.json['subasta']):
            print('ENCONTRO LA SUBASTA Y VA A ACTUALIZAR')
            subasta['monto'] = request.json['monto_oferta']
            subasta['ofertante'] = request.json['ofertante']
            print(
                f"La oferta por: {subasta['COD_SUB']} fue realizada por el ofertante {subasta['ofertante']}, por un monto de {subasta['monto']}")
    return datos_usuario


@app.route('/api/hilo_usuario', methods=['POST'])
def crearHilo():
    global datos_usuario
    datos_usuario = request.json
    user_id = request.json['usuario']
    room_name = 'DinhoSubastas'
    socketio.emit('join_room', {'room': room_name})
    response = {'message': 'hilo creado con exito'}
    print(datos_usuario)

    # Crear un hilo para el usuario
    t = threading.Thread(target=funcion_hilo_usuario, args=(user_id,))
    t.daemon = True
    t.start()
    return response


def funcion_hilo_usuario(room_name):
    # Código para el hilo

    # Enviar un mensaje al cliente a través de la sala WebSocket
    socketio.emit('message', 'Hola desde el hilo ', room=room_name)


if __name__ == '__main__':
    with app.app_context():
        productos = get_all_productos()

        threads = []
        count = 0
        for producto in productos:
            create_subasta(producto)

        subastas = get_all_subastas()
        for subasta in subastas:
            subasta['tiempo'] = generarTiempoAleatorio()
            subasta['ofertante'] = None
            subasta['monto'] = subasta["PRECIO_BASE"]
            print(subasta)
            t = threading.Thread(target=restar_un_segundo, args=(subasta,))
            threads.append(t)
            t.daemon = True
            t.start()

            # Crear un hilo para el usuario

        # Agregar un manejador de señales para capturar la señal SIGINT (Ctrl+C)
        def detenerHilos(signal, frame, threads):
            print("Deteniendo hilos secundarios...")
            for thread in threads:
                thread.stop()
            # Salir de la aplicación Flask
            print("Hilos secundarios detenidos. Saliendo...")
            # sys.exit(0)
            os._exit(0)

        # signal.signal(signal.SIGINT, detenerHilos)
        signal.signal(signal.SIGINT, lambda signal,
                      frame: detenerHilos(signal, frame, threads))

    # Iniciar la aplicación Flask
    socketio.run(app, host='192.168.0.127', port=5000)
