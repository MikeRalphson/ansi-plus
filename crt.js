'use strict';

// rough analogue of Turbo Pascal CRT unit in Javascript

const tty = require('tty');
let ansi = require('ansi')(process.stdout);
ansi.prefix = '\x1b'; // for convenience

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

async function cursorPosition() { // needs async / await
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
  return { x: 1, y: 1 };
}

function AssignCrt(f) {
  ansi = require('ansi')(f);
  ansi.prefix = '\x1b'; // reinstate here too
  return ansi;
}

const Delay = ms => new Promise(res => setTimeout(res, ms));

function NoSound() {
  return false;
}

// cursor functions

function BigCursor() {
/* Sequence: CSI = Pn1 ; Pn2 C
Description: Set cursor parameters

Sets cursor parameters (where Pn1 is the starting and Pn2 is the
ending scanlines of the cursor).

Source: UnixWare 7 display(7)
Status: SCO private */
  ansi.show();
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

async function WhereX() {
  return await cursorPosition().x;
}

async function WhereY() {
  return await cursorPosition().y;
}

function Window(x1,y1,x2,y2) {
  // x values are ignored (scrolls whole lines)
  return ansi.write(ansi.prefix+'['+y1+';'+y2+'r');
}

// clearing

function ClrEol() {
  return ansi.write(ansi.prefix+'[K');
}

function ClrScr() {
  function lf() { return '\n'; };
  ansi.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(lf).join(''))
  .eraseData(2)
  .goto(1, 1)
  return true;
}

function DelLine(count) {
  if (typeof count === 'undefined') count = '';
  return ansi.write(ansi.prefix+'[P'+count+'M');
}

function InsLine(count) {
  if (typeof count === 'undefined') count = '';
  return ansi.write(ansi.prefix+'[P'+count+'L');
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
  return TextAttr = cl;
}

function TextColor(cl) {
  ansi.fg[cl.name]();
  return TextAttr = cl;
}

// sound functions

function Sound(hz) {
  return ansi.beep();
}

// keyboard functions

const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', (k) => {
    process.stdin.setRawMode(false);
    resolve(k.toString('utf8'));
  }));
}

function KeyPressed() {
  return false;
}

async function ReadKey() {
  return await keypress();
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

function Title(s) {
  ansi.write(ansi.prefix+']0;'+s+ansi.prefix+'\\');
}

function Link(url,text) {
  // see https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
  if (!text) text = url;
  ansi.write(ansi.prefix+']8;;'+url+ansi.prefix+'\\'+text+ansi.prefix+']8;;'+ansi.prefix+'\\');
}

function Save() {
  return ansi.write(ansi.prefix+'[?47h');
}

function Restore() {
  return ansi.write(ansi.prefix+'[?47l');
}

function AltOn() {
  return ansi.write(ansi.prefix+'[?1049h');
}

function AltOff() {
  return ansi.write(ansi.prefix+'[?1049l');
}

function MouseOn() {
  return ansi.write(ansi.prefix+'[?1000h');
}

function MouseOff() {
  return ansi.write(ansi.prefix+'[?1000l');
}

function GetCh() {
  // doesn't look to be widely supported
  ansi.write(ansi.prefix+'5');
  return '';
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
  ReadKey,
  TextColor,
  TextBackground,
  NormVideo,
  Sound,
  NoSound,
  Write,
  WriteLn,
  Buffer,
  Flush,
  Title,
  Link,
  Save,
  Restore,
  AltOn,
  AltOff,
  MouseOn,
  MouseOff,
  GetCh
};

