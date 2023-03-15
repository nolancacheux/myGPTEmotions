/**
 * Human demo for browsers
 *
 * Demo for face detection
 */

/** @type {Human} */
import { Human } from '../client/dist/human.esm.js';

let loader;

const humanConfig = { // user configuration for human, used to fine-tune behavior
  debug: true,
  modelBasePath: './models/',
  filter: { enabled: true, equalization: false, flip: false },
  face: {
    enabled: true,
    detector: { rotation: false, maxDetected: 100, minConfidence: 0.2, return: true },
    iris: { enabled: true },
    description: { enabled: true },
    emotion: { enabled: true },
    antispoof: { enabled: true },
    liveness: { enabled: true },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false },
};

const human = new Human(humanConfig); // new instance of human
export const showLoader = (msg) => { 
  loader.setAttribute('msg', msg); 
  loader.style.display = 'flex'; 
};
export const hideLoader = () => loader.style.display = 'none';

class ComponentLoader extends HTMLElement {
  message = document.createElement('div');

  static get observedAttributes() { return ['msg']; }

  attributeChangedCallback(_name, _prevVal, currVal) {
    this.message.innerHTML = currVal;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const css = document.createElement('style');
    css.innerHTML = `
      .loader-container { display: flex; transition: opacity 2s ease-in-out;justify-content: center; align-items: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 9999; }
      .loader-message { font-size: 1.5rem; color: white; padding: 1rem; }
      .loader { width: 50px; height: 50px; border-radius: 50%; border: 5px solid #f1c40f; border-top: 5px solid white; animation: spin 1s linear infinite; position: relative; }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `;
    const container = document.createElement('div');
    container.id = 'loader-container';
    container.className = 'loader-container';
    loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'loader';
    this.message.id = 'loader-message';
    this.message.className = 'loader-message';
    this.message.innerHTML = '';
    container.appendChild(loader);
    container.appendChild(this.message);
    this.shadowRoot?.append(css, container);
    loader = this;
    
    // Add event listener to hide the loader on load
    window.addEventListener('load', () => {
      hideLoader();
    });
  }
}

customElements.define('component-loader', ComponentLoader);



function addFace(face, source) {
  const deg = (rad) => Math.round((rad || 0) * 180 / Math.PI);
  const canvas = document.createElement('canvas');
  const emotion = face.emotion?.map((e) => `${Math.round(100 * e.score)}% ${e.emotion}`) || [];
  
  const rotation = `Tangage ${deg(face.rotation?.angle.pitch)}° | Roulis ${deg(face.rotation?.angle.roll)}° | Lacet ${deg(face.rotation?.angle.yaw)}°`;
const gaze = `Direction ${deg(face.rotation?.gaze.bearing)}° Force ${Math.round(100 * (face.rotation.gaze.strength || 0))}%`;

//Source : ${source} 
  canvas.title = `Prédictions :
  Score : ${Math.round(100 * face.boxScore)} % 
  Detection ${Math.round(100 * face.faceScore)} % 
  Analyse de l'âge : ${face.age} ans 
  Genre : ${face.gender} 
  Score ${Math.round(100 * face.genderScore)} % 
  Émotion : ${emotion.join(' | ')} 
  Rotation de la tête : ${rotation} 
  Regard : ${gaze} 
  Distance de la caméra : ${face.distance} m 
  Vérification : ${Math.round(100 * face.real)} % reel ${Math.round(100 * face.live)} % en direct`.replace(/ /g, ' ');

  const canvasPrompt = document.createElement('canvas');canvasPrompt.title = `pouvez-vous me fournir trois blocs de texte séparés par des barres verticales : 1) Write me in French an original brief daily opinion and an horoscope of me at speaking at 2nd person plural (who is a ${face.gender}, whose emotions are ${emotion.join(' , ')}).2) donne moi 3 recommandations originales de musiques (not only french) 1) 2)... Pour finir Retourne à la ligne et donne moi 3 recommandations originales à faire 1) 2) 3).`.replace(/  /g, ' ');

  // Update emotion bars on canvas click
  canvas.onclick = (e) => {
    e.preventDefault();
    document.getElementById('informations').innerHTML = canvas.title;
    document.getElementById('prompt').innerHTML = canvasPrompt.title;
    // Update emotion bars
    emotion.forEach((e) => {
      const [percent, emotion] = e.split(" ");
      let barSelector;
      switch (emotion) {
        case "happy":
          barSelector = ".bar:nth-of-type(1)";
          break;
        case "sad":
          barSelector = ".bar:nth-of-type(3)";
          break;
        case "neutral":
          barSelector = ".bar:nth-of-type(2)";
          break;
        case "disgust":
          barSelector = ".bar:nth-of-type(5)";
          break;
        case "anger":
            barSelector = ".bar:nth-of-type(4)";
           break;
        case "fear":
          barSelector = ".bar:nth-of-type(7)";
          break;
        case "surprise":
          barSelector = ".bar:nth-of-type(6)";
          break;
        default:
          break;
      }
      if (barSelector) {
        $(barSelector).attr("data-percent", `${percent}%`);
        $(barSelector).each(function() {
          $(this).find(".fill").css("width", `${percent}%`);
          $(this).find(".count").text(percent + "%");
        });
      }
    });
    $('.bar').each(function (i) {
      var $bar = $(this);
      $(this).append('<span class="count"></span>');
      if ($bar.attr('data-percent') === '0%') {
        $bar.hide();
      } else {
        setTimeout(function () {
          $bar.show();
          $bar.css('width', $bar.attr('data-percent'));
        }, i * 100);
      }
    });
    // Animate emotion bars
    $('.count').each(function () {
      const $bar = $(this).parent('.bar');
      $(this).prop('Counter', 0).animate({
        Counter: $bar.attr('data-percent')
      }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
          $(this).text(Math.ceil(now) + '%');
          $bar.css('width', now + '%');
        }
      });
    });
  };
  human.tf.browser.toPixels(face.tensor, canvas);
    human.tf.dispose(face.tensor);
    return canvas;
  }
  
  

