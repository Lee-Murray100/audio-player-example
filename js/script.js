
initAudioPlayer = () => {
    var audio, playbtn, mutebtn, seekslider, volumeslider, seeking=false, seekto,
    curtimetext, durtimetext, playlist_status, dir, ext, playlist, playlist_index, agent;
    
    dir = "./audio/";
    ext = ".mp3";
    playlist = ["Evening-3songs/01-night_navel_2", "Evening-3songs/02-night_heart_1", "Evening-3songs/01-night_third_eye_1"];
    playlist_index = 0;
    agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('firefox') != -1 || agent.indexOf('opera') != -1){
        ext = ".ogg";
    }

    //set object references
    playbtn=document.querySelector("#playpausebtn");
    mutebtn=document.querySelector("#mutebtn");
    seekslider=document.querySelector("#seekslider");
    volumeslider=document.querySelector("#volumeslider");
    curtimetext=document.querySelector("#curtimetext");
    durtimetext=document.querySelector("#durtimetext");
    playlist_status=document.querySelector("#playlist_status");

    //add event handling
    playbtn.addEventListener("click", playPause);
    mutebtn.addEventListener("click", mute);
    seekslider.addEventListener("mousedown", (event) => {
        seeking=true;
        seek(event);
    });
    seekslider.addEventListener("mousemove", (event) => {
        seek(event);
    });
    seekslider.addEventListener("mouseup", () => {
        seeking=false;
    });
    volumeslider.addEventListener("mousemove", setVolume);

    // set audio data
    audio = new Audio();
    audio.src = dir+playlist[playlist_index]+ext;
    audio.loop = false;
    audio.addEventListener("timeupdate", seektimeupdate);
    audio.addEventListener("ended", switchTrack);
    playlist_status.innerHTML = "Track "+(playlist_index+1)+": "+playlist[playlist_index]+ext;


    // player functions

    function playPause() {
        if(audio.paused){
            try{
                audio.play();
                playbtn.style.background="url(./images/pause.png) no-repeat";
                playbtn.style.backgroundSize="100%";
            } catch (e) {
                console.log("error in getting song ", e);
            }
                
        } else {
            audio.pause();
            playbtn.style.background='url(./images/play.png) no-repeat';
            playbtn.style.backgroundSize="100%";
            // put in code that has some effect on the yantra display count/duration
        }
    }

    function mute() {
        if(audio.muted){
            audio.muted=false;
            mutebtn.style.background="url(./images/speaker.png) no-repeat";
            mutebtn.style.backgroundSize="90%";
        } else {
            audio.muted=true;
            mutebtn.style.background="url(./images/speaker-mute.png) no-repeat";
            mutebtn.style.backgroundSize="90%";
        }
    }

    function seek(e) {
        if(seeking){
            seekslider.value = event.clientX - seekslider.offsetLeft;
            seekto = audio.duration * (seekslider.value/100);
            audio.currentTime = seekto;
        }
    }

    function setVolume() {
        audio.volume = volumeslider.value/100;
    }

    function seektimeupdate() {
        var nt = audio.currentTime * (100 / audio.duration);
        seekslider.value = nt;
        var curmins = Math.floor(audio.currentTime / 60);
        var cursecs = Math.floor(audio.currentTime - curmins * 60);
        var durmins = Math.floor(audio.duration / 60);
        var dursecs = Math.floor(audio.duration - durmins * 60);
        if(cursecs < 10){ cursecs = "0"+cursecs; }  
        if(dursecs < 10){ dursecs = "0"+dursecs; } 
        if(durmins < 10){ durmins = "0"+durmins; } 
        if(curmins < 10){ curmins = "0"+curmins; } 
        curtimetext.innerHTML = curmins+":"+cursecs;
        durtimetext.innerHTML = durmins+":"+dursecs;
    }

    function switchTrack() {
        if (playlist_index < (playlist.length -1)){
            playlist_index++;
            playlist_status.innerHTML = "Track "+(playlist_index+1)+": "+playlist[playlist_index]+ext;
            audio.src = dir+playlist[playlist_index]+ext;
            audio.play();
        }

    }
}

window.onload = function() {
    initAudioPlayer();
}