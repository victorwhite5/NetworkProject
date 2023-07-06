from flask import Flask
from productos.routes import productos_bp
from usuarios.routes import usuarios_bp
from flask_cors import CORS
import cx_Oracle

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Registrar los blueprints de productos y clientes
app.register_blueprint(productos_bp)
app.register_blueprint(usuarios_bp)

if __name__ == '__main__':
    app.run()
