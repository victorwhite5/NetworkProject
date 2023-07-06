from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#usuarios API route

@app.route('/usuarios')
def usuarios():
    return {'usuarios': ['usuario1', 'usuario2', 'usuario3']}

if __name__ == '__main__':
    app.run(debug=True)