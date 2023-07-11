from flask import Flask
from productos.routes import productos_bp
from usuarios.routes import usuarios_bp
from subastas.routes import subastas_bp
from ofertas.routes import ofertas_bp
from flask_cors import CORS
from productos.operations import get_all_productos
from subastas.operations import create_subasta
from subastas.operations import get_all_subastas
import cx_Oracle
import random
import threading
import time
import signal
import os

app = Flask(__name__)
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

    print(
        f"La subasta por el producto: {producto['NOMBRE_PRO']} se ha terminado terminado")
    # threading.current_thread()._stop()
    # Aquí puedes realizar alguna acción adicional cuando el tiempo del producto se agote


@app.route('/api/obtenerSubastas')
def obtener_subastas():
    return subastas


if __name__ == '__main__':
    with app.app_context():
        productos = get_all_productos()

        threads = []
        count = 0
        for producto in productos:
            create_subasta(producto)
            print(count)

        subastas = get_all_subastas()
        for subasta in subastas:
            subasta['tiempo'] = generarTiempoAleatorio()
            print(subasta)
            t = threading.Thread(target=restar_un_segundo, args=(subasta,))
            threads.append(t)
            t.daemon = True
            t.start()

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
    app.run(debug=True)