let currentImage;

async function addFaces(imgEl) {
  showLoader('Détection de vos émotions en cours.');
  const faceEl = document.getElementById('faces');
  faceEl.innerHTML = '';
  const res = await human.detect(imgEl);
  console.log(res); // eslint-disable-line no-console
  document.getElementById('informations').innerHTML = `Nous avons détecté ${res.face.length} visages`;
  for (const face of res.face) {
    const canvas = addFace(face, imgEl.src.substring(0, 64));
    faceEl.appendChild(canvas);
    canvas.addEventListener('click', submitHandler); // Ajout de l'écouteur d'événements
  }
  currentImage = imgEl;
  hideLoader();
}



function showLoader2(text) {
  const loaderEl = document.getElementById('loader');
  loaderEl.innerHTML = `${text} <span class="loader"></span>`;
  loaderEl.style.display = 'block';
}

function hideLoader2() {
  const loaderEl = document.getElementById('loader');
  loaderEl.innerHTML = '';
  loaderEl.style.display = 'none';
}

// function addImage(imageUri) {
//   const imgEl = new Image(256, 256);
//   imgEl.onload = () => {
//     const images = document.getElementById('images');
//     images.appendChild(imgEl); // add image if loaded ok
//     images.scroll(images?.offsetWidth, 0);
//   };
//   imgEl.onerror = () => console.error('addImage', { imageUri }); // eslint-disable-line no-console
//   imgEl.onclick = () => addFaces(imgEl);
//   imgEl.title = imageUri.substring(0, 64);
//   imgEl.src = encodeURI(imageUri);
// }

// async function initDragAndDrop() {
//   const reader = new FileReader();
//   reader.onload = async (e) => {
//     if (e.target.result.startsWith('data:image')) await addImage(e.target.result);
//   };
//   document.body.addEventListener('dragenter', (evt) => evt.preventDefault());
//   document.body.addEventListener('dragleave', (evt) => evt.preventDefault());
//   document.body.addEventListener('dragover', (evt) => evt.preventDefault());
//   document.body.addEventListener('drop', async (evt) => {
//     evt.preventDefault();
//     evt.dataTransfer.dropEffect = 'copy';
//     for (const f of evt.dataTransfer.files) reader.readAsDataURL(f);
//   });
//   document.body.onclick = (e) => {
//     if (e.target.localName !== 'canvas') document.getElementById('description').innerHTML = '';
//   };
// }

function uploadImage() {
  const inputImage = document.getElementById('inputImage');

  inputImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgEl = document.createElement('img');
      imgEl.onload = () => {
        addFaces(imgEl);
      };
      imgEl.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

var width = 320; // We will scale the photo width to this
var height = 0; // This will be computed based on the input stream

var streaming = false;

var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

function startup() {
  console.log("Startup function");
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo');
  startbutton = document.getElementById('startbutton');

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log("An error occurred: " + err);
    });

  video.addEventListener('canplay', function (ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);

      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  startbutton.addEventListener('click', function (ev) {
    takepicture();
    ev.preventDefault();
  }, false);

  clearphoto();
}


