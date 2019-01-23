import {AsyncStorage} from 'react-native';

const BASE_URL = 'https://api-utem.herokuapp.com/';

export default class ApiUtem {
    getToken = (correo, contrasenia) => {
        return new Promise(async (resolve, reject) => {
            fetch(BASE_URL + 'token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: encodeURIComponent('correo') + '=' + encodeURIComponent(correo) + '&' + encodeURIComponent('contrasenia') + '=' + encodeURIComponent(contrasenia)
            }).then(async (response) => {
                var json = await response.json();
                if (response.ok) {
                    await AsyncStorage.setItem('token', json.token);
                    await AsyncStorage.setItem('rut', json.rut.toString());
                    await AsyncStorage.setItem('correo', json.correo);
                    resolve(json);
                } else {
                    reject(json);
                }
            }).catch(err => {
                reject(err);
                
            });
        });
    }
    
    checkToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await AsyncStorage.getItem('token', (err) => {
                    if (err) reject(err);
                });

                if (token) {
                    fetch(BASE_URL + 'token/placebo', {
                        headers: {
                            Authorization: "Bearer " + token  
                        }
                    }).then(async (response) => {
                        var json = await response.json();
                        
                        if (response.ok) {
                            resolve(json);
                        } else {
                            reject(json);
                        }
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    reject("No se puedo obtener la token")
                }
                
                
            } catch (e) {
                reject(e)
            }
        });
    }

    refreshToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await AsyncStorage.getItem('token');
                fetch(BASE_URL + 'token/refresh', {
                    headers: {
                        Authorization: "Bearer " + token  
                    }
                }).then(async (response) => {
                    var json = await response.json();
                    if (response.ok) {
                        await AsyncStorage.setItem('token', json.token);
                        await AsyncStorage.setItem('rut', json.rut.toString());
                        await AsyncStorage.setItem('correo', json.correo);
                        resolve(json);
                    } else {
                        reject(json);
                    }
                }).catch(err => {
                    reject(err);
                });
            } catch (e) {
                reject(e)
            }
        });
    }

    get = (uri, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            
            if (comprobar) {
                const { esValido } = await this.checkToken(token);
                if (esValido) {
                    fetch(BASE_URL + uri, {
                        headers: {
                            Authorization: "Bearer " + token  
                        },
                        timeout: 60 * 1000
                    }).then(async (response) => {
                        var json = await response.json();
                        if (response.ok) {
                            resolve(json);
                        } else {
                            reject(json);
                        }
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    try {
                        await this.refreshToken();
                        const json = await this.get(uri, false);
                        resolve(json);
                    } catch (error) {
                        reject("La token ya no es válida");
                    }
                }
            } else {
                fetch(BASE_URL + uri, {
                    headers: {
                        Authorization: "Bearer " + token  
                    },
                    timeout: 60 * 1000
                }).then(async (response) => {
                    var json = await response.json();
                    if (response.ok) {
                        resolve(json);
                    } else {
                        reject(json);
                    }
                }).catch(err => {
                    reject(err);
                });
            }
        });
    }

    getAsignaturas = (rut, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const uri = "estudiantes/" + rut + "/asignaturas";
            
            if (comprobar == null)
                comprobar = true;
            
            try {
                const asignaturas = await this.get(uri, comprobar)
                resolve(asignaturas)
            } catch (err) {
                reject(err)
            }
        });
    }

    getPerfil = (rut, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const uri = "estudiantes/" + rut;
            
            if (comprobar == null)
                comprobar = true;
            
            try {
                const perfil = await this.get(uri, comprobar)
                resolve(perfil)
            } catch (err) {
                reject(err)
            }
        });
    }

    getHorarios = (rut, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const uri = "estudiantes/" + rut + "/horarios";
            
            if (comprobar == null)
                comprobar = true;
            
            try {
                const horarios = await this.get(uri, comprobar)
                resolve(horarios)
            } catch (err) {
                reject(err)
            }
        });
    }

    getCarreras = (rut, id, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const uri = "estudiantes/" + rut + "/carreras/" + (id ? id : '');
            
            if (comprobar == null)
                comprobar = true;
            
            try {
                const carreras = await this.get(uri, comprobar)
                resolve(carreras)
            } catch (err) {
                reject(err)
            }
        });
    }

    getMalla = (rut, id, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const uri = "estudiantes/" + rut + "/carreras/" + id + "/malla";
            
            if (comprobar == null)
                comprobar = true;
            
            try {
                const malla = await this.get(uri, comprobar)
                resolve(malla)
            } catch (err) {
                reject(err)
            }
        });
    }

    getBoletin = (rut, id, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const uri = "estudiantes/" + rut + "/carreras/" + carreraId + "/boletin";
            
            if (comprobar == null)
                comprobar = true;
            
            try {
                const boletin = await this.get(uri, comprobar)
                resolve(boletin)
            } catch (err) {
                reject(err)
            }
        });
    }

    getNotas = (rut, id, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const uri = "estudiantes/" + rut + "/asignaturas/" + id + "/notas";
            
            if (comprobar == null)
                comprobar = true;
            
            try {
                const notas = await this.get(uri, comprobar)
                resolve(notas)
            } catch (err) {
                reject(err)
            }
        });
    }

    getBitacora = (rut, id, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const uri = "estudiantes/" + rut + "/asignaturas/" + id + "/bitacora";
            
            if (comprobar == null)
                comprobar = true;
            
            try {
                const bitacora = await this.get(uri, comprobar)
                resolve(bitacora)
            } catch (err) {
                reject(err)
            }
        });
    }

    getCalificaciones = (rut, id, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const uri = "docentes/" + rut + "/calificaciones/" + (id ? id : '');
            
            if (comprobar == null)
                comprobar = true;
            
            try {
                const calificaciones = await this.get(uri, comprobar)
                resolve(calificaciones)
            } catch (err) {
                reject(err)
            }
        });
    }

    getPrincipales = (rut) => {
        return new Promise(async (resolve, reject) => {
            const { esValido } = await this.checkToken();
            if (esValido) {
                var promesas = [this.getPerfil(rut, false),
                            this.getHorarios(rut, false),
                            this.getCarreras(rut, false),
                            this.getAsignaturas(rut, false)]

                Promise.all(promesas).then(respuestas => {
                    resolve(respuestas);
                });
            } else {
                reject("La token no es valida")
            }
        })
    }
}