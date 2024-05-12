//REGISTRO DEL SERVICE WORKER
if ('serviceWorker' in navigator){
    window.addEventListener ('load', function(){
        navigator.serviceWorker.register('service-worker.js')
            .then(function(registration) {
                console.log('El registro del ServiceWorker fue exitoso, tiene el siguiente alcance: ', registration.scope);
            }).catch(function(error){
                console.log('El registro del ServiceWorker falló: ', error);
            });
    });
}

//GLOBALES
const d = document;
let cards = [];
let btnLearn = document.querySelector ("#learn button");
let btnTest = document.querySelector ("#test button");
let btnCollection = document.querySelector ("#collection button");
let main =document.querySelector('main');
let categorias = d.getElementById ('categorias');
let banner = d.querySelector ('header div');
let respuestaCorrecta;
let siguienteClicked= true;
let puntaje = 0;
let cartaSeleccionada = [];



btnLearn.addEventListener ('click', obtainCards);
btnTest.addEventListener ('click', obtainAleatoryCard)

function obtainCards (data){
    categorias.className = 'ocultar';
    banner.className = 'ocultar';

    const xhr = new XMLHttpRequest ();

    xhr.open('GET', 'api/tarot-cards.json');

    xhr.addEventListener ('readystatechange', function(){
        if(xhr.readyState === 4){
            console.log('Open achieved');

            if (xhr.status===200){
                console.log('Open succesful');

                //Convierto la cadena JSON a objeto
                const result = JSON.parse (xhr.responseText);

                //Accedo al array cards dentro del objeto result 
                const arrayCards = result.cards;            

               // Genero una card para cada carta con la función showCards
                showCards (arrayCards);
                

            }
        } 
    })

    xhr.send(null);
}

function showCards (arrayCards)
{
    let section = d.createElement ('section');
    section.id = 'learn-cards';
                
    let h2 = d.createElement ('h2');
    h2.innerText = 'Learn all the cards'
        section.appendChild (h2);

    let p = d.createElement ('p');
    p.innerText = 'Here you will find information about all the cards. Click on each one to learn more about it.';
        section.appendChild (p);

    let btnBack = d.createElement ('button');
    btnBack.innerText = 'Volver al inicio';
        section.appendChild (btnBack);

    btnBack.addEventListener ('click', ()=>{
        section.remove();
        banner.removeAttribute ('class');
        categorias.removeAttribute ('class');
    });

    //Armo un contenedor para ir guardando los articles con las cards
    let containerCards =d.createElement ('div');
    containerCards.className = 'containerCards'
                   
        for (let card of arrayCards){
            let article = d.createElement ('article');
            article.class = 'card';

            article.addEventListener ('click', ()=>{
                //Creo una modal donde se muestra la información detallada de la carta con la función modalCard ()
                modalCard(card);
            })
                    
            let h3 = d.createElement ('h3');
            h3.innerText = card.name;
                article.appendChild (h3);

            let img = d.createElement ('img');
            img.src = `img/cards/${card.img}`;
                article.appendChild (img);

            let divInfo = d.createElement ('div');
            divInfo.class = 'info-card';

            let pArcana = d.createElement ('p');
            let spanArcana = d.createElement ('span');
            pArcana.appendChild (spanArcana);
            spanArcana.innerText = 'Arcana: '
            pArcana.innerText += card.arcana;
                divInfo.appendChild (pArcana);

            if (arrayCards.Elemental){
            let pElemental = d.createElement ('p');
            let spanElemental = d.createElement ('span');
            pElemental.appendChild (spanElemental);
            spanElemental.innerText = 'Elemental: '
            pElemental.innerText += card.Elemental;
                divInfo.appendChild (pElemental);
            }
            
            if (arrayCards.Astrology){
                let pAstrology = d.createElement ('p');
                let spanAstrology = d.createElement ('span');
                pAstrology.appendChild (spanAstrology);
                spanAstrology.innerText = 'Astrology: '
                pAstrology.innerText += card.Astrology;
                    divInfo.appendChild (pAstrology);
            }
                                    
                article.appendChild (divInfo);
                containerCards.appendChild (article);
        }
                
    section.appendChild (containerCards);
    //containerSection.appendChild (section);
    main.appendChild (section);
}

function modalCard (cardArray)
{
    let title = d.querySelectorAll ('#learn-cards article h3');

    if (title = cardArray.name){
        let containerCard = d.createElement ('div');
        containerCard.className = 'modal';

        let containerCardDetail = d.createElement ('div');

        let btnCerrar = d.createElement ('button');
        btnCerrar.innerText = 'X';
        btnCerrar.addEventListener ('click',()=>{
            containerCard.remove ();
        });
        containerCard.appendChild (btnCerrar);


        let h3 = d.createElement ('h3');
        h3.innerText = cardArray.name;
        containerCardDetail.appendChild (h3);

        let img = d.createElement ('img');
        img.src = `img/cards/${cardArray.img}`;
        containerCardDetail.appendChild (img);

        let listMeaningsLight = d.createElement ('ul');    
        for (let meaning of cardArray.meanings.light){
            let liMeaning = d.createElement ('li');
            liMeaning.innerText = meaning;

            listMeaningsLight.appendChild (liMeaning);
        }
        containerCardDetail.appendChild (listMeaningsLight);

        let listMeaningsShadow = d.createElement ('ul');
        for (let meaning of cardArray.meanings.shadow){
            let liMeaning = d.createElement ('li');
            liMeaning.innerText = meaning;

            listMeaningsShadow.appendChild (liMeaning);
        }
        containerCardDetail.appendChild (listMeaningsShadow);
        
        containerCard.appendChild (containerCardDetail);
        main.appendChild (containerCard);
    }
}

function obtainAleatoryCard (){
    //Oculto banner e y página principal
    categorias.className = 'ocultar';
    banner.className = 'ocultar';

    const xhr = new XMLHttpRequest ();
    console.log(xhr);

    xhr.open('GET', 'api/tarot-cards.json');
    console.log(xhr);

    xhr.addEventListener ('readystatechange', function(){
        if(xhr.readyState === 4){
            console.log('Open achieved');

            if (xhr.status===200){
                console.log('Open succesful');

                //Convierto la cadena JSON a objeto
                const result = JSON.parse (xhr.responseText);

                //Accedo al array cards dentro del objeto result 
                const arrayCards = result.cards;    
                
                //Muestro la modal de test
                testLoop (arrayCards);
            }
        } 
    })

    xhr.send(null);
    //Se abre una modal
}

let respuestasCorrectas = 0;
let errores = 0;

function testLoop(cardArray){
    if (siguienteClicked){
        modalTest (cardArray);
     } 


}


function modalTest (cardArray){
    //Muestro una carta con cinco significados aleatorios dentro de los cuales está el correcto
    let containerTest = d.createElement ('div');
    containerTest.className = 'modal';

    let containerTestInfo = d.createElement ('div');
    containerTestInfo.id = "question";
    let meanings = []; //Lista de todos los significados
    let meaningsCorrect = []; //Lista de todas las respuestas correctas
    let options = []; //Lista de las respuestas que se van a mostrar en la pregunta
    let number=1; //A usar en el bucle for para armar los radio button de las opciones


    //Lleno el array meanigns con todos los significados
    for (let card of cardArray){
        for (let meaning of card.meanings.light){
            meanings.push (meaning);
        }

        for (let meaning of card.meanings.shadow){
            meanings.push (meaning);
        }    
    }

    //Obtengo una carta aleatoria y le extraigo los meanings
    let aleatoryCard = obtainRandomNumber(cardArray, 1);


    //Coloco título e imagen en la modal
    for (item of aleatoryCard){
        let img = d.createElement ('img');
        img.src = `./img/cards/${item.img}`
            containerTestInfo.appendChild (img);

        let h2 = d.createElement ('h2');
        h2.innerText = item.name;
            containerTestInfo.appendChild (h2);
    }

    //Agrego los meanings de la carta aleatoria al array meaningsCorrect, osea de meanings correctos
    for (info of aleatoryCard){
        for (item of info.meanings.light){
            meaningsCorrect.push (item);
        }
        for (item of info.meanings.shadow){
            meaningsCorrect.push (item);
        }
    }

    //Obtengo un nuevo array con las respuestas correctas borradas
    let arrayMeaningsTest = obtainInCorrect(meanings, meaningsCorrect);

    //Obtengo 4 respuestas incorrectas
    let randomIncorrectAnswers = obtainRandomNumber (arrayMeaningsTest, 4);

    //Creo la el el container de opciones
    let containerOptions = d.createElement ('div');
    containerOptions.className = 'options';

    //Recorro el array de respuestas incorrectas
    for (answer of randomIncorrectAnswers){
       /*  console.log(answer);
        let li = d.createElement ('li');
        li.innerText = answer;
        containerOptions.appendChild (li); */
        options.push (answer);
    }

    //Obtengo una respuesta correcta y la agrego al array de respuestas
    let correctAnswer = obtainRandomNumber(meaningsCorrect, 1);
    for (item of correctAnswer){
    options.push (item);
    respuestaCorrecta = item
   // console.log('correcta' , respuestaCorrecta);
    }

    let optionsShow = shuffledArray (options);
    

    for (item of optionsShow){
    //Incremento la variable number cada vez que se ingresa al bucle
       // console.log(item);
        let radio = d.createElement ('input');
        radio.type = 'radio';
        radio.value = item;
        radio.name = 'option';
        radio.id = `option${number}`;

        let label = d.createElement ('label');
        label.innerText = item;
        label.htmlFor = `option${number}`;

        containerTestInfo.appendChild (radio);
        containerTestInfo.appendChild (label);

        label.addEventListener ('click', ()=>{
        //    console.log(label.innerText);
       
        })

        number++;
    }

    let buttonNext = d.createElement ('button');
    buttonNext.innerText = 'Siguiente';
    containerTestInfo.appendChild (buttonNext);

    buttonNext.addEventListener ('click', ()=>{
        //Guardo la respuesta en la variable
        let respuestaSeleccionada = d.querySelector ('input[type="radio"]:checked');
       respuestaIngresada= respuestaSeleccionada.value;
       console.log(respuestaIngresada, respuestaCorrecta);

       if (respuestaIngresada === respuestaCorrecta){
        let oldQuestion = d.querySelector ('.modal');
        respuestaIngresada = "";
        respuestaCorrecta = "";
        oldQuestion.remove();
        siguienteClicked = true;
        respuestasCorrectas++;
        console.log(siguienteClicked);
        testLoop (cardArray);
        console.log('great!');
        console.log(respuestasCorrectas);
        } else {
            errores++;
            console.log('try again');
            siguienteClicked = false;
            console.log(errores);
         }

         
    if (errores > 3){
        let modal = d.querySelector ('.modal');
        modal.remove ();
        categorias.className = '';
        banner.className = '';
        respuestasCorrectas = 0;
        errores = 0; 
        console.log('intenta de nuevo');
        respuestaCorrecta = "";
        siguienteClicked = true;
    } else if (respuestasCorrectas > 5){
        console.log('Ganaste una tirada!');
        
    }

    });

    containerTestInfo.appendChild (containerOptions);

    containerTest.appendChild (containerTestInfo);
    main.appendChild (containerTest);
    
    return {errores: errores, cantidadCorrectas : respuestasCorrectas}
}

function obtainRandomNumber (array, amount){
    //Le paso a la función dons parámetros: un array y una cantidad de números aleatorios a obtener.

    //Creo un array para guardar los elementos aletorios que extraiga del array.
    let aleatoryElements = [];

    //Utilizo Set para regitrar los índices que ya han sido seleccionados y evitar que se repitan nuevamente.
    let usedIndexes = new Set();

    
    while (aleatoryElements.length < amount){
        //Mientras que el largode mi array de elementos Aleatorios sea menor a la cantidad de elementos que deseo obtener.

        //Obtengo un número aleatorio entre 0 y el largo de mi array.
        let randomIndex = Math.floor (Math.random () * array.length);

        //Verifico si ya utilice el índice
        if (!usedIndexes.has(randomIndex)){
            //Agrego el elemento al array
            aleatoryElements.push (array[randomIndex]);
            //Registro el índice como utilizado
            usedIndexes.add(randomIndex);
        } 
    }
    return aleatoryElements;
}

function obtainInCorrect (array, arrayCorrect){
     //Copio el array original para no modificarlo directamente. La idea es borrar las respuestas correctas del mismo. El método slice  devuelve en un nuevo array los elementos seleccionadosdel array original.
     const arrayCopied = array.slice();

     //Recorro el array de respuestas correctas
     for (answer of arrayCorrect){
         //Obtengo el index de cada respuesta
         let answerIndex = arrayCopied.indexOf(answer);

        //Remuevo del array copiado las respuestas correctas a través de los índices obtenidos
        let removed = arrayCopied.splice (answerIndex, 1);
     }

    // Retorno este nuevo array
    return arrayCopied;
}

function shuffledArray (array){
    //Copio el array para no modificarlo
    let shuffledArray = array.slice();

    //Algoritmo de Fisher-Yates para mezclar el array
    for (let i = shuffledArray.length - 1; i > 0; i--){
        //Genero un índice aleatorio entre 0 e i
        const aleatoryIndex = Math.floor (Math.random () * (i + 1));

        //Intercambio elementos entre suffledArray[aleatoryIndex] y suffledArray [i]
        [shuffledArray[i], shuffledArray[aleatoryIndex]] = [shuffledArray[aleatoryIndex], shuffledArray[i]];

        return shuffledArray;
    }

}