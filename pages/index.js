import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

const TEAMS = {
  Mike:    ['Scottie Scheffler','Patrick Cantlay','Patrick Reed','Hideki Matsuyama','Nicolai Højgaard','David Puig','J.T. Poston'],
  Tomas:   ['Rory McIlroy','Sam Burns','Russell Henley','Michael Thorbjornsen','Adam Scott','Kristoffer Reitan','Jacob Bridgeman'],
  Mark:    ['Matt Fitzpatrick','Tyrrell Hatton','Tom Kim','Kurt Kitayama','Ryan Gerard','Victor Perez','Johnny Keefer'],
  Adrian:  ['Tommy Fleetwood','Justin Rose','Bryson DeChambeau','Rickie Fowler','Akshay Bhatia','Jake Knapp','Eugenio Chacarra'],
  Jack:    ['Xander Schauffele','Viktor Hovland','Min Woo Lee','Brooks Koepka','Jason Day','Keegan Bradley','Sahith Theegala'],
  Zach:    ['Collin Morikawa','Si Woo Kim','Alex Fitzpatrick','Justin Thomas','Maverick McNealy','Corey Conners','Jordan Smith'],
  Georgie: ['Jon Rahm','Ludvig Åberg','Shane Lowry','J.J. Spaun','Cameron Smith','Gary Woodland','Keith Mitchell'],
  Corey:   ['Cameron Young','Chris Gotterup','Jordan Spieth','Joaquín Niemann','Max Homa','Brian Harman','Haotong Li'],
  Kollas:  ['Robert MacIntyre','Wyndham Clark','Aaron Rai','Ben Griffin','Harris English','Alex Noren','Matthew Jordan'],
};
const COLORS = {
  Jack:'#14b8a6', Georgie:'#eab308', Mark:'#8b5cf6', Corey:'#22c55e',
  Adrian:'#ec4899', Zach:'#06b6d4', Mike:'#ef4444', Tomas:'#3b82f6', Kollas:'#f97316',
};
const TOTAL_HOLES = 72; // 4 rounds x 18 holes

// Normalize a golfer name for matching so accented / punctuated spelling
// differences between our TEAMS list and ESPN's displayName never cause a
// silent lookup miss (bit us before with Åberg / Niemann / Højgaard).
function normalizeName(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining accent marks
    .replace(/ø/gi, 'o')             // ø doesn't decompose under NFD
    .replace(/[.']/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

function runMonteCarlo(teamScores, playerData, cutLine, simCount = 10000) {
  const wins = {};
  Object.keys(TEAMS).forEach(