function clearphoto() {
  console.log("clear function");
  var context = canvas.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

function takepicture() {
  console.log("takepicture function")
  var context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  } else {
    clearphoto();
  }
}
function uploadCaptureImage() {
  const photoEl = document.getElementById('photo');

  photoEl.addEventListener('click', (event) => {
    const imgEl = new Image();
    imgEl.onload = () => {
      addFaces(imgEl);
    };
    imgEl.src = photoEl.src;
  });
}

async function main() {

  showLoader('Veuillez patienter un instant.');
  await human.load();
  showLoader("Chargement de l'IA terminé.");
  await human.warmup();
  //   showLoader('loading images');
  //   const images = ['group-1.jpg', 'group-2.jpg', 'group-3.jpg', 'group-4.jpg', 'group-5.jpg', 'group-6.jpg', 'group-7.jpg', 'solvay1927.jpg', 'stock-group-1.jpg', 'stock-group-2.jpg'];
  //   const imageUris = images.map((a) => `./samples/in/${a}`);
  //   for (let i = 0; i < imageUris.length; i++) addImage(imageUris[i]);
  hideLoader();
  uploadImage();
  uploadCaptureImage();

}
window.addEventListener('load', startup, false);
window.onload = main;



//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------


"use strict";

const form = document.querySelector("form"); // only form in the page so no need to specify
const chatContainer = document.querySelector("#chat_container");

// Show 3 dots while waiting for the response
let loading;

const loader2 = el => {
  el.textContent = "En train d'écrire";

  loading = setInterval(() => {
    el.textContent += ".";

    el.textContent === "En train d'écrire...." ? (el.textContent = "En train d'écrire") : el.textContent;
  }, 300);
};

// If the bot is typing do it 1 by 1
const botType = (el, text) => {
  let index = 0;

  let interval = setInterval(() => {
    index < text.length
      ? ((el.innerHTML += text.charAt(index)), index++)
      : clearInterval(interval);
  }, 30);
};

// Generate a really random unique id for each message
const generateMsgId = () => {
  const timestamp = Date.now();
  const rndHexStr = Math.floor(Math.random() * 1000).toString(16);

  return `id-${timestamp}-${rndHexStr}`;
};

// Shows a colored message depending on the sender
const chatStripe = (isBot, value, uniqueId) => {
  return `
      <div class="wrapper" >
          <div class="chat__message" id="${uniqueId}">
            ${value}
          </div>
        </div>
      </div>
    `;
};

const submitHandler = async e => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatstripe (false so it knows it's not a bot)
  //chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  //form.reset();

  //bot's chatstripe (true so it knows it's a bot and empty so it fills it with the bot's response)
  const uniqueId = generateMsgId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  //scrolls so the message is visible
  chatContainer.scrollTop = chatContainer.scrollHeight;

  //shows the loading dots
  const msgContainer = document.querySelector(`#${uniqueId}`);
  loader2(msgContainer);

  //fetch OpenAI's response
  const response = await fetch("http://localhost:5000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: document.getElementById("prompt").innerText }),
  });

  clearInterval(loading);
  msgContainer.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.message.trim();

    botType(msgContainer, parsedData);
  } else {
    const error = await response.text();
    msgContainer.innerHTML = `
    Oops, something went wrong! 
    
    Here's the actual error in case you're curious, it may look ugly but don't mind it too much if you're not a developer :): 
    
    ${error}
    
  `;
  }
};

form.addEventListener("submit", submitHandler);
form.addEventListener("keyup", e => {
  e.key === "Enter" && submitHandler(e);
});

setTimeout(function start() {
  $('.bar').each(function (i) {
    var $bar = $(this);
    $(this).append('<span class="count"></span>');
    if ($bar.attr('data-percent') === '0%') {
      $bar.hide();
    } else {
      setTimeout(function () {
        $bar.css('width', $bar.attr('data-percent'));
      }, i * 100);
    }
  });

  $('.count').each(function () {
    $(this).prop('Counter', 0).animate({
      Counter: $(this).parent('.bar').attr('data-percent')
    }, {
      duration: 2000,
      easing: 'swing',
      step: function (now) {
        $(this).text(Math.ceil(now) + '%');
      }
    });
  });
}, 500);