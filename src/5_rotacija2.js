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
var definiraneTipke;

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


  // v spremenljivko KeyCodes si shranimo tipke ki so na voljo v Phaser 3:
  // https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyCodes.html
  var KeyCodes = Phaser.Input.Keyboard.KeyCodes;

  // Definiramo, katero akcijo nam predstavlja katera od tipk
  definiraneTipke = this.input.keyboard.addKeys({
    pojdiNaprej: KeyCodes.UP,
    pojdiNazaj: KeyCodes.DOWN,
    zavijLevo: KeyCodes.LEFT,
    zavijDesno: KeyCodes.RIGHT,
  });

  // Povejmo kameri, naj sledi naši puščici (arrow2)
  var zaokrozujTocke = false;
  this.cameras.main.startFollow(arrow2, zaokrozujTocke, 0.08, 0.08);

  // Kameri povemo, da naj malo po-zooma :)
  // 1 je naravna velikost
  // Več kot 1 je povečava
  // Manj kot 1, npr. 0.5 je pomanjšanje
  this.cameras.main.setZoom(1.5);

}
// *** KONEC FUNKCIJE CREATE ***


// *** ZAČETEK FUNKCIJE UPDATE ***
function update() {
  // Funkcija update se razlikuje od zgornjih dveh. Zgornji dve se izvedeta samo enkrat na začetku,
  // ta pa se izvaja večkrat vsako sekundo.
  // Funkcijo update uporabljamo za krmiljenje dogajanja igre.


  // Katere informacije lahko izvemo o definiranih tipkah:
  // https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.Key.html

  // Ali je tipka, ki smo povedali, da nam pomeni akcijo pojdiNaprej pritisnjena (dol)
  if (definiraneTipke.pojdiNaprej.isDown) {

    // Namesto premikanja po osi x moramo puščico premikati v smeri njene rotacije oz. kota
    // Na voljo imamo:
    // arrow2.angle - kot v stopinjah
    // arrow2.rotation - kot v radianih (2*PI = 360 stopinj)

    // Ustvarimo 2D vektor dolžine 400, ki kaže naravnost v desno smer (v smeri osi x)
    var vektorPremikanja = new Phaser.Math.Vector2(400, 0);

    // vektorPremikanja zavrtimo glede na rotacijo naše slike
    vektorPremikanja.rotate(arrow2.rotation);

    // Nastavimo hitrost premikanja po komponentah x in y izračunanega vektorja
    arrow2.body.setVelocity(vektorPremikanja.x, vektorPremikanja.y);
    // Ali pa puščici kar nastavimo vektor hitrosti:
    // arrow2.body.velocity = vektorPremikanja;

  } else if (definiraneTipke.pojdiNazaj.isDown) {

    // Enako naredimo za premikanje nazaj, le da vektor premikanja zavrtimo za 180 stopinj oz. PI radianov
    var vektorPremikanja = new Phaser.Math.Vector2(400, 0);
    vektorPremikanja.rotate(arrow2.rotation + Math.PI);
    arrow2.body.velocity = vektorPremikanja;

    // Več o delu z 2D vektorjih preberemo tu:
    // https://photonstorm.github.io/phaser3-docs/Phaser.Math.Vector2.html

  } else {
    // Če tipka naprej ali nazaj nista pritisnjeni, nastavimo hitrost premikanja na nič.
    arrow2.setVelocity(0, 0);
  }

  if (definiraneTipke.zavijLevo.isDown) {
    // Rotiramo levo
    arrow2.angle -= 5;
  } else if (definiraneTipke.zavijDesno.isDown) {
    // Rotiramo desno
    arrow2.angle += 5;
  }

}
// *** KONEC FUNKCIJE UPDATE ***
