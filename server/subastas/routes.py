from flask import Blueprint, jsonify
from subastas.operations import get_all_subastas

subastas_bp = Blueprint('subastas', __name__)


@subastas_bp.route('/api/subastas', methods=['GET'])
def get_subastas():
    subastas = get_all_subastas()
    return jsonify(subastas)
    ...


@subastas_bp.route('/subastas', methods=['POST'])
def create_subasta():
    # Lógica para crear un nuevo subasta
    ...


@subastas_bp.route('/subastas/<subasta_id>', methods=['PUT'])
def update_subasta(subasta_id):
    # Lógica para actualizar un subasta existente
    ...


@subastas_bp.route('/subastas/<subasta_id>', methods=['DELETE'])
def delete_subasta(subasta_id):
    # Lógica para eliminar un subasta existente
    ...
