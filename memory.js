
document.addEventListener("DOMContentLoaded", function(event) {
  window.WIDTH  = 800;
  window.HEIGHT = 600;

  window.CARD_SCALE  = 0.80;
  window.CARD_WIDTH  = 140 * CARD_SCALE;
  window.CARD_HEIGHT = 190 * CARD_SCALE;

  var app = new PIXI.Application({ width: WIDTH, height: HEIGHT });

  app.view.style = "margin: 0 auto; display: block;"

  document.body.appendChild(app.view);

  window.cards = [];

  window.SUITS = ['spade', 'club', 'diamond', 'heart'];

  var suit_choices = [];

  for (var i = 0; i < 6*3/2; i++) {
    suit = random_suit();
    suit_choices.push(suit);
    suit_choices.push(suit);
  }

  suit_choices = shuffle(suit_choices);

  // setup the game elements
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 3; j++) {
      var card = {};

      card.sprite = PIXI.Sprite.fromImage(asset_path(suit_choices.pop()));

      card.sprite.interactive = true;
      card.sprite.buttonMode = true;

      card.sprite.x = 10 + i * (CARD_WIDTH + 20);
      card.sprite.y = 10 + j * (CARD_HEIGHT + 20);

      card.sprite.scale.x = CARD_SCALE;
      card.sprite.scale.y = CARD_SCALE;

      card.sprite.on('pointerdown', onClick);

      card.sprite.card_index = cards.length - 1;

      app.stage.addChild(card.sprite);

      cards.push(card);
    }
  }
});

function random_suit() {
  // TODO check this math
  return SUITS[Math.round(Math.random() * SUITS.length - 0.5)];
}

function onClick (click_event) {
  var sprite = click_event.target;

  card = cards[sprite.card_index];

  sprite.scale.x *= 0.25;
  sprite.scale.y *= 0.25;
}

//  Fisher-Yates shuffle according to internet

function shuffle(input_array) {
  var array = input_array;

  var i    = 0;
  var j    = 0;
  var temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));

    temp     = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

//
//
//

function asset_path(name) {
  var sprite_names = {
    red_back  : "15686-illustration-of-a-play-card-back-ve.svg",
    blue_back : "15687-illustration-of-a-play-card-back-ve.svg",
    spade     : "15701-illustration-of-a-two-of-spades-playing-card-ve.svg",
    diamond   : "15730-illustration-of-an-ace-of-diamonds-playing-card-ve.svg",
    heart     : "15709-illustration-of-a-nine-of-hearts-playing-card-ve.svg",
    club      : "15740-illustration-of-a-four-of-clubs-playing-card-ve.svg"
  };

  return "assets/" + sprite_names[name];
}
