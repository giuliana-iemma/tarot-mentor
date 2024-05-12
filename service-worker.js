//PRECACHING
const cacheTarot = 'Tarot Mentor'

//Creo un array con todas las páginas que quiero que se guarden en el caché. Son las necesarias para poder cargar la index de la web.
const cacheAssets = [
                        'index.html',
                        'styles.css',
                        'img/icon-03.png',
                        'img/icon-04.png',
                        'img/icon-05.png',
                        'img/bola-magica-white.png',
                        'scripts/main.js',
                         'views/404.html' 
]

//EVENTOS DEL SW

//INSTALACIÓN
self.addEventListener ('install', function (event){
    //Evito el período de espera del navegador 
    self.skipWaiting ();

    console.log('Service Worker instalado', event);

    event.waitUntil (
        //Precaching: Almaceno en caché los elementos del array cacheAssets
        caches.open (cacheTarot)
            .then (function (cacheObject) //Si existe un caché, se abre. Si no existe, se crea.
            {
                cacheObject.addAll (cacheAssets); //Agrego los elementos de cacheAssets al objeto caché.
            }
        )
    )
});

//ACTIVACIÓN
self.addEventListener ('activate', function(event){
    console.log ('El SW se activó correctamente', event);
});

//CACHÉ DINÁMICO
//Escucho las peticiones de la interfaz
self.addEventListener ('fetch', event => {
    //Construyo una respuesta para esa petición
    event.respondWith (
        caches  
            .match (event.request) //Verifico si está en el cache
           
            .then (respuesta  =>{
                if (respuesta ) { //Si está en el cache, retorno esa respuesta
                    return respuesta;
                }

                let requestToCache = event.request.clone(); 
                
                return fetch(requestToCache)
                //Devuelve una promesa que representa la respuesta de la solicitud de red hecha a requesToCache
                    .then (response =>{
                        if(!response || response.status !==200) {
                            //No hay respuesta o falla la solicitud
                            if (requestToCache.destination === 'image'){
                                //Si ese request que falla es de una imagen, devolvemos una imagen provisoria
                               // return new response ('Not found', { status: 404 });
                               return fetch('http://localhost/PWA/parcial/img/card.png')
                           
                                .then (placeholderImage =>{
                                    return placeholderImage;
                                    });
                            } else {
                                //Si es una página que no está pudiendo alcanzar, le mostramos una página de error
                                return fetch ('http://localhost/PWA/parcial/views/404.html')
                                    .then (err => {
                                        return err;
                                    });
                            }                          
                        }

                        //Revisamos cuál es el método de petición
                        if (requestToCache.method == 'GET'){
                            let responseToCache = response.clone();

                            caches.open (cacheTarot)  //abrimos el cache de "caches"
                            .then ((cache)=>{
                                cache.put (requestToCache, responseToCache); //Método put añade respuesta en cache
                            });
                        }
                        return response;
                    })

                    .catch (err => {
                        if (requestToCache.destination === 'image'){
                            return fetch ('http://localhost/PWA/parcial/img/card.png')
                            .then (placeholderImage =>{
                                return placeholderImage
                            });
                        } else {
                            return (fetch ('http://localhost/PWA/parcial/views/404.html')
                            .then (err => {
                                return err;
                            }));
                        }
                    });
            })
    );
});
