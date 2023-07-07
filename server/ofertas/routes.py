from flask import Blueprint, request
from ofertas.operations import hacer_oferta

ofertas_bp = Blueprint('ofertas', __name__)

@ofertas_bp.route('/api/hacerOferta', methods=['POST'])
def obtener_datos():
    return hacer_oferta(request.json)
    ...
