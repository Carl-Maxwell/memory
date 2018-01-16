
document.addEventListener("DOMContentLoaded", function(event) {
  window.WIDTH  = 800;
  window.HEIGHT = 600;

  window.CARD_SCALE  = 0.80;
  window.CARD_WIDTH  = 140 * CARD_SCALE;
  window.CARD_HEIGHT = 190 * CARD_SCALE;

  // TODO load one of the cards and grab CARD_WIDTH &c from it

  window.app = new PIXI.Application({ width: WIDTH, height: HEIGHT });

  app.view.style = "margin: 0 auto; display: block;";

  document.body.appendChild(app.view);

  window.cards = [];

  window.SUITS = ['spade', 'club', 'diamond', 'heart'];

  setup_game();
});

function setup_game() {
  var suit_choices = [];

  for (var i = 0; i < 6*3/2; i++) {
    suit = random_suit();
    suit_choices.push(suit);
    suit_choices.push(suit);
  }

  suit_choices = shuffle(suit_choices);

  // setup the game elements
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 6; j++) {
      var card = new Card(app, cards, suit_choices.pop());

      card.sprite.x = 10 + j * (CARD_WIDTH  + 20);
      card.sprite.y = 10 + i * (CARD_HEIGHT + 20);
    }
  }
}

//
// Card class
//

function Card(app, cards, value) {
  this.value        = value;
  this.back_texture = PIXI.Texture.fromImage(asset_path('blue_back'));
  this.face_texture = PIXI.Texture.fromImage(asset_path(value));

  this.sprite = new PIXI.Sprite(this.back_texture);

  this.sprite.interactive = true;
  this.sprite.buttonMode  = true;

  this.sprite.scale.x = CARD_SCALE;
  this.sprite.scale.y = CARD_SCALE;

  this.sprite.on('pointerdown', onClick);

  this.sprite.card_index = cards.length;
  cards.push(this);

  app.stage.addChild(this.sprite);
}

Card.prototype.flip = function() {
  if (this.is_revealed()) {
    this.sprite.texture = this.back_texture;
  } else {
    this.sprite.texture = this.face_texture;
  }
}

Card.prototype.is_revealed = function() {
  return this.sprite.texture != this.back_texture;
}

Card.prototype.destroy = function() {
  // this.back_texture.destroy();
  // this.face_texture.destroy();
  this.sprite.destroy();
}

//
//
//

function random_suit() {
  // TODO check this math
  return SUITS[Math.round(Math.random() * SUITS.length - 0.5)];
}

function onClick (click_event) {
  var revealed = get_revealed();
  if (revealed.length > 1) {
    return;
  }

  var sprite = click_event.target;

  card = cards[sprite.card_index];

  card.flip();

  setTimeout(check_for_match, 800);
}

function get_revealed() {
  var revealed = [];
  for (var i = 0; i < cards.length; i++) {
    if (cards[i] && cards[i].is_revealed()) {
      revealed.push(i);
    }
  }

  return revealed;
}

function check_for_match() {
  var revealed = get_revealed();

  if (revealed.length == 2) {
    a = revealed[0];
    b = revealed[1];
    if (cards[a].value == cards[b].value) {
      cards[a].destroy();
      cards[b].destroy();

      cards[a] = null;
      cards[b] = null;

      if (is_game_over()) {
        setup_game();
      }
    } else {
      cards[a].flip();
      cards[b].flip();
    }
  }
}

function is_game_over() {
  for (var i = 0; i < cards.length; i++) {
    if (cards[i]) {
      return false;
    }
  }

  return true;
}

//
//  Fisher-Yates shuffle according to internet
//

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
