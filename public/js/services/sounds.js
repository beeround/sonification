'use strict';
angular.module('sonificationAPP.services.sounds', [])
    .service('soundService', ['$http', '$q', '$timeout',
        function ($http, $q, $timeout) {
            let currentsong = new Audio();
            let sonifyLove;
            let sonifyHaha;
            let sonifyWow;
            let sonifySad;
            let sonifyAngry;
            let soundON = false;
            let sounds=[
                {name: "Simple"},
                {name: "Instrument"},
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

            return {

                getSounds: function () {
                    return sounds;
                },
                playSoundsV1: function(love, haha, wow, sad, angry, reaction){
                    if (soundON == true) {
                        removePolysynth();
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
                    let trendReaction;
                    let ReactionsInPercent;
                    if (soundON && !currentsong.paused){
                        currentsong.pause();
                    }
                    soundON = true;



                    if (reaction != null){
                        trendReaction = reaction;
                        ReactionsInPercent = {
                            love:1,
                            haha:1,
                            wow:1,
                            sad:1,
                            angry:1
                        };
                    }
                    else {
                        trendReaction = reactionTrend(love, haha, wow, sad, angry);
                        ReactionsInPercent = reactionsInPercent(love, haha, wow, sad, angry);
                    }
                    switch (trendReaction) {
                        case "love":
                            currentsong = new Audio ("../../sounds/instrument/love_strings.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.love;
                            break;
                        case "haha":
                            currentsong = new Audio ("../../sounds/instrument/haha_flute.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.haha;
                            break;
                        case "wow":
                            currentsong = new Audio ("../../sounds/instrument/wow_trumpet.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.wow;
                            break;
                        case "sad":
                            currentsong = new Audio ("../../sounds/instrument/sad_cello.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.sad;
                            break;
                        case "angry":
                            currentsong = new Audio ("../../sounds/instrument/angry_horns.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.angry;
                            break;
                        default:
                    }
            },
                playSoundsV3: function(love, haha, wow, sad, angry, reaction){
                    let trendReaction;
                    let ReactionsInPercent;
                    if (soundON && !currentsong.paused){
                        currentsong.pause();
                    }
                    soundON = true;



                    if (reaction != null){
                        trendReaction = reaction;
                        ReactionsInPercent = {
                            love:1,
                            haha:1,
                            wow:1,
                            sad:1,
                            angry:1
                        };
                    }
                    else {
                        trendReaction = reactionTrend(love, haha, wow, sad, angry);
                        ReactionsInPercent = reactionsInPercent(love, haha, wow, sad, angry);
                    }
                    switch (trendReaction) {
                        case "love":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.love;
                            break;
                        case "haha":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.haha;
                            break;
                        case "wow":
                            currentsong = new Audio ("../../sounds/sound/wow_sound.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.wow;
                            break;
                        case "sad":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.sad;
                            break;
                        case "angry":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.angry;
                            break;
                        default:
                    }
                },
                playSoundsV4: function(love, haha, wow, sad, angry, reaction){
                    let trendReaction;
                    let ReactionsInPercent;
                    if (soundON && !currentsong.paused){
                        currentsong.pause();
                    }
                    soundON = true;



                    if (reaction != null){
                        trendReaction = reaction;
                        ReactionsInPercent = {
                            love:1,
                            haha:1,
                            wow:1,
                            sad:1,
                            angry:1
                        };
                    }
                    else {
                        trendReaction = reactionTrend(love, haha, wow, sad, angry);
                        ReactionsInPercent = reactionsInPercent(love, haha, wow, sad, angry);
                    }
                    switch (trendReaction) {
                        case "love":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.love;
                            break;
                        case "haha":
                            currentsong = new Audio ("../../sounds/animals/haha_goat.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.haha;
                            break;
                        case "wow":
                            currentsong = new Audio ("../../sounds/animals/wow_elephant.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.wow;
                            break;
                        case "sad":
                            currentsong = new Audio ("../../sounds/harfe.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.sad;
                            break;
                        case "angry":
                            currentsong = new Audio ("../../sounds/animals/angry_cat.mp3");
                            currentsong.play();
                            currentsong.volume = ReactionsInPercent.angry;
                            break;
                        default:
                    }
                },


            }
        }]);

