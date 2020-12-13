const express = require('express');
const { PassThrough } = require('stream');
const youtubeStream = require('youtube-audio-stream');
const ytdl = require('ytdl-core');
const app = express();



app.use(express.static(__dirname + '/client'));

app.post('/url/:id', (req, res) => {
    console.log('reached here');
    let link = `https://www.youtube.com/watch?v=${req.params.id}`;
    try{
        const passThrough = new PassThrough()
        let dataArr = [];
        //youtubeStream(req.params.id).pipe(res);
        //filter: 'audioonly', quality: 'lowest'
        //filter: format => format.container === 'mp4'
        ytdl(link, {filter: format => format.container === 'mp4'}).pipe(res);
        // video.on('data', function(data){
        //     dataArr.push(data)
        // });
        // video.on('end', function(){
        //     let buffer = Buffer.concat(dataArr);
        //     console.log(typeof(buffer));
        //     res.status(200).send(buffer);
        // })

    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})