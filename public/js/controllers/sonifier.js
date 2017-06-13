function reactionInPercent(reaction, total) {
  var reactionInPercent = reaction / total;
  return reactionInPercent;
}

function reactionsInPercent(love, haha, wow, sad, angry) {
  var total = love + wow + haha + sad + angry;
  var love = reactionInPercent(love, total) + ''
  var wow = reactionInPercent(wow, total) + ''
  var haha = reactionInPercent(haha, total) + ''
  var sad = reactionInPercent(sad, total) + ''
  var angry = reactionInPercent(angry, total) + ''
  var reactionsInPercent = {
    love: love,
    wow: wow,
    haha: haha,
    sad: sad,
    angry: angry
  };
  return reactionsInPercent;
}
function sortReactions (arrayReactions) {
arrayReactions.sort(function (a, b) {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
});
}
function percentToMidiValue(reactionsInPercent) {
  var midiValues = {
    love: reactionsInPercent.love * 255,
    wow: reactionsInPercent.wow * 255,
    haha: reactionsInPercent.haha * 255,
    sad: reactionsInPercent.sad * 255,
    angry: reactionsInPercent.angry * 255
  };
  return midiValues;
}

function getDurationFromReactions(love, haha, wow, sad, angry) {
  var total = love + wow + haha + sad + angry;
  var duration = 5 / total;
  return duration;
}

function reactionTrend(love, haha, wow, sad, angry) {
  var reaction;

  if (love > wow && love > haha && love > sad && love > angry) {
    reaction = "love";
  } else if (wow > love && wow > haha && wow > sad && wow > angry) {
    reaction = "wow";
  } else if (haha > love && haha > wow && haha > sad && haha > angry) {
    reaction = "haha";
  } else if (sad > love && sad > haha && sad > wow && sad > angry) {
    reaction = "sad";
  } else if (angry > love && angry > haha && angry > wow && angry > sad) {
    reaction = "angry";
  }
  return reaction;
}
