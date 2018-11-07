'use strict';

const crt = require('../crt.js');

let s = '';
for (let y = 0; y < 24 ; y++) {
  for (let x = 0; x < 79 ; x++) {
    crt.GotoXY(x,y);
    s += crt.GetCh();
  }
}
console.log(s);
