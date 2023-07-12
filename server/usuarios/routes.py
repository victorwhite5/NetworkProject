from flask import Blueprint, request
from usuarios.operations import get_usuarios


usuarios_bp = Blueprint('usuarios', __name__)

# @usuarios_bp.route('/usuarios', methods=['GET'])
# def get_usuarios():
#     # Lógica para obtener y retornar los usuarios
#     ...

@usuarios_bp.route('/crearUsuario', methods=['POST'])
def create_usuario():
    # Lógica para crear un nuevo usuario
    ...

@usuarios_bp.route('/usuarios/<usuario_id>', methods=['PUT'])
def update_usuario(usuario_id):
    # Lógica para actualizar un usuario existente
    ...

@usuarios_bp.route('/usuarios/<usuario_id>', methods=['DELETE'])
def delete_usuario(usuario_id):
    # Lógica para eliminar un usuario existente
    ...

@usuarios_bp.route('/api/datosUsuario', methods=['POST'])
def obtener_datos():
    return get_usuarios(request.json)
    ...