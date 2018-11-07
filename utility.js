'use strict';

// Rough analogue of MER's UTILITY.PAS unit for Javascript

const crt = require('./crt.js');

const styles = {
  none:   '         ',
  ascii:  '+-+| |+-+',
  single: '┌─┐│ │└─┘',
  double: '╔═╗║ ║╚═╝',
  sindub: '╓─╖║ ║╙─╜',
  dubsin: '╒═╕│ │╘═╛'
};

const shades = ' ░▒▓█';

const themes = {
  cua: { menu: { bg: crt.Blue, fg: crt.Yellow, style: styles.single } },
  novell: {},
  borland: {}
};

function box(x,y,h,w,style,bg,fg) {
  crt.Buffer(true);
  if (typeof bg !== 'undefined') {
    crt.TextBackground(bg); 
  }
  if (typeof fg !== 'undefined') {
    crt.TextColor(fg); 
  }
  crt.GotoXY(x,y);
  crt.Write(style[0]+style[1].repeat(w)+style[2]);
  for (let line = 1; line < h; line++) {
    crt.GotoXY(x,y+line);
    crt.Write(style[3]+style[4].repeat(w)+style[5]);
  }
  crt.GotoXY(x,y+h);
  crt.Write(style[6]+style[7].repeat(w)+style[8]);
  crt.Flush();
}

function fillchar(x,y,h,w,ch,bg,fg) {
  crt.Buffer(true);
  if (typeof bg !== 'undefined') {
    crt.TextBackground(bg); 
  }
  if (typeof fg !== 'undefined') {
    crt.TextColor(fg); 
  }
  for (let line = y; line < y+h; line++) {
    crt.Write(ch.repeat(w));
  }
  crt.Flush();
}

module.exports = {
  styles,
  shades,
  themes,
  box,
  fillchar
};

