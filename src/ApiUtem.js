const BASE_URL = 'https://api-utem.herokuapp.com/';

export default class ApiUtem {
    getToken = (correo, contrasenia) => {
        return new Promise(async function(resolve, reject) {
            fetch(BASE_URL + 'token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: encodeURIComponent('correo') + '=' + encodeURIComponent(correo) + '&' + encodeURIComponent('contrasenia') + '=' + encodeURIComponent(contrasenia)
            }).then(response => {
                var json = response.json();
                if (response.ok) {
                    resolve(json);
                } else {
                    reject(response);
                }
            }).catch(err => {
                console.log(err);
                reject(err);
                
            });
        });   
    }
    
    getPerfil = (token, rut) => {
        return new Promise(async function(resolve, reject) {
            fetch(BASE_URL + "estudiantes/" + rut, {
                headers: {
                    Authorization: "Bearer " + token  
                }
            }).then(response => {
                var json = response.json();
                resolve(json);
            });
        });
    }

    getHorarios = (token, rut) => {
        return new Promise(async function(resolve, reject) {
            fetch(BASE_URL + "estudiantes/" + rut + "/horarios", {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(response => {
                var json = response.json();
                resolve(json);
            });
            
        });
    }

    getCarreras = async (token, rut) => {
        return new Promise(async function(resolve, reject) {
            fetch(BASE_URL + "estudiantes/" + rut + "/carreras", {
                headers: {
                    Authorization: "Bearer " + token  
                }
            }).then(response => {
                var json = response.json();
                resolve(json);
            });
        });
    }
}