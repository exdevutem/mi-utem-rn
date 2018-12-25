const BASE_URL = 'https://api-utem.herokuapp.com/';

export default class ApiUtem {
    getToken = async (correo, contrasenia) => {
        return new Promise(async function(resolve, reject) {
            var respuesta = await fetch(BASE_URL + 'token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: encodeURIComponent('correo') + '=' + encodeURIComponent(correo) + '&' + encodeURIComponent('contrasenia') + '=' + encodeURIComponent(contrasenia)
            }).then(response => response.json());
            resolve(respuesta);
        });   
    }
    
    getPerfil = async (token, rut) => {
        return new Promise(async function(resolve, reject) {
            var respuesta = await fetch(BASE_URL + "estudiantes/" + rut, {
                headers: {
                    Authorization: "Bearer " + token  
                }
            }).then(response => response.json());
            resolve(respuesta);
        });
    }

    getHorarios = async (token, rut) => {
        return new Promise(async function(resolve, reject) {
            var respuesta = await fetch(BASE_URL + "estudiantes/" + rut + "/horarios", {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(response => response.json());
            resolve(respuesta);
        });
    }

    getCarreras = async (token, rut) => {
        return new Promise(async function(resolve, reject) {
            var respuesta = await fetch(BASE_URL + "estudiantes/" + rut + "/carreras", {
                headers: {
                    Authorization: "Bearer " + token  
                }
            }).then(response => response.json());
            resolve(respuesta);
        });
    }
}