//Inicializo LocalStorage
cardsCollectionLS ();

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
let correctAnswer;
let siguienteClicked= true;
//let puntaje = 0;
let selectedCard = [];
let newCardsEarned = []; //Array que contendrá la o las nuevas cartas ganadas
let respuestasCorrectas = 0;
let errores = 0;


//BOTON APRENDER CARTAS
btnLearn.addEventListener ('click', obtainCards);

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
    btnBack.innerText = 'Go back';
        section.appendChild (btnBack);

    btnBack.addEventListener ('click', ()=>{
        section.remove();
        banner.removeAttribute ('class');
        categorias.removeAttribute ('class');
    });

    //Armo un contenedor para ir guardando los articles con las cards
    let containerCards =d.createElement ('div');
    containerCards.className = 'containerCards';

                   
        for (let card of arrayCards){
            let article = d.createElement ('article');
            article.class = 'card';

            article.addEventListener ('click', ()=>{
                //Creo una modal donde se muestra la información detallada de la carta con la función modalCard ()
                modalCard(card);
            })
            let divInfo = d.createElement ('div');
            divInfo.class = 'info-card';

            let h3 = d.createElement ('h3');
            h3.innerText = card.name;
            divInfo.appendChild (h3);

            let img = d.createElement ('img');
            img.src = `api/cards/${card.img}`;
            divInfo.appendChild (img);


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
        containerCardDetail.className = 'containerInfo';

        let btnCerrar = d.createElement ('button');
        btnCerrar.innerText = 'X';
        btnCerrar.className = 'btnCerrar'
        btnCerrar.addEventListener ('click',()=>{
            containerCard.remove ();
        });
        containerCardDetail.appendChild (btnCerrar);


        let h3 = d.createElement ('h3');
        h3.innerText = cardArray.name;
        containerCardDetail.appendChild (h3);

        let img = d.createElement ('img');
        img.src = `api/cards/${cardArray.img}`;
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

//BOTON TEST
btnTest.addEventListener ('click', obtainAleatoryCard);

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

function testLoop(cardArray){
   
    if (siguienteClicked){
        modalTest (cardArray);
     } 
 
}

function modalTest (cardArray){
    //Función para mostrar una carta con cinco significados aleatorios dentro de los cuales está el correcto

    //Creo el contenedor modal para la modal del test
    let containerTest = d.createElement ('div');
    containerTest.className = 'modal';

    //Creo el contenedor del test
    let containerTestInfo = d.createElement ('div');
    containerTestInfo.id = "question";

    //Creo un botón que permite abandonar el test
    let btnCerrar = d.createElement ('button');
    btnCerrar.innerText = 'X';
    btnCerrar.className = 'btnCerrar'
    btnCerrar.addEventListener ('click',()=>{
        containerTest.remove ();
        categorias.className = '';
        banner.className = '';
        resetGame ();
    });
        containerTestInfo.appendChild (btnCerrar);

    //Data
    let meanings = []; //Lista de todos los significados
    let meaningsCorrect = []; //Lista de todas las respuestas correctas
    let options = []; //Lista de las respuestas que se van a mostrar en la pregunta
    let number=1; //A usar en el bucle for para armar los radio button de las opciones
    let answersCorrect = []; //Array que va a guardar las respuestas correctas con los significados que ya salieron y que el usuario ya seleccionó y ganó

    //Lleno el array meanings con todos los significados
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

    //Recorro el array de la carta aleatoria y coloco título e imagen en la modal
    for (item of aleatoryCard){
        let img = d.createElement ('img');
        img.src = `./api/cards/${item.img}`
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

    //Obtengo 4 respuestas incorrectas random
    let randomIncorrectAnswers = obtainRandomNumber (arrayMeaningsTest, 4);

    //Recorro el array de respuestas incorrectas y lo guardo en el array de opciones a mostrar
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
    correctAnswer = item
    // console.log('correcta' , correctAnswer);
    }

    let optionsShow = shuffledArray (options);

    //Creo el contenedor de opciones
    let containerOptions = d.createElement ('div');
    containerOptions.className = 'options';

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

        containerOptions.appendChild (radio);
        containerOptions.appendChild (label);
      
        number++;
    }

    let buttonNext = d.createElement ('button');
    buttonNext.innerText = 'Send';
    buttonNext.addEventListener ('click', ()=>{
        //Guardo la respuesta en la variable
        let respuestaSeleccionada = d.querySelector ('input[type="radio"]:checked');
        respuestaIngresada = respuestaSeleccionada.value;
      //  console.log(respuestaIngresada, correctAnswer);

    if (respuestaIngresada === correctAnswer){   
         //Borro las opciones viejas
        // containerOptions.textContent = '';
        //let oldQuestion = d.querySelector ('.modal');
        //oldQuestion.remove();

        //Borro la respuesta ingresada 
        respuestaIngresada = "";
       
        //obtengo el indice de la respuesta correcta en el array
        let indexCorrectAnswer = meaningsCorrect.indexOf (correctAnswer);
        //console.log(indexCorrectAnswer);
        //console.log('correct answer', correctAnswer);

        //Borro la respuesta correcta del array de respuestas correctas
        meaningsCorrect.splice (indexCorrectAnswer, 1);
        //console.log('nuevo array', meaningsCorrect);

         //Vacío la respuesta correcta
        correctAnswer = "";

        siguienteClicked = true;
        respuestasCorrectas++;
        
       /*  let notif = d.getElementById ('notif');

        if(notif){
            notif.remove();
        } */
        
       // optionsLoop (arrayMeaningsTest, meaningsCorrect, optionsShow, correctAnswer);
       
        } else {
            errores++;
            
            let notif = d.getElementById ('notif');

            if (notif){
                notif.remove();
            }

            let notification = d.createElement ('div');
            notification.id = 'notif';

            let notificationContent = d.createElement ('p');
            notificationContent.innerText = 'Incorrect';

            let numberMistakes = d.createElement ('p');
            numberMistakes.innerText= `Mistakes: ${errores}`;

            notification.appendChild (notificationContent);
            notification.appendChild (numberMistakes);
            containerTestInfo.appendChild (notification);
            console.log('try again');
            siguienteClicked = false;       
        }

        let modal = d.querySelector ('.modal');

        if (errores >= 3){
            modal.remove ();
            resetGame ();
            console.log('intenta de nuevo');

            let containerPrompt = d.createElement ('div');
            containerPrompt.className = 'modal prompt';

            let containerTextPrompt = d.createElement ('div');
            containerTextPrompt.className = 'box';

            let h2 = d.createElement ('h2');
            h2.innerText = 'Vuelve a intentarlo';

            let p = d.createElement ('p');
            p.innerText = 'Has cometido 3 errores. Vuelve a empezar';

            let btnCerrar = d.createElement ('button');
            btnCerrar.innerText = 'X';
            btnCerrar.className = 'btnCerrar'
            btnCerrar.addEventListener ('click',()=>{
                containerPrompt.remove ();
                categorias.className = '';
                banner.className = '';
            });

            containerTextPrompt.appendChild (btnCerrar);
            containerTextPrompt.appendChild (h2);
            containerTextPrompt.appendChild (p);
            containerPrompt.appendChild (containerTextPrompt);
            main.appendChild (containerPrompt);

        } else if (respuestasCorrectas >= 1){
            console.log("Ganaste 1 carta");
            modal.remove ();
            resetGame ();
            //console.log(aleatoryCard);
            let containerPrompt = d.createElement ('div');
            containerPrompt.className = 'modal prompt';

            let containerTextPrompt = d.createElement ('div');
            containerTextPrompt.className = 'box';

            let h2 = d.createElement ('h2');
            h2.innerText = 'Felicitaciones';

            let p = d.createElement ('p');
            p.innerText = 'Has ganado una carta';

            let btnCerrar = d.createElement ('button');
            btnCerrar.innerText = 'X';
            btnCerrar.className = 'btnCerrar'
            btnCerrar.addEventListener ('click',()=>{
                containerPrompt.remove ();
                
            });

            containerTextPrompt.appendChild (btnCerrar);
            containerTextPrompt.appendChild (h2);
            containerTextPrompt.appendChild (p);
            containerPrompt.appendChild (containerTextPrompt);
            main.appendChild (containerPrompt);

            console.log(aleatoryCard.name);
            let cardsCollectionAchieved = JSON.parse(localStorage.getItem('cardsCollection')) || [];
            let cardAppeared = cardsCollectionAchieved.indexOf (aleatoryCard.name);

            if (cardAppeared = -1){
                newCardsEarned.push (aleatoryCard);
                cardsCollectionAdd (newCardsEarned);
            }
        
        // console.log(JSON.parse(localStorage.getItem('cardsCollection')) || []);
           // console.log(newCardsEarned);
            // newCardsEarned = [];
        }
    });

    containerTestInfo.appendChild (containerOptions);
    containerTestInfo.appendChild (buttonNext);

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

function resetGame (){
respuestasCorrectas = 0;
errores = 0; 
correctAnswer = "";
siguienteClicked = true;
selectedCard = [];
categorias.className = '';
banner.className = '';
}

//BOTON COLECCIÓN
btnCollection.addEventListener ('click', seeCollection);

function seeCollection (){

    categorias.className = 'ocultar';
    banner.className = 'ocultar';

    let section = d.createElement ('section');
    section.id = 'cards-collection';

    let h2 = d.createElement ('h2');
    h2.innerText = 'My collection';
    section.appendChild (h2);
    
    let p = d.createElement ('p');
    p.innerText = 'You will find here all the cards that you have already learned.';
    section.appendChild (p);

    let div = d.createElement ('div');
    section.appendChild (div);

    //Obtengo la información de LS y la parseo
    let cardsCollectionLS = JSON.parse(localStorage.getItem('cardsCollection')) || [];
   // console.log('parse' ,cardsCollectionLS);

    for (let item of cardsCollectionLS){
        console.log('item', item[0]);
        
        let card = d.createElement ('article');

        let h3 = d.createElement ('h3');
        h3.innerText = item[0].name;
        card.appendChild (h3);

        let img = d.createElement ('img');
        img.src = `./api/cards/${item[0].img}`;
        card.appendChild (img);

        div.appendChild (card);

    }
    main.appendChild (section);
}

function cardsCollectionLS (){
    //Guardo el array de colección en Local Storage
    if (!localStorage.getItem ('cardsCollection')){
        const cardsCollectionStart = [];
        localStorage.setItem('cardsCollection', JSON.stringify(cardsCollectionStart));
        console.log('LS inicializado');
    } else {
        console.log('Ls ya estaba');
    }
}

function cardsCollectionAdd (newCardsEarned){
    if (Array.isArray(newCardsEarned) && newCardsEarned.length > 0) {
        let cardsCollectionAchieved = JSON.parse(localStorage.getItem('cardsCollection')) || [];

        // Agregar nuevas cartas a la colección existente
        cardsCollectionAchieved = cardsCollectionAchieved.concat(newCardsEarned);

        localStorage.setItem('cardsCollection', JSON.stringify(cardsCollectionAchieved));
      //  console.log('LS recargado', cardsCollectionAchieved);

        return cardsCollectionAchieved;
    } else {
        console.log('No se agregaron nuevas cartas. El conjunto de nuevas cartas está vacío.');
        return [];
    }
    /* //Obtengo la información de LS y la parseo
    let cardsCollectionAchieved = JSON.parse(localStorage.getItem('cardsCollection')) || [];

    //Le agrego las nuevas cartas
    cardsCollectionAchieved = cardsCollectionAchieved.concat(newCardsEarned);

    localStorage.setItem('cardsCollection', JSON.stringify(cardsCollectionAchieved));

    console.log('LS recargado', cardsCollectionAchieved);

    return cardsCollectionAchieved; */
}

function optionsLoop (arrayIncorrect, arrayCorrect, arrayOptions, correctAnswer, number = 1){
 

   containerOptions.textContent = '';
        
    //Cargar nuevas opciones
    let randomIncorrectAnswers = obtainRandomNumber (arrayIncorrect, 4);
   
    //Recorro el array de respuestas incorrectas y lo guardo en el array de opciones a mostrar
    for (answer of randomIncorrectAnswers){
        /*  console.log(answer);
            let li = d.createElement ('li');
            li.innerText = answer;
            containerOptions.appendChild (li); */
            arrayOptions.push (answer);
        }

    //Obtengo una respuesta correcta y la agrego al array de respuestas
    correctAnswer = obtainRandomNumber( arrayCorrect, 1);
    
    for (item of correctAnswer){
        arrayOptions.push (item);
        correctAnswer = item;
    }

    //Mezclo las opciones
    let optionsShow = shuffledArray (arrayOptions);


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

        containerOptions.appendChild (radio);
        containerOptions.appendChild (label);

        number++;
        }
}
