'use strict';

// rough analogue of Turbo Pascal CRT unit in Javascript

const tty = require('tty');
const ansi = require('ansi')(process.stdout);

const Black = { name: 'black', tp: 0, ansi: ansi.black };
const Blue = { name: 'blue', tp: 1, ansi: ansi.blue };
const Green = { name: 'green', tp: 2, ansi: ansi.green };
const Cyan = { name: 'cyan', tp: 3, ansi: ansi.cyan };
const Red = { name: 'red', tp: 4, ansi: ansi.red };
const Magenta = { name: 'magenta', tp: 5, ansi: ansi.magenta };
const Brown = { name: 'yellow', tp: 6, ansi: ansi.yellow };
const LightGray = { name: 'grey', tp: 7, ansi: ansi.grey };
const DarkGray = { name: 'brightBlack', tp: 8, ansi: ansi.brightBlack };
const LightBlue = { name: 'brightBlue', tp: 9, ansi: ansi.brightBlue };
const LightGreen = { name: 'brightGreen', tp: 10, ansi: ansi.brightGreen };
const LightCyan = { name: 'brightCyan', tp: 11, ansi: ansi.brightCyan };
const LightRed = { name: 'brightRed', tp: 12, ansi: ansi.brightRed };
const LightMagenta = { name: 'brightMagenta', tp: 13, ansi: ansi.brightMagenta };
const Yellow = { name: 'brightYellow', tp: 14, ansi: ansi.brightYellow };
const White = { name: 'brightWhite', tp: 15, ansi: ansi.brightWhite };
const Blink = { name: 'inverse', tp: 128, ansi: ansi.inverse };

const bw40 = 0;
const co40 = 1;
const bw80 = 2;
const co80 = 3;
const mono = 7;

const TextChar = ' ';
const ScreenWidth = process.stdout.getWindowSize()[0];
const ScreenHeight = process.stdout.getWindowSize()[1];
const WindMin = 0;
const WindMax = (ScreenHeight*256)+ScreenWidth;

let CheckBreak = false;
let CheckEOF = false;
let CheckSnow = false;

let TextAttr = LightGray;
let DirectVideo = true;
let LastMode = co80;

// internal functions

function ttyRaw(mode) {
  if (process.stdin.setRawMode) {
    process.stdin.setRawMode(mode);
  } else {
    tty.setRawMode(mode);
  }
}

function cursorPosition() {
  // listen for the queryPosition report on stdin
  process.stdin.resume();
  ttyRaw(true);

  process.stdin.once('data', function (b) {
    var match = /\[(\d+)\;(\d+)R$/.exec(b.toString());
    if (match) {
      let xy = match.slice(1, 3).reverse().map(Number);
      console.error(xy);
    }

    // cleanup and close stdin
    ttyRaw(false);
    process.stdin.pause();
  });

  // send the query position request code to stdout
  ansi.queryPosition();
  return { x: 1, y: 1};
}

// nops

function AssignCrt(f) {
  return f;
}

function Delay(DTime) {
  return DTime;
}

function NoSound() {
  return false;
}

// cursor functions

function BigCursor() {
  return true;
}

function CursorOff() {
  ansi.hide();
  return false;
}

function CursorOn() {
  ansi.show();
  return true;
}

function GotoXY(x,y) {
  return ansi.goto(x,y);
}

function WhereX() {
  return cursorPosition.x;
}

function WhereY() {
  return cursorPosition.y;
}

function Window(x1,y1,x2,y2) {
  return true;
}

// clearing

function ClrEol() {
  return true;
}

function ClrScr() {
  function lf() { return '\n'; };
  ansi.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(lf).join(''))
  .eraseData(2)
  .goto(1, 1)
  return true;
}

function DelLine() {
  return true;
}

function InsLine() {
  return true;
}

// colour functions

function HighVideo() {
  return TextAttr;
}

function LowVideo() {
  return TextAttr;
}

function NormVideo() {
  ansi.reset(); 
  return TextAttr = LightGray;
}

function TextBackground(cl) {
  ansi.bg[cl.name]();
  return TextAttr = cl; //!
}

function TextColor(cl) {
  ansi.fg[cl.name]();
  return TextAttr = cl; //!
}

// sound functions

function Sound(hz) {
  return ansi.beep();
}

// keyboard functions

function KeyPressed() {
  return false;
}

function ReadKey() {
  return ch;
}

// helper functions

function Write(s) {
  return ansi.write(s);
}

function WriteLn(s) {
  return ansi.write(s+'\n');
}

function Buffer(b) {
  return ansi.buffering = b;
}

function Flush() {
  return ansi.flush();
}

module.exports = {
  Black,
  Blue,
  Green,
  Red,
  Cyan,
  Magenta,
  Brown,
  LightGray,
  DarkGray,
  LightBlue,
  LightGreen,
  LightCyan,
  LightMagenta,
  Yellow,
  White,
  ClrScr,
  CursorOn,
  CursorOff,
  BigCursor,
  GotoXY,
  WhereX,
  WhereY,
  TextColor,
  TextBackground,
  NormVideo,
  Sound,
  NoSound,
  Write,
  WriteLn,
  Buffer,
  Flush
};

