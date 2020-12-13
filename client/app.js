//input url
let link = document.getElementById('link');

//button
let button = document.getElementById('submit');

let visualiser = document.getElementById('display');
const canvasContext = visualiser.getContext('2d');
let loading = true;

canvasContext.beginPath();
const CIRCLE_RADIUS = 30;
console.log(visualiser.width)
console.log(visualiser.height);
canvasContext.arc(visualiser.width/2, visualiser.height/2, CIRCLE_RADIUS, 0, Math.PI*2);
canvasContext.stroke();

let pastVal = '';

//on button press, transfer URL from input to the iframe if the input is not empty
button.addEventListener('click', e =>{
    if(link.value !== "" && link.value !== pastVal){
        
        let url = urlParser(link.value);
        pastVal = link.value;

        //create the xml response that gets sent to the server grabs the audio data
        const request = new XMLHttpRequest();
        request.open('POST', `/url/${url}`, true);
        request.responseType = 'arraybuffer';
        request.onloadstart = function(event){
            makeSpikes();
        }
        request.onload = function(){
            let data = request.response;
            //audio data passed through this function which applies the web audio api
            parseData(data);
        };

        request.send();
    }
});
function makeSpikes(){
    console.log('this function is executing');
    // while(loading){
    //     let x = visualiser.width/2 - CIRCLE_RADIUS;
    //     let y = visualiser.height/2

    //     setInterval(() => {
    //         console.log('ran');
    //         canvasContext.fillRect(x, y, 10, 10)
    //         x += 5;
    //         y = Math.sqrt(CIRCLE_RADIUS**2 - (x - visualiser.width/2)**2);
    //     }, 100);
    // }
}

//turns whatever the user passed in into an embed YT link otherwise it alerts the user of an invalid input
function urlParser(url){
    let returnString=  "";
    if(url.includes('youtu') && url.indexOf('h') === 0){
        for(let i = url.length -1; i > 0; i--){
            if(url[i] == '/' || url[i] == '='){
                break;
            }
            else{
                returnString =  url[i] + returnString;
            }
        }
    }
    else{
        alert('Please submit from youtube')
    }
    return returnString
}

const audioContext = new  AudioContext();
const analyserNode = new AnalyserNode(audioContext, {fftSize: 64, smoothingTimeConstant: 0.8});

function parseData(data){
    //audio context setup
    let source =audioContext.createBufferSource();
    audioContext.decodeAudioData(data, function(buffer){
        source.buffer = buffer;
        source
            .connect(analyserNode)
            .connect(audioContext.destination);
        source.start();
        getAudioData();
    });
}
function getAudioData(){
    requestAnimationFrame(getAudioData);

    const bufferLength = analyserNode.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    analyserNode.getByteFrequencyData(dataArray);

    const width = visualiser.width;
    const height =visualiser.height;


    const barWidth =width/bufferLength;

    canvasContext.clearRect(0,0, width, height);
    for(let i = 0; i < dataArray.length; i++){
        let y = dataArray[i]/255 * height/2;
        const x = barWidth*i;

        canvasContext.fillStyle = `hsl(${i*360/dataArray.length}, 100%, 50%)`;
        canvasContext.fillRect(x, height-y, barWidth, y);
    }
}