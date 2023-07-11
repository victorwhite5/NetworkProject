from flask import Blueprint, jsonify
from productos.operations import get_all_productos

productos_bp = Blueprint('productos', __name__)


@productos_bp.route('/api/productos', methods=['GET'])
def get_productos():
    productos = get_all_productos()
    return jsonify(productos)
    ...


@productos_bp.route('/productos', methods=['POST'])
def create_producto():
    # Lógica para crear un nuevo producto
    ...


@productos_bp.route('/productos/<product_id>', methods=['PUT'])
def update_producto(product_id):
    # Lógica para actualizar un producto existente
    ...


@productos_bp.route('/productos/<product_id>', methods=['DELETE'])
def delete_producto(product_id):
    # Lógica para eliminar un producto existente
    ...
