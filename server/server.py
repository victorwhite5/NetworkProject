from flask import Flask
from flask_cors import CORS
import random
import threading
import time
import signal
import os

app = Flask(__name__)
CORS(app)

def generarTiempoAleatorio():
    minuto = random.randint(1, 4)
    segundos = random.randint(0, 59)
    return f"00:{minuto:02}:{segundos:02}"


productos = [
    {
      'nombre': 'Casco de Ayrton Senna 1994',
      'id': 1,
      'precio_base': 50,
      'porcentaje' : 0.10,
      'tiempo' : generarTiempoAleatorio(),
      'terminado' : False,
    },
    {
      'nombre': 'Franela del Pelusa Mexico 1986',
      'id': 2,
      'precio_base': 100,
      'porcentaje' : 0.20,
      'tiempo' : generarTiempoAleatorio(),
      'terminado' : False,
    },
    {
      'nombre': 'Bota de Oro 2013 Cristiano Ronaldo',
      'id': 3,
      'precio_base': 80,
      'porcentaje' : 0.05,
      'tiempo' : generarTiempoAleatorio(),
      'terminado' : False,
    },
    {
      'nombre': 'Jersey de Jordan Nro.12',
      'id': 4,
      'precio_base': 120,
      'porcentaje' : 0.15,
      'tiempo' : generarTiempoAleatorio(),
      'terminado' : False,
    },
    {
      'nombre': 'Traje de Lewis Hamilton 2020',
      'id': 5,
      'precio_base': 40,
      'porcentaje' : 0.30,
      'tiempo' : generarTiempoAleatorio(),
      'terminado' : False,
    }
]


def restar_segundo(tiempo):
    horas, minutos, segundos = tiempo.split(':')
    total_segundos = int(horas) * 3600 + int(minutos) * 60 + int(segundos) - 1
    nueva_hora = total_segundos // 3600
    nuevo_minuto = (total_segundos % 3600) // 60
    nuevo_segundo = total_segundos % 60
    return f"{nueva_hora:02}:{nuevo_minuto:02}:{nuevo_segundo:02}"

def restar_un_segundo(producto):
    while producto['tiempo'] != '00:00:00':
        #print(f"Producto: {producto['nombre']} Tiempo: {producto['tiempo']}")
        if producto['tiempo'] == '00:01:00':
            print(f"A la subasta por el producto: {producto['nombre']} le queda 1 minuto!")
        time.sleep(1)
        producto['tiempo'] = restar_segundo(producto['tiempo'])

    print(f"La subasta por el producto: {producto['nombre']} se ha terminado terminado")
    # threading.current_thread()._stop()
    # Aquí puedes realizar alguna acción adicional cuando el tiempo del producto se agote


@app.route('/productos')
def obtener_productos():    
    return {'productos': productos}



if __name__ == '__main__':

    threads = []

    for producto in productos:
        t = threading.Thread(target=restar_un_segundo, args=(producto,))
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
        #sys.exit(0)
        os._exit(0)

    #signal.signal(signal.SIGINT, detenerHilos)
    signal.signal(signal.SIGINT, lambda signal, frame: detenerHilos(signal, frame, threads))

    # Iniciar la aplicación Flask
    app.run(debug=True)