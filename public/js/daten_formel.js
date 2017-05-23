function reactionInProcent(reaction, total) {
  const reactioninProcent = reaction / total;
  return reactioninProcent;
}

function reactionTrend(love, wow, haha, sad, angry) {
  let reaction;

  if (love > wow && love > haha && love > sad && love > angry) {
    reaction = 'love';
  } else if (wow > love && wow > haha && wow > sad && wow > angry) {
    reaction = 'wow';
  } else if (haha > love && haha > wow && haha > sad && haha > angry) {
    reaction = 'haha';
  } else if (sad > love && sad > haha && sad > wow && sad > angry) {
    reaction = 'sad';
  } else if (angry > love && angry > haha && angry > wow && angry > sad) {
    reaction = 'angry';
  }
  return reaction;
}

function reactionTrendValue(love, wow, haha, sad, angry) {
  let value;
  const total = love + wow + haha + sad + angry;
  love = reactionInProcent(love, total);
  wow = reactionInProcent(wow, total);
  haha = reactionInProcent(haha, total);
  sad = reactionInProcent(sad, total);
  angry = reactionInProcent(angry, total);

  if (love > wow && love > haha && love > sad && love > angry) {
    value = love - (0.9 * wow) - (0.9 * angry) + (0.1 * haha) + (0.1 * sad);
  } else if (wow > love && wow > haha && wow > sad && wow > angry) {
    value = wow - (0.9 * love) - (0.9 * sad) + (0.1 * angry) + (0.1 * haha);
  } else if (haha > love && haha > wow && haha > sad && haha > angry) {
    value = haha - (0.9 * sad) - (0.9 * angry) + (0.1 * love) + (0.1 * wow);
  } else if (sad > love && sad > haha && sad > wow && sad > angry) {
    value = sad - (0.9 * angry) - (0.9 * love) + (0.1 * haha) + (0.1 * wow);
  } else if (angry > love && angry > haha && angry > wow && angry > sad) {
    value = angry - (0.9 * love) - (0.9 * haha) + (0.1 * sad) + (0.1 * wow);
  }
  return value;
}

console.log(`${reactionTrendValue(0, 0, 0, 1, 9)}% ${reactionTrend(0, 0, 0, 1, 9)}`);
