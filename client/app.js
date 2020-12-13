//input url
let link = document.getElementById('link');

//button
let button = document.getElementById('submit');

//iframe
//let iframe = document.getElementById('iframe');

//set iframe opacity to zero if there is no source link provided
// if(iframe.src === ""){
//     iframe.style.opacity = 0;
// }

//on button press, transfer URL from input to the iframe if the input is not empty
button.addEventListener('click', e =>{
    if(link.value !== ""){
        
        let url = urlParser(link.value);
        console.log('about to send xml request')
        const request = new XMLHttpRequest();
        request.open('POST', `/url/${url}`, true);
        request.responseType = 'arraybuffer';
        request.onload = function(){
            let data = request.response;
            console.log(typeof(data));
            parseData(data);
        };
        request.send();
        // $.post(`/url/${url}`).done(data => {
        //     let enc = new TextEncoder();
        //     data = enc.encode(data);
        //     //data = new Buffer.from(data, 'utf-8');
        //     console.log(typeof(data));
        //     parseData(data);
        // });

        //iframe.src = url;
        //iframe.style.opacity =1;
    }
});

// function loadSound() {
//     var request = new XMLHttpRequest();
//     request.open("GET", "http://localhost:8000/stream/nl6OW07A5q4", true); 
//     request.responseType = "arraybuffer"; 
  
//     request.onload = function() {
//         var Data = request.response;
//         process(Data);
//     };
  
//     request.send();
//   }
  
//   function process(Data) {
//     source = context.createBufferSource(); // Create Sound Source
//     context.decodeAudioData(Data, function(buffer){
//       source.buffer = buffer;
//       source.connect(context.destination); 
//       source.start(context.currentTime);
//   }) 

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
    //return `https://youtube.com/embed/${returnString}`
}


function parseData(data){
    console.log(typeof(data));
    //audio context setup
    const audioContext = new  AudioContext();
    let source =audioContext.createBufferSource();
    audioContext.decodeAudioData(data, function(buffer){
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
    });
    // let source = audioContext.createBufferSource()
    // source.buffer = data;

    // source.connect(audioContext.destination);
    // source.start();
}
