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

    getPerfil = (rut, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            const uri = "estudiantes/" + rut;
            if (comprobar) {
                const { esValido } = await this.checkToken(token);
                if (esValido) {
                    fetch(BASE_URL + uri, {
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
                    try {
                        await this.refreshToken();
                        const perfil = await this.getPerfil(rut, false);
                        resolve(perfil);
                    } catch (error) {
                        reject("La token ya no es válida");
                    }
                }
            } else {
                fetch(BASE_URL + uri, {
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
            }
            
            
        });
    }

    getHorarios = (rut, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            const uri = "estudiantes/" + rut + "/horarios";
            if (comprobar) {
                const { esValido } = await this.checkToken(token);
                if (esValido) {
                    fetch(BASE_URL + uri, {
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
                    try {
                        await this.refreshToken();
                        const horarios = await this.getHorarios(rut, false);
                        resolve(horarios);
                    } catch (error) {
                        reject("La token ya no es válida");
                    }
                }
            } else {
                fetch(BASE_URL + uri, {
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
            }
            
            
        });
    }

    getCarreras = (rut, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            const uri = "estudiantes/" + rut + "/carreras";
            if (comprobar) {
                const { esValido } = await this.checkToken(token);
                if (esValido) {
                    fetch(BASE_URL + uri, {
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
                    try {
                        await this.refreshToken();
                        const carreras = await this.getCarreras(rut, false);
                        resolve(carreras);
                    } catch (error) {
                        reject("La token ya no es válida");
                    }
                }
            } else {
                fetch(BASE_URL + uri, {
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
            }
            
            
        });
    }

    getMalla = (rut, carreraId, comprobar) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            const uri = "estudiantes/" + rut + "/carreras/" + carreraId + "/malla";
            if (comprobar) {
                const { esValido } = await this.checkToken(token);
                if (esValido) {
                    fetch(BASE_URL + uri, {
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
                    try {
                        await this.refreshToken();
                        const malla = await this.getMalla(rut, carreraId, false);
                        resolve(malla);
                    } catch (error) {
                        reject("La token ya no es válida");
                    }
                }
            } else {
                fetch(BASE_URL + uri, {
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
            }
            
            
        });
    }

    getPrincipales = (rut) => {
        return new Promise(async (resolve, reject) => {
            const { esValido } = await this.checkToken();
            if (esValido) {
                var promesas = [this.getPerfil(rut, false),
                            this.getHorarios(rut, false),
                            this.getCarreras(rut, false)]

                Promise.all(promesas).then(respuestas => {
                    resolve(respuestas);
                });
            } else {
                reject("La token no es valida")
            }
        })
    }

    /*
    getHorarios = (rut) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            fetch(BASE_URL + "estudiantes/" + rut + "/horarios", {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(response => {
                var json = response.json();
                if (response.ok) {
                    resolve(json);
                } else {
                    reject(json);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    getCarreras = async (rut) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            fetch(BASE_URL + "estudiantes/" + rut + "/carreras", {
                headers: {
                    Authorization: "Bearer " + token  
                }
            }).then(response => {
                var json = response.json();
                if (response.ok) {
                    resolve(json);
                } else {
                    reject(json);
                }
            }).catch(err => {
                reject(err);
            });
        });
    } */
}

/*
import { AsyncStorage } from 'react-native';

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
            }).then(response => {
                var json = response.json();
                if (response.ok) {
                    await AsyncStorage.multiSet(['token', 'rut', 'correo'], [response.token, response.rut.toString(), response.correo]);
                    resolve(json);
                } else {
                    reject(response);
                }
            }).catch(err => {
                reject(err);
                
            });
        });   
    }

    checkToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await AsyncStorage.getItem('token');
                fetch(BASE_URL + 'token/placebo', {
                    headers: {
                        Authorization: "Bearer " + token  
                    }
                }).then(response => {
                    var json = response.json();
                    if (response.ok) {
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

    refreshToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await AsyncStorage.getItem('token');
                fetch(BASE_URL + 'token/refresh', {
                    headers: {
                        Authorization: "Bearer " + token  
                    }
                }).then(response => {
                    var json = response.json();
                    if (response.ok) {
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

    getPerfil = (rut) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            const respuesta = await checkToken(token);
            const esValido = respuesta.esValido;
            if (esValido) {
                fetch(BASE_URL + "estudiantes/" + rut, {
                    headers: {
                        Authorization: "Bearer " + token  
                    }
                }).then(response => {
                    var json = response.json();
                    if (response.ok) {
                        resolve(json);
                    } else {
                        reject(json);
                    }
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject("La token no es válida")
            }
        });
    }

    getHorarios = (rut) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            fetch(BASE_URL + "estudiantes/" + rut + "/horarios", {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(response => {
                var json = response.json();
                if (response.ok) {
                    resolve(json);
                } else {
                    reject(json);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    getCarreras = async (rut) => {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem('token');
            fetch(BASE_URL + "estudiantes/" + rut + "/carreras", {
                headers: {
                    Authorization: "Bearer " + token  
                }
            }).then(response => {
                var json = response.json();
                if (response.ok) {
                    resolve(json);
                } else {
                    reject(json);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
}

*/