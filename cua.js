'use strict';

const crt = require('./crt.js');
const utility = require('./utility.js');

function menu(items,theme) {
  crt.GotoXY(0,0);
  crt.TextBackground(theme.menu.bg);
  crt.TextColor(theme.menu.fg);
  crt.MouseOn();
  for (let item = 0; item < items[0].length; item++) {
    crt.Write(' '+items[0][item].title+' ');
  }
  crt.MouseOff();
}

module.exports = {
  menu
};

