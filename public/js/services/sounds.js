'use strict';
angular.module('sonificationAPP.services.sounds', [])
    .service('soundService', ['$http', '$q', '$timeout',
        function ($http, $q, $timeout) {
            let currentsong = new Audio();
            let currentsong_love = new Audio();
            let currentsong_haha = new Audio();
            let currentsong_wow = new Audio();
            let currentsong_sad = new Audio();
            let currentsong_angry = new Audio();
            let sonify = {"love": new Audio(), "haha": new Audio(), "wow": new Audio(), "sad": new Audio(), "angry": new Audio()};
            let sonifyLove = new Tone;
            let sonifyHaha = new Tone;
            let sonifyWow = new Tone;
            let sonifySad = new Tone;
            let sonifyAngry = new Tone;
            let soundON = false;
            let sounds=[
                {name: "Simple"},
                {name: "Instrument"},
                {name: "Instrument V2"},
                {name: "Sounds"},
                {name: "Animals"}
            ];

            let removePolysynth = function(){
                sonifyLove.dispose();
                sonifyHaha.dispose();
                sonifyWow.dispose();
                sonifySad.dispose();
                sonifyAngry.dispose();
                soundON = false;
            };
            let breaksounds = function(){
                currentsong.pause();
                currentsong_love.pause();
                currentsong_haha.pause();
                currentsong_sad.pause();
                currentsong_angry.pause();
                soundON = false;
            };

            return {

                getSounds: function () {
                    return sounds;
                },
                playSoundsV1: function(love, haha, wow, sad, angry, reaction){
                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                        let trendReaction;
                        soundON = true;
                        var velocity = reactionsInPercent(love, haha, wow, sad, angry);
                        sonifyLove = new Tone.PolySynth(6, Tone.Synth).toMaster();
                        sonifyHaha = new Tone.PolySynth(6, Tone.Synth).toMaster();
                        sonifyWow = new Tone.PolySynth(6, Tone.Synth).toMaster();
                        sonifySad = new Tone.PolySynth(6, Tone.Synth).toMaster();
                        sonifyAngry = new Tone.PolySynth(6, Tone.Synth).toMaster();


                        if (reaction != null){
                            trendReaction = reaction;

                            switch(trendReaction){
                                case "love":
                                    velocity.love ="1";
                                    break;
                                case "haha":
                                    velocity.haha ="1";
                                    break;
                                case "wow":
                                    velocity.wow ="1";
                                    break;
                                case "sad":
                                    velocity.sad ="1";
                                    break;
                                case "angry":
                                    velocity.angry ="1";
                                    break;
                            }
                        }
                        else {
                            trendReaction = reactionTrend(love, haha, wow, sad, angry);
                        }
                        switch (trendReaction) {
                            case "love":
                                sonifyLove.triggerAttackRelease("D4", "2n", "+0", velocity.love);
                                sonifyLove.triggerAttackRelease("E4", "2n", "+0.1", velocity.love);
                                sonifyLove.triggerAttackRelease("G4", "2n", "+0.2", velocity.love);
                                sonifyLove.triggerAttackRelease("B4", "2n", "+0.3", velocity.love);
                                sonifyLove.releaseAll();
                                break;
                            case "haha":
                                sonifyHaha.triggerAttackRelease('A5', '8n', '+0', velocity.haha);
                                sonifyHaha.triggerAttackRelease('GB5', '8n', '+0.1', velocity.haha);
                                sonifyHaha.triggerAttackRelease('D5', '8n', '+0.2', velocity.haha);
                                sonifyHaha.triggerAttackRelease('D4', '8n', '+0.3', velocity.haha);
                                sonifyHaha.releaseAll();
                                break;
                            case "wow":
                                sonifyWow.triggerAttackRelease('C4', '1n', '+0', velocity.wow);
                                sonifyWow.triggerAttackRelease('E4', '1n', '+0', velocity.wow);
                                sonifyWow.triggerAttackRelease('AB4', '1n', '+0', velocity.wow);
                                sonifyWow.releaseAll();
                                break;
                            case "sad":
                                sonifySad.triggerAttackRelease('A3', '1n', '+0', velocity.sad);
                                sonifySad.triggerAttackRelease('D4', '1n', '+0', velocity.sad);
                                sonifySad.triggerAttackRelease('F4', '1n', '+0', velocity.sad);
                                sonifySad.triggerAttackRelease('G3', '1n', '+2', velocity.sad);
                                sonifySad.triggerAttackRelease('BB3', '1n', '+2', velocity.sad);
                                sonifySad.triggerAttackRelease('D4', '1n', '+2', velocity.sad);
                                sonifySad.triggerAttackRelease('E4', '1n', '+2', velocity.sad);
                                sonifySad.releaseAll();
                                break;
                            case "angry":
                                sonifyAngry.triggerAttackRelease('A4', '1n', '+0', velocity.angry);
                                sonifyAngry.triggerAttackRelease('C5', '1n', '+0', velocity.angry);
                                sonifyAngry.triggerAttackRelease('EB5', '1n', '+0', velocity.angry);
                                sonifyAngry.triggerAttackRelease('GB5', '1n', '+0', velocity.angry);
                                sonifyAngry.releaseAll();
                                break;
                            default:
                        }


                },
                playSoundsV2: function(love, haha, wow, sad, angry, reaction){
                    let reactionValue;
                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    if (reaction != null){
                        switch (reaction) {
                            case "love":
                                currentsong = new Audio ("../../sounds/instrument_v2/love_strings_short.mp3");
                                currentsong.play();
                                break;
                            case "haha":
                                currentsong = new Audio ("../../sounds/instrument_v2/haha_flute_short.mp3");
                                currentsong.play();
                                break;
                            case "wow":
                                currentsong = new Audio ("../../sounds/instrument_v2/wow_trumpet_short.mp3");
                                currentsong.play();
                                break;
                            case "sad":
                                currentsong = new Audio ("../../sounds/instrument_v2/sad_bassoons_short.mp3");
                                currentsong.play();
                                break;
                            case "angry":
                                currentsong = new Audio ("../../sounds/instrument_v2/angry_horns_short.mp3");
                                currentsong.play();
                                break;
                        }
                    }
                    else {
                        reactionValue = reactionsInPercent(love,haha,wow,sad,angry);
                        switch(reactionTrend(love, haha, wow, sad, angry)){
                            case "love":
                                reactionValue.haha = reactionValue.haha/ reactionValue.love;
                                reactionValue.wow = reactionValue.wow/ reactionValue.love;
                                reactionValue.sad = reactionValue.sad/ reactionValue.love;
                                reactionValue.angry = reactionValue.angry/ reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love/ reactionValue.haha;
                                reactionValue.wow = reactionValue.wow/ reactionValue.haha;
                                reactionValue.sad = reactionValue.sad/ reactionValue.haha;
                                reactionValue.angry = reactionValue.angry/ reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha/ reactionValue.wow;
                                reactionValue.love = reactionValue.love/ reactionValue.wow;
                                reactionValue.sad = reactionValue.sad/ reactionValue.wow;
                                reactionValue.angry = reactionValue.angry/ reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha/ reactionValue.sad;
                                reactionValue.wow = reactionValue.wow/ reactionValue.sad;
                                reactionValue.love = reactionValue.love/ reactionValue.sad;
                                reactionValue.angry = reactionValue.angry/ reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha/ reactionValue.angry;
                                reactionValue.wow = reactionValue.wow/ reactionValue.angry;
                                reactionValue.sad = reactionValue.sad/ reactionValue.angry;
                                reactionValue.love = reactionValue.love/ reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        };

                        currentsong_love = new Audio ("../../sounds/instrument_v2/love_strings.mp3");
                        currentsong_love.play();
                        currentsong_love.volume = reactionValue.love;

                        currentsong_haha = new Audio ("../../sounds/instrument_v2/haha_flute.mp3");
                        currentsong_haha.play();
                        currentsong_haha.volume = reactionValue.haha;

                        currentsong_wow = new Audio ("../../sounds/instrument_v2/wow_trumpet.mp3");
                        currentsong_wow.play();
                        currentsong_wow.volume = reactionValue.wow;

                        currentsong_sad = new Audio ("../../sounds/instrument_v2/sad_bassoons.mp3");
                        currentsong_sad.play();
                        currentsong_sad.volume = reactionValue.sad;

                        currentsong_angry = new Audio ("../../sounds/instrument_v2/angry_horns.mp3");
                        currentsong_angry.play();
                        currentsong_angry.volume = reactionValue.angry;

                    }
            },
                playSoundsV3: function(love, haha, wow, sad, angry, reaction){
                    let trendReaction;
                    let reactionValue;
                    if (soundON == true) {
                        breaksounds();
                        removePolysynth();
                    }
                    soundON = true;



                    if (reaction != null){
                        trendReaction = reaction;
                        reactionValue = {
                            love:1,
                            haha:1,
                            wow:1,
                            sad:1,
                            angry:1
                        };
                    }
                    else {
                        trendReaction = reactionTrend(love, haha, wow, sad, angry);
                        reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                    }
                    switch (trendReaction) {
                        case "love":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = reactionValue.love;
                            break;
                        case "haha":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = reactionValue.haha;
                            break;
                        case "wow":
                            currentsong = new Audio ("../../sounds/sound/wow_sound.mp3");
                            currentsong.play();
                            currentsong.volume = reactionValue.wow;
                            break;
                        case "sad":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = reactionValue.sad;
                            break;
                        case "angry":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = reactionValue.angry;
                            break;
                        default:
                    }
                },
                playSoundsV4: function(love, haha, wow, sad, angry, reaction){
                    let trendReaction;
                    let reactionsValue;
                    if (soundON == true) {
                        breaksounds();
                        removePolysynth();
                    }
                    soundON = true;



                    if (reaction != null){
                        trendReaction = reaction;
                        reactionsValue = {
                            love:1,
                            haha:1,
                            wow:1,
                            sad:1,
                            angry:1
                        };
                    }
                    else {
                        trendReaction = reactionTrend(love, haha, wow, sad, angry);
                        reactionsValue = reactionsInPercent(love, haha, wow, sad, angry);
                    }
                    switch (trendReaction) {
                        case "love":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.love;
                            break;
                        case "haha":
                            currentsong = new Audio ("../../sounds/animals/haha_goat.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.haha;
                            break;
                        case "wow":
                            currentsong = new Audio ("../../sounds/animals/wow_elephant.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.wow;
                            break;
                        case "sad":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.sad;
                            break;
                        case "angry":
                            currentsong = new Audio ("../../sounds/animals/angry_cat.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.angry;
                            break;
                        default:
                    }
                },
                playSoundsV5: function(love, haha, wow, sad, angry, reaction){
                    sonify.love = new Audio ("../../sounds/instrument_v2/love_strings_short.mp3");
                    sonify.haha = new Audio ("../../sounds/instrument_v2/haha_flute_short.mp3");
                    sonify.wow = new Audio ("../../sounds/instrument_v2/wow_trumpet_short.mp3");
                    sonify.sad = new Audio ("../../sounds/instrument_v2/sad_bassoons_short.mp3");
                    sonify.angry = new Audio ("../../sounds/instrument_v2/angry_horns_short.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    let arrayReactions = [
                        {"name": "love","value" : love, "timeMS": 3458, "valueVolume": 1},
                        {"name": "wow","value" : wow, "timeMS": 979, "valueVolume": 1},
                        {"name": "haha","value" : haha, "timeMS": 1792, "valueVolume": 1},
                        {"name": "sad","value" : sad, "timeMS": 3854, "valueVolume": 1},
                        {"name": "angry","value" : angry, "timeMS": 2896, "valueVolume": 1}
                    ];
                    sortReactions(arrayReactions);

                    if (reaction != null){
                        switch (reaction) {
                            case "love":
                                currentsong = new Audio ("../../sounds/instrument_v2/love_strings_short.mp3");
                                currentsong.play();
                                break;
                            case "haha":
                                currentsong = new Audio ("../../sounds/instrument_v2/haha_flute_short.mp3");
                                currentsong.play();
                                break;
                            case "wow":
                                currentsong = new Audio ("../../sounds/instrument_v2/wow_trumpet_short.mp3");
                                currentsong.play();
                                break;
                            case "sad":
                                currentsong = new Audio ("../../sounds/instrument_v2/sad_bassoons_short.mp3");
                                currentsong.play();
                                break;
                            case "angry":
                                currentsong = new Audio ("../../sounds/instrument_v2/angry_horns_short.mp3");
                                currentsong.play();
                                break;
                        }
                    }
                    else {




                        let reactionValue = reactionsInPercent(love,haha,wow,sad,angry);
                        switch(reactionTrend(love, haha, wow, sad, angry)){
                            case "love":
                                reactionValue.haha = reactionValue.haha/ reactionValue.love;
                                reactionValue.wow = reactionValue.wow/ reactionValue.love;
                                reactionValue.sad = reactionValue.sad/ reactionValue.love;
                                reactionValue.angry = reactionValue.angry/ reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love/ reactionValue.haha;
                                reactionValue.wow = reactionValue.wow/ reactionValue.haha;
                                reactionValue.sad = reactionValue.sad/ reactionValue.haha;
                                reactionValue.angry = reactionValue.angry/ reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha/ reactionValue.wow;
                                reactionValue.love = reactionValue.love/ reactionValue.wow;
                                reactionValue.sad = reactionValue.sad/ reactionValue.wow;
                                reactionValue.angry = reactionValue.angry/ reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha/ reactionValue.sad;
                                reactionValue.wow = reactionValue.wow/ reactionValue.sad;
                                reactionValue.love = reactionValue.love/ reactionValue.sad;
                                reactionValue.angry = reactionValue.angry/ reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha/ reactionValue.angry;
                                reactionValue.wow = reactionValue.wow/ reactionValue.angry;
                                reactionValue.sad = reactionValue.sad/ reactionValue.angry;
                                reactionValue.love = reactionValue.love/ reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        };
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            (function() {
                                console.log("warte " + timetmp + " ms auf " + reaction.name)
                                setTimeout(function(){
                                    sonify[reaction.name].play(); /*play music by Reaction*/
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                    console.log("spiele " + reaction.name);
                                    }, (timetmp));
                                timetmp = timetmp + reaction.timeMS;
                            })(i);
                            i++;


                        }

                    }
                }



            }
        }]);

