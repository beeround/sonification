'use strict';
angular.module('sonificationAPP.services.sounds', [])
    .service('soundService', ['$http', '$q', '$timeout', '$rootScope',
        function ($http, $q, $timeout, $rootScope) {
            let currentsong = new Audio();
            let currentsong_love = new Audio();
            let currentsong_haha = new Audio();
            let currentsong_wow = new Audio();
            let currentsong_sad = new Audio();
            let currentsong_angry = new Audio();
            let sonify = {
                "beat": new Audio(),
                "love": new Audio(),
                "haha": new Audio(),
                "wow": new Audio(),
                "sad": new Audio(),
                "angry": new Audio()
            };
            let sonifyLove = new Tone;
            let sonifyHaha = new Tone;
            let sonifyWow = new Tone;
            let sonifySad = new Tone;
            let sonifyAngry = new Tone;
            let soundON = false;
            let arrayReactions;
            let timeouts = [];
            let sounds = [
                {name: "Simple", description: "Einfacher Ton. Die höchste Reaktion wird hervorgehoben."},
                {name: "Animals", description: "Tiersounds."},
                {name: "Piano+Beat", description: "Piano mit Beat."},
                {name: "Instrument", description: "Reactions werden mit Instrumenten sonifiziert."},
                {name: "Instrument absteigend", description: "Instrumente: Die Reaktion mit dem größten Wert wird zuerst gespielt, die niedrigste am Schluss."},
                {name: "Instrument aufsteigend", description: "Instrumente: Die Reaktion mit dem niedrigsten Wert wird zuerst gespielt, die größte am Schluss."},
                {name: "Humans", description: "Reactions werden mit Menschensounds sonifiziert."},
                {name: "Humans absteigend", description: "Menschensounds: Die Reaktion mit dem größten Wert wird zuerst gespielt, die niedrigste am Schluss."},
                {name: "Humans aufsteigend", description: "Menschensounds: Die Reaktion mit dem niedrigsten Wert wird zuerst gespielt, die größte am Schluss."},
                {name: "Crowd", description: "Reactions werden mit Menschenmengensounds sonifiziert."},
                {name: "Crowd absteigend", description: "Menschenmengensounds: Die Reaktion mit dem größten Wert wird zuerst gespielt, die niedrigste am Schluss."},
                {name: "Crowd aufsteigend", description: "Menschenmengensounds: Die Reaktion mit dem niedrigsten Wert wird zuerst gespielt, die größte am Schluss."},
                {name: "Sinus", description: "Reactions werden mit Sinus Sounds sonifiziert."},
                {name: "Sinus absteigend", description: "Sinus Sounds: Die Reaktion mit dem größten Wert wird zuerst gespielt, die niedrigste am Schluss."},
                {name: "Sinus aufsteigend", description: "Sinus Sounds: Die Reaktion mit dem niedrigsten Wert wird zuerst gespielt, die größte am Schluss."},
            ];

            //sound = lova,haha,wow,sad or angry
            //love,haha,wow,sad or angry = values
            function refreshPlayer(type, love, haha, wow, sad, angry) {

                if (soundON) {
                    console.log("true")
                    $rootScope.currentPlay = {
                        sound: type,
                        love: love,
                        wow: wow,
                        haha: haha,
                        sad: sad,
                        angry: angry
                    };
                }
            };

            //remove sound
            function removeCurrentPlaySong(timeoutMS) {
                timeouts.push($timeout(function () {
                    $rootScope.currentPlay.sound = "";
                    console.log("schließen")
                }, timeoutMS))
            }

            let removePolysynth = function () {
                sonifyLove.dispose();
                sonifyHaha.dispose();
                sonifyWow.dispose();
                sonifySad.dispose();
                sonifyAngry.dispose();
                sonifyLove = new Tone;
                sonifyHaha = new Tone;
                sonifyWow = new Tone;
                sonifySad = new Tone;
                sonifyAngry = new Tone;
                soundON = false;

            };
            let breaksounds = function () {
                currentsong.pause();
                currentsong.currentTime = 0;
                currentsong_love.pause();
                currentsong_love.currentTime = 0;
                currentsong_wow.pause();
                currentsong_wow.currentTime = 0;
                currentsong_haha.pause();
                currentsong_haha.currentTime = 0;
                currentsong_sad.pause();
                currentsong_sad.currentTime = 0;
                currentsong_angry.pause();
                currentsong_angry.currentTime = 0;

                soundON = false;
                sonify.beat.pause();
                sonify.love.pause();
                sonify.haha.pause();
                sonify.wow.pause();
                sonify.sad.pause();
                sonify.angry.pause();

                while (timeouts.length) {
                    $timeout.cancel(timeouts.pop());

                }
            };

            return {

                getSounds: function () {
                    return sounds;
                },
                //smiple
                playSoundsV1: function (love, haha, wow, sad, angry, reaction) {
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


                    if (reaction != null) {
                        trendReaction = reaction;

                        switch (trendReaction) {
                            case "love":
                                velocity.love = "1";
                                break;
                            case "haha":
                                velocity.haha = "1";
                                break;
                            case "wow":
                                velocity.wow = "1";
                                break;
                            case "sad":
                                velocity.sad = "1";
                                break;
                            case "angry":
                                velocity.angry = "1";
                                break;
                        }
                    }
                    else {
                        trendReaction = reactionTrend(love, haha, wow, sad, angry);
                    }
                    switch (trendReaction) {
                        case "love":
                            refreshPlayer("love", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(2000); //TODO set Time

                            sonifyLove.triggerAttackRelease("D4", "2n", "+0", velocity.love);
                            sonifyLove.triggerAttackRelease("E4", "2n", "+0.1", velocity.love);
                            sonifyLove.triggerAttackRelease("G4", "2n", "+0.2", velocity.love);
                            sonifyLove.triggerAttackRelease("B4", "2n", "+0.3", velocity.love);
                            sonifyLove.releaseAll();
                            break;
                        case "haha":
                            refreshPlayer("haha", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(2000); //TODO set Time

                            sonifyHaha.triggerAttackRelease('A5', '8n', '+0', velocity.haha);
                            sonifyHaha.triggerAttackRelease('GB5', '8n', '+0.1', velocity.haha);
                            sonifyHaha.triggerAttackRelease('D5', '8n', '+0.2', velocity.haha);
                            sonifyHaha.triggerAttackRelease('D4', '8n', '+0.3', velocity.haha);
                            sonifyHaha.releaseAll();
                            break;
                        case "wow":
                            refreshPlayer("wow", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(2000); //TODO set Time

                            sonifyWow.triggerAttackRelease('C4', '1n', '+0', velocity.wow);
                            sonifyWow.triggerAttackRelease('E4', '1n', '+0', velocity.wow);
                            sonifyWow.triggerAttackRelease('AB4', '1n', '+0', velocity.wow);
                            sonifyWow.releaseAll();
                            break;
                        case "sad":
                            refreshPlayer("sad", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(2000); //TODO set Time

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
                            refreshPlayer("angry", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(2000); //TODO set Time

                            sonifyAngry.triggerAttackRelease('A4', '1n', '+0', velocity.angry);
                            sonifyAngry.triggerAttackRelease('C5', '1n', '+0', velocity.angry);
                            sonifyAngry.triggerAttackRelease('EB5', '1n', '+0', velocity.angry);
                            sonifyAngry.triggerAttackRelease('GB5', '1n', '+0', velocity.angry);
                            sonifyAngry.releaseAll();
                            break;
                        default:
                    }


                },

                //animals
                playSoundsV2: function (love, haha, wow, sad, angry, reaction) {
                    let trendReaction;
                    let reactionsValue;
                    if (soundON == true) {
                        breaksounds();
                        removePolysynth();
                    }
                    soundON = true;


                    if (reaction != null) {
                        trendReaction = reaction;
                        reactionsValue = {
                            love: 1,
                            haha: 1,
                            wow: 1,
                            sad: 1,
                            angry: 1
                        };
                    }
                    else {
                        trendReaction = reactionTrend(love, haha, wow, sad, angry);
                        reactionsValue = reactionsInPercent(love, haha, wow, sad, angry);
                    }
                    switch (trendReaction) {
                        case "love":
                            currentsong = new Audio("../../sounds/animals/love_doves.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.love;
                            refreshPlayer("love", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(2000); //TODO set Time
                            break;
                        case "haha":
                            currentsong = new Audio("../../sounds/animals/haha_goat.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.haha;
                            refreshPlayer("haha", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(6000); //TODO set Time
                            break;
                        case "wow":
                            currentsong = new Audio("../../sounds/animals/wow_elephant.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.wow;
                            refreshPlayer("wow", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(2000);
                            break;
                        case "sad":
                            currentsong = new Audio("../../sounds/animals/sad_dog.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.sad;
                            refreshPlayer("sad", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(3000); //TODO set Time
                            break;
                        case "angry":
                            currentsong = new Audio("../../sounds/animals/angry_cat.mp3");
                            currentsong.play();
                            currentsong.volume = reactionsValue.angry;
                            refreshPlayer("angry", love, haha, wow, sad, angry);
                            removeCurrentPlaySong(3000);
                            break;
                        default:
                    }
                },

                //Piano + Beat
                playSoundsV3: function (love, haha, wow, sad, angry, reaction) {
                    sonify.beat = new Audio("../../sounds/beat/beat_haha_love_angry_wow_sad.mp3");
                    sonify.love = new Audio("../../sounds/beat/love_beat_piano.mp3");
                    sonify.haha = new Audio("../../sounds/beat/haha_beat_piano.mp3");
                    sonify.wow = new Audio("../../sounds/beat/wow_beat_piano.mp3");
                    sonify.sad = new Audio("../../sounds/beat/sad_beat_piano.mp3");
                    sonify.angry = new Audio("../../sounds/beat/angry_beat_piano.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "beat", "value": 0, "timeMS": 16000, "valueVolume": 0.5, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 2740, "valueVolume": 1, "timeout": 0},
                        {"name": "love", "value": love, "timeMS": 4060, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 2740, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 2740, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 4060, "valueVolume": 1, "timeout": 0},

                    ];
                    let alltimeMS = arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + arrayReactions[5].timeMS + 1000;

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                currentsong_love = sonify.beat;
                                currentsong_love.play();
                                timeouts.push($timeout(function () {
                                    currentsong_love.pause();
                                    currentsong_love.currentTime = 0;
                                }, arrayReactions[2].timeMS));

                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                currentsong_haha = sonify.beat;
                                currentsong_haha.play();
                                timeouts.push($timeout(function () {
                                    currentsong_haha.pause();
                                    currentsong_haha.currentTime = 0;
                                }, arrayReactions[1].timeMS));
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                currentsong_wow = sonify.beat;
                                currentsong_wow.play();
                                timeouts.push($timeout(function () {
                                    currentsong_wow.pause();
                                    currentsong_wow.currentTime = 0;
                                }, arrayReactions[4].timeMS));
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                currentsong_sad = sonify.beat;
                                currentsong_sad.play();
                                timeouts.push($timeout(function () {
                                    currentsong_sad.pause();
                                    currentsong_sad.currentTime = 0;
                                }, arrayReactions[5].timeMS));
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[5].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                currentsong_angry = sonify.beat;
                                currentsong_angry.play();
                                timeouts.push($timeout(function () {
                                    currentsong_angry.pause();
                                    currentsong_angry.currentTime = 0;
                                }, arrayReactions[3].timeMS));
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                        }
                    }
                    else {
                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;

                        let i = 0;
                        let timetmp = 0;
                        sonify.beat.play();
                        timeouts.push($timeout(function () {
                            sonify.beat.pause();
                            sonify.beat.currentTime = 0;
                        }, 16000));

                        for (let reaction of arrayReactions) {
                            if (reaction.name != "beat") {
                                console.log(reaction);
                                console.log("warte " + timetmp + " ms auf " + reaction.name);

                                timeouts.push($timeout(function () {
                                    if (soundON) {
                                        refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                        sonify[reaction.name].play();
                                        sonify[reaction.name].volume = reactionValue[reaction.name];
                                    }
                                    console.log(reactionValue[reaction.name]);

                                }, timetmp));

                                timetmp = timetmp + reaction.timeMS;
                                i++;
                            }
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Instumente
                playSoundsV4_1: function (love, haha, wow, sad, angry, reaction) {
                    let reactionValue;
                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = new Audio("../../sounds/instrument_v2/love_strings_short.mp3");
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(3458);
                                break;
                            case "haha":
                                currentsong = new Audio("../../sounds/instrument_v2/haha_flute_short.mp3");
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(1792);
                                break;
                            case "wow":
                                currentsong = new Audio("../../sounds/instrument_v2/wow_trumpet_short.mp3");
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(1500);
                                break;
                            case "sad":
                                currentsong = new Audio("../../sounds/instrument_v2/sad_bassoons_short.mp3");
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(3854);
                                break;
                            case "angry":
                                currentsong = new Audio("../../sounds/instrument_v2/angry_horns_short.mp3");
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(2896);
                                break;
                        }
                    }
                    else {
                        reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;

                        refreshPlayer("love", love, haha, wow, sad, angry);
                        currentsong_love = new Audio("../../sounds/instrument_v2/love_strings.mp3");
                        currentsong_love.play();
                        currentsong_love.volume = reactionValue.love;

                        timeouts.push($timeout(function () {
                            refreshPlayer("haha", love, haha, wow, sad, angry);
                            console.log("refresh haha")
                        }, 3458));
                        currentsong_haha = new Audio("../../sounds/instrument_v2/haha_flute.mp3");
                        currentsong_haha.play();
                        currentsong_haha.volume = reactionValue.haha;

                        timeouts.push($timeout(function () {
                            refreshPlayer("wow", love, haha, wow, sad, angry);
                            console.log("refresh wow")
                        }, (3458 + 1792)));
                        currentsong_wow = new Audio("../../sounds/instrument_v2/wow_trumpet.mp3");
                        currentsong_wow.play();
                        currentsong_wow.volume = reactionValue.wow;

                        timeouts.push($timeout(function () {
                            refreshPlayer("sad", love, haha, wow, sad, angry);
                            console.log("refresh sad")
                        }, (3458 + 1792 + 1500)));
                        currentsong_sad = new Audio("../../sounds/instrument_v2/sad_bassoons.mp3");
                        currentsong_sad.play();
                        currentsong_sad.volume = reactionValue.sad;

                        timeouts.push($timeout(function () {
                            refreshPlayer("angry", love, haha, wow, sad, angry);
                            console.log("refresh angry")
                        }, (3458 + 1792 + 1500 + 3854)));
                        currentsong_angry = new Audio("../../sounds/instrument_v2/angry_horns.mp3");
                        currentsong_angry.play();
                        currentsong_angry.volume = reactionValue.angry;
                        removeCurrentPlaySong((3458 + 1792 + 1500 + 3854 + 2896));

                    }
                },

                //Instument + Reihenfolge laut to leise
                playSoundsV4_2: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/instrument_v2/love_strings_short.mp3");
                    sonify.haha = new Audio("../../sounds/instrument_v2/haha_flute_short.mp3");
                    sonify.wow = new Audio("../../sounds/instrument_v2/wow_trumpet_short.mp3");
                    sonify.sad = new Audio("../../sounds/instrument_v2/sad_bassoons_short.mp3");
                    sonify.angry = new Audio("../../sounds/instrument_v2/angry_horns_short.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    // wow timeMS : 979
                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 3458, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 1792, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 3854, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 2896, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;
                    sortReactionsLoudToQuiet(arrayReactions);

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Instrument + Reihenfolge leise to laut
                playSoundsV4_3: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/instrument_v2/love_strings_short.mp3");
                    sonify.haha = new Audio("../../sounds/instrument_v2/haha_flute_short.mp3");
                    sonify.wow = new Audio("../../sounds/instrument_v2/wow_trumpet_short.mp3");
                    sonify.sad = new Audio("../../sounds/instrument_v2/sad_bassoons_short.mp3");
                    sonify.angry = new Audio("../../sounds/instrument_v2/angry_horns_short.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    // wow timeMS : 979
                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 3458, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 1792, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 3854, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 2896, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;
                    sortReactionsQuietToLoud(arrayReactions);

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Human Sounds
                playSoundsV5_1: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/humans/love_i_love_you.mp3");
                    sonify.haha = new Audio("../../sounds/humans/haha_child_laugh.mp3");
                    sonify.wow = new Audio("../../sounds/humans/wow_wow.mp3");
                    sonify.sad = new Audio("../../sounds/humans/sad_crying.mp3");
                    sonify.angry = new Audio("../../sounds/humans/angry_yell.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 1500, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Human Sounds + Reihenfolge laut to leise
                playSoundsV5_2: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/humans/love_i_love_you.mp3");
                    sonify.haha = new Audio("../../sounds/humans/haha_child_laugh.mp3");
                    sonify.wow = new Audio("../../sounds/humans/wow_wow.mp3");
                    sonify.sad = new Audio("../../sounds/humans/sad_crying.mp3");
                    sonify.angry = new Audio("../../sounds/humans/angry_yell.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 1500, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;
                    sortReactionsLoudToQuiet(arrayReactions);

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Human Sounds + Reihenfolge leise to laut
                playSoundsV5_3: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/humans/love_i_love_you.mp3");
                    sonify.haha = new Audio("../../sounds/humans/haha_child_laugh.mp3");
                    sonify.wow = new Audio("../../sounds/humans/wow_wow.mp3");
                    sonify.sad = new Audio("../../sounds/humans/sad_crying.mp3");
                    sonify.angry = new Audio("../../sounds/humans/angry_yell.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 1500, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 1500, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;
                    sortReactionsQuietToLoud(arrayReactions);

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Crowd Sounds
                playSoundsV6_1: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/crowd/love_crowd.mp3");
                    sonify.haha = new Audio("../../sounds/crowd/haha_crowd.mp3");
                    sonify.wow = new Audio("../../sounds/crowd/wow_crowd.mp3");
                    sonify.sad = new Audio("../../sounds/crowd/sad_crowd.mp3");
                    sonify.angry = new Audio("../../sounds/crowd/angry_crowd.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 7560, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 3380, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 3380, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 2230, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 3050, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Crowd Sounds + Reihenfolge laut to leise
                playSoundsV6_2: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/crowd/love_crowd.mp3");
                    sonify.haha = new Audio("../../sounds/crowd/haha_crowd.mp3");
                    sonify.wow = new Audio("../../sounds/crowd/wow_crowd.mp3");
                    sonify.sad = new Audio("../../sounds/crowd/sad_crowd.mp3");
                    sonify.angry = new Audio("../../sounds/crowd/angry_crowd.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 7560, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 3380, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 3380, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 2230, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 3050, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;
                    sortReactionsLoudToQuiet(arrayReactions);

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Crowd Sounds + Reihenfolge leise to laut
                playSoundsV6_3: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/crowd/love_crowd.mp3");
                    sonify.haha = new Audio("../../sounds/crowd/haha_crowd.mp3");
                    sonify.wow = new Audio("../../sounds/crowd/wow_crowd.mp3");
                    sonify.sad = new Audio("../../sounds/crowd/sad_crowd.mp3");
                    sonify.angry = new Audio("../../sounds/crowd/angry_crowd.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 7560, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 3380, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 3380, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 2230, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 3050, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;
                    sortReactionsQuietToLoud(arrayReactions);

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Sinus Sounds
                playSoundsV7_1: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/sinus/sine_love_pitch.mp3");
                    sonify.haha = new Audio("../../sounds/sinus/sine_haha_pitch.mp3");
                    sonify.wow = new Audio("../../sounds/sinus/sine_wow_pitch.mp3");
                    sonify.sad = new Audio("../../sounds/sinus/sine_sad_pitch.mp3");
                    sonify.angry = new Audio("../../sounds/sinus/sine_angry_pitch.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 2740, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Sinus Sounds + Reihenfolge laut to leise
                playSoundsV7_2: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/sinus/sine_love_pitch.mp3");
                    sonify.haha = new Audio("../../sounds/sinus/sine_haha_pitch.mp3");
                    sonify.wow = new Audio("../../sounds/sinus/sine_wow_pitch.mp3");
                    sonify.sad = new Audio("../../sounds/sinus/sine_sad_pitch.mp3");
                    sonify.angry = new Audio("../../sounds/sinus/sine_angry_pitch.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 2740, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;
                    sortReactionsLoudToQuiet(arrayReactions);

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                //Sinus Sounds + Reihenfolge leise to laut
                playSoundsV7_3: function (love, haha, wow, sad, angry, reaction) {
                    sonify.love = new Audio("../../sounds/sinus/sine_love_pitch.mp3");
                    sonify.haha = new Audio("../../sounds/sinus/sine_haha_pitch.mp3");
                    sonify.wow = new Audio("../../sounds/sinus/sine_wow_pitch.mp3");
                    sonify.sad = new Audio("../../sounds/sinus/sine_sad_pitch.mp3");
                    sonify.angry = new Audio("../../sounds/sinus/sine_angry_pitch.mp3");

                    if (soundON == true) {
                        removePolysynth();
                        breaksounds();
                    }
                    soundON = true;

                    arrayReactions = [
                        {"name": "love", "value": love, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "wow", "value": wow, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "haha", "value": haha, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "sad", "value": sad, "timeMS": 2060, "valueVolume": 1, "timeout": 0},
                        {"name": "angry", "value": angry, "timeMS": 2740, "valueVolume": 1, "timeout": 0}
                    ];
                    let alltimeMS = arrayReactions[0].timeMS + arrayReactions[1].timeMS + arrayReactions[2].timeMS + arrayReactions[3].timeMS + arrayReactions[4].timeMS + 1000;
                    sortReactionsQuietToLoud(arrayReactions);

                    if (reaction != null) {
                        switch (reaction) {
                            case "love":
                                currentsong = sonify.love;
                                currentsong.play();
                                refreshPlayer("love", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[0].timeMS);
                                break;
                            case "haha":
                                currentsong = sonify.haha;
                                currentsong.play();
                                refreshPlayer("haha", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[1].timeMS);
                                break;
                            case "wow":
                                currentsong = sonify.wow;
                                currentsong.play();
                                refreshPlayer("wow", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[2].timeMS);
                                break;
                            case "sad":
                                currentsong = sonify.sad;
                                currentsong.play();
                                refreshPlayer("sad", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[3].timeMS);
                                break;
                            case "angry":
                                currentsong = sonify.angry;
                                currentsong.play();
                                refreshPlayer("angry", love, haha, wow, sad, angry);
                                removeCurrentPlaySong(arrayReactions[4].timeMS);
                                break;
                        }
                    }
                    else {


                        let reactionValue = reactionsInPercent(love, haha, wow, sad, angry);
                        switch (reactionTrend(love, haha, wow, sad, angry)) {
                            case "love":
                                reactionValue.haha = reactionValue.haha / reactionValue.love;
                                reactionValue.wow = reactionValue.wow / reactionValue.love;
                                reactionValue.sad = reactionValue.sad / reactionValue.love;
                                reactionValue.angry = reactionValue.angry / reactionValue.love;
                                reactionValue.love = 1;
                                break;
                            case "haha":
                                reactionValue.love = reactionValue.love / reactionValue.haha;
                                reactionValue.wow = reactionValue.wow / reactionValue.haha;
                                reactionValue.sad = reactionValue.sad / reactionValue.haha;
                                reactionValue.angry = reactionValue.angry / reactionValue.haha;
                                reactionValue.haha = 1;
                                break;
                            case "wow":
                                reactionValue.haha = reactionValue.haha / reactionValue.wow;
                                reactionValue.love = reactionValue.love / reactionValue.wow;
                                reactionValue.sad = reactionValue.sad / reactionValue.wow;
                                reactionValue.angry = reactionValue.angry / reactionValue.wow;
                                reactionValue.wow = 1;
                                break;
                            case "sad":
                                reactionValue.haha = reactionValue.haha / reactionValue.sad;
                                reactionValue.wow = reactionValue.wow / reactionValue.sad;
                                reactionValue.love = reactionValue.love / reactionValue.sad;
                                reactionValue.angry = reactionValue.angry / reactionValue.sad;
                                reactionValue.sad = 1;
                                break;
                            case "angry":
                                reactionValue.haha = reactionValue.haha / reactionValue.angry;
                                reactionValue.wow = reactionValue.wow / reactionValue.angry;
                                reactionValue.sad = reactionValue.sad / reactionValue.angry;
                                reactionValue.love = reactionValue.love / reactionValue.angry;
                                reactionValue.angry = 1;
                                break;
                        }
                        ;
                        let i = 0;
                        let timetmp = 0;
                        for (let reaction of arrayReactions) {
                            console.log(reaction);
                            console.log("warte " + timetmp + " ms auf " + reaction.name);

                            timeouts.push($timeout(function () {
                                if (soundON) {
                                    refreshPlayer(reaction.name, love, haha, wow, sad, angry);
                                    sonify[reaction.name].play();
                                    sonify[reaction.name].volume = reactionValue[reaction.name];
                                }
                                console.log(timetmp);

                            }, timetmp));

                            timetmp = timetmp + reaction.timeMS;
                            i++;
                        }
                        removeCurrentPlaySong(alltimeMS);
                    }
                },

                stopPlaying: function () {
                    if (soundON) {
                        removePolysynth();
                        breaksounds();
                        removeCurrentPlaySong(0);
                    }
                }


            }
        }]);

