import * as Phaser from 'phaser';

// Pripravimo konfiguracijo Phaser 3 igre
// Na spodnji povezavi so možne lastnosti igre, ki jih lahko definiramo:
// https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
var gameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

// Ustvarimo Phaser igro z zgornjo konfiguracijo
var game = new Phaser.Game(gameConfig);

// Za namene primerov, bomo tukaj definirali nekaj spremenljivk, ki nam bodo dostopne v vseh spodnjih funkcijah
// Na projektu World of PTR imamo objekt wop, na katerega pripenjamo svoje objekte
var scene;
var arrow1, arrow2;
var blocks = [];

// *** ZAČETEK FUNKCIJE PRELOAD ***
function preload() {
  // Funkcija preload se izvede najprej.
  // V njej definiramo katere slike, zvoke in animacije bomo uporabljali.

  // NOTE:
  // Objekt this v vseh treh funkcijah - preload, create in update predstavlja sceno igro.
  // Kaj omogoča Phaser scena, lahko pogledamo na povezavi:
  // https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html

  // V projektu World of PTR smo ta this shranili v spremenljivko wop.scene

  // Povemo knjižnici Phaser, v kateri mapi imamo slike, zvoke in animacije
  this.load.setBaseURL('/img');

  // Povemo knjižnici Phaser, naj naloži sliko arrow.png, in si njeno vsebino zapomni pod imenom 'arrow'
  this.load.image('arrow', 'arrow.png');

  // Naložimo še sliko block.png z imenom 'block'
  this.load.image('block', 'block.png');

}
// *** KONEC FUNKCIJE PRELOAD ***


// *** ZAČETEK FUNKCIJE CREATE ***
function create() {
  // Funkcija create se izvede malo kasneje, ko je vse iz preload že naloženo
  // V njej lahko v sceno igre postavimo objekte, ki uporabljajo prej naložene slike, zvoke in animacije.


  // Ustvarimo slikovni objekt (image).
  // Na začetku naj bo na poziciji x=200, y=200. Uporabimo pa naloženo sliko z imenom 'arrow'
  arrow1 = this.add.image(200, 200, 'arrow');

  // Ustvarimo slikovni objekt, vendar dodatno podpira fiziko.
  arrow2 = this.physics.add.image(300, 200, 'arrow');

}
// *** KONEC FUNKCIJE CREATE ***


// *** ZAČETEK FUNKCIJE UPDATE ***
function update() {
  // Funkcija update se razlikuje od zgornjih dveh. Zgornji dve se izvedeta samo enkrat na začetku,
  // ta pa se izvaja večkrat vsako sekundo.
  // Funkcijo update uporabljamo za krmiljenje dogajanja igre.


}
// *** KONEC FUNKCIJE UPDATE ***
