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
var text1, text2;

var skatle = [];
var container;
var input;

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
  arrow1 = this.add.image(300, 200, 'arrow');
  arrow1.depth = 50;
  arrow1.setScrollFactor(0, 0);

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
    novaSkatla: KeyCodes.SPACE, // definiramo se tipko presledek, in tipko poimenujemo novaSkatla
    premakniContainer: KeyCodes.E,
    enter: KeyCodes.ENTER,
  }, false, false);
  window.definiraneTipke = definiraneTipke;

  definiraneTipke.novaSkatla.addListener('down', () => {
    var enaSkatla = this.physics.add.image(arrow2.x, arrow2.y, 'block');
    // Skatli nastavimo hitrost 500 in njen vektor hitrosti zavrtimo za nakljucno stopinj od 0 do 360
    enaSkatla.setScale(0.4);
    enaSkatla.setVelocity(Math.random()*500, 0);
    enaSkatla.body.velocity.rotate(Math.random() * 360);

    // Zapomnimo si spremenljivko enaSkatla tako, da jo potisnemo v seznam skatle
    skatle.push(enaSkatla);

  });

  // Nastavimo naj bo puščica na vrhu
  // Vsi objekti imajo privzeto globino 0.
  // večja številka pomeni bližje nas, manjša pa globlje v ekranu
  arrow2.depth = 1;


  // Povejmo kameri, naj sledi naši puščici (arrow2)
  var zaokrozujTocke = false;
  this.cameras.main.startFollow(arrow2, zaokrozujTocke, 0.08, 0.08);

  // Kameri povemo, da naj malo po-zooma :)
  // 1 je naravna velikost
  // Več kot 1 je povečava
  // Manj kot 1, npr. 0.5 je pomanjšanje
  this.cameras.main.setZoom(1.5);

  // V sceno dodamo tekstovni objekt
  // Povemo na katerih koordinatah naj prične, kaj naj izpiše
  // Neobvezno lahko povemu tudi kater font, barvo in velikost želimo
  // Več o tekstovnih objektih lahko preberemu tu:
  // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html
  text1 = this.add.text(100, 100, "Pozdravljeni ^_^", {
    fontFamily: 'Arial',
    color: 'orange',
    fontSize: 30,
  });

  // Dodajmo še en tekstovni objekt, ki sledi puščici2
  // Glej v funkciji update
  text2 = this.add.text(100, 100, "(sledim puščici)", {
    fontFamily: 'Arial',
    color: 'lightblue',
    fontSize: 20,
    align: 'center',
  });

  // Container vsebuje več objektov igre in z njegovo pomočjo lahko vse objekte naenkrat
  // premikamo, skrivamo, rotiramo, itd...
  // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html
  container = this.add.container(100, 100);
  container.add(this.add.text(50, 50, "Tekst v container-ju 1", {
    fontFamily: 'Arial', color: 'yellow', fontSize: 14,
  }));
  container.add(this.add.text(50, 70, "Tekst v container-ju 2", {
    fontFamily: 'Arial', color: 'yellow', fontSize: 14,
  }));
  container.add(this.add.text(50, 90, "Tekst v container-ju 3", {
    fontFamily: 'Arial', color: 'yellow', fontSize: 14,
  }));


  // Dodamo input v HTML
  input = window.document.createElement("input");
  input.type = "text";
  input.placeholder = "Vpisi tekst...";
  input.style.position = "absolute";
  input.style.left = "20px";
  input.style.top = "20px";
  input.addEventListener("focus", () => {
    console.log("focus");
    for (var k in definiraneTipke) definiraneTipke[k].enabled = false;
  });
  input.addEventListener("blur", () => {
    console.log("blur");
    for (var k in definiraneTipke) definiraneTipke[k].enabled = true;
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      input.value = "";
      input.blur();
    }
  });
  window.document.body.appendChild(input);

  definiraneTipke.enter.addListener('down', () => {
    input.focus();
  });

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

  // Pozicioniramo text2 na koordinate puščice (arrow2)
  // Po x osi moramo odšteti polovico širine teksta
  // Po y osi prištejema nekaj malega, da se ne prekriva s puščico
  text2.setPosition(arrow2.x -text2.width/2, arrow2.y +30);

  // Nastavimo kaj text2 izpisuje
  // Želimo izpisati pozicijo in smer puščice
  // Vrednosti zaokrožimo s pomočjo funkcije Math.round()
  text2.setText(
    "Pos: "+Math.round(arrow2.x)+", "+Math.round(arrow2.y)+"\n"+
    "Angle: "+Math.round(arrow2.angle)
  );


  if (definiraneTipke.premakniContainer.isDown) {
    container.x += 3;
    container.angle += 5;
  }
}
// *** KONEC FUNKCIJE UPDATE ***
