// scripts/build_data.js
import fs from 'fs';
import path from 'path';

// 1. TEAMS & PLAYERS DATABASE (from documentation §15 and Players Database PDF)
const TEAMS_DATA = [
  {
    id: "AUS",
    name: "Australia",
    code: "AUS",
    printedStars: 5,
    color: "#f4b942",
    captain: "Declan",
    starPlayers: [{ name: "Haden", runs: 17 }],
    deathBowlers: ["Victor", "Abhay"],
    finishers: ["Declan", "Alex", "Ethan", "Victor"],
    openers: ["Malcolm", "Haden", "Flynn"],
    suggestedXI: [
      "Malcolm", "Haden", "Declan", "Ben", "Flynn", "Jonathan", "Victor", "Harrison", "Ali", "Bruce", "Abhay"
    ],
    suggested7: [
      "Malcolm", "Haden", "Declan", "Flynn", "Victor", "Ali", "Abhay"
    ],
    players: [
      { no: 1, name: "Declan", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Red", rt: "Red", marks: ["C", "F"] },
      { no: 2, name: "Ben", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Red", rt: "Green", marks: [] },
      { no: 3, name: "Alex", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Red", marks: ["F"] },
      { no: 4, name: "Malcolm", role: "BAT", bat: "RHB", bowl: null, ct: "Red", rt: "Red", marks: ["O"] },
      { no: 5, name: "Flynn", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Green", marks: ["O"] },
      { no: 6, name: "Lachlan", role: "BTAL", bat: "RHB", bowl: "RM", ct: "Blue", rt: "Green", marks: [] },
      { no: 7, name: "Jonathan", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Red", marks: [] },
      { no: 8, name: "Ethan", role: "BTAL", bat: "LHB", bowl: "LM", ct: "Red", rt: "Green", marks: ["F"] },
      { no: 9, name: "Owais", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Green", marks: [] },
      { no: 10, name: "Kunal", role: "WK", bat: "RHB", bowl: null, ct: "Green", rt: "Red", wkCt: "Red", wkRt: "Blue", wkSt: "Green", marks: [] },
      { no: 11, name: "Haden", role: "WK", bat: "LHB", bowl: null, ct: "Red", rt: "Green", wkCt: "Red", wkRt: "Green", wkSt: "Red", marks: ["★", "O"], starRuns: 17 },
      { no: 12, name: "Victor", role: "BWAL", bat: "LHB", bowl: "LFM", ct: "Green", rt: "Red", marks: ["F", "D"] },
      { no: 13, name: "Noah", role: "BWAL", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 14, name: "Harrison", role: "BW", bat: "RHB", bowl: "RL", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Scott", role: "BW", bat: "LHB", bowl: "LO", ct: "Green", rt: "Red", marks: [] },
      { no: 16, name: "Abhay", role: "BW", bat: "RHB", bowl: "RFM", ct: "Blue", rt: "Blue", marks: ["D"] },
      { no: 17, name: "Neville", role: "BW", bat: "RHB", bowl: "RF", ct: "Green", rt: "Red", marks: [] },
      { no: 18, name: "Harvey", role: "BW", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 19, name: "Ali", role: "BW", bat: "LHB", bowl: "LC", ct: "Red", rt: "Green", marks: [] },
      { no: 20, name: "Bruce", role: "BW", bat: "LHB", bowl: "LF", ct: "Blue", rt: "Blue", marks: [] }
    ]
  },
  {
    id: "SL",
    name: "Sri Lanka",
    code: "SL",
    printedStars: 5,
    color: "#6c5ce7",
    captain: "Sanjeeva",
    starPlayers: [{ name: "Sanjeeva", runs: 20 }, { name: "Oshan", runs: 15 }],
    deathBowlers: ["Milindu", "Naveen"],
    finishers: ["Oshada", "Banduka", "Milindu", "Sadeera"],
    openers: ["Sanjeeva", "Tharindu", "Oshan"],
    suggestedXI: [
      "Sanjeeva", "Oshan", "Tharindu", "Oshada", "Hasitha", "Milindu", "Eshantha", "Ravishka", "Gimhan", "Naveen", "Asanka"
    ],
    suggested7: [
      "Sanjeeva", "Oshan", "Tharindu", "Oshada", "Milindu", "Wickramasinghe", "Naveen"
    ],
    players: [
      { no: 1, name: "Sanjeeva", role: "BTBW", bat: "LHB", bowl: "LM", ct: "Red", rt: "Red", marks: ["C", "★", "O"], starRuns: 20 },
      { no: 2, name: "Oshada", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Red", rt: "Green", marks: ["F"] },
      { no: 3, name: "Ashan", role: "BTBW", bat: "LHB", bowl: "LM", ct: "Red", rt: "Red", marks: [] },
      { no: 4, name: "Hasitha", role: "BAT", bat: "RHB", bowl: null, ct: "Red", rt: "Red", marks: [] },
      { no: 5, name: "Tharindu", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Green", marks: ["O"] },
      { no: 6, name: "Buddhika", role: "BAT", bat: "RHB", bowl: null, ct: "Blue", rt: "Green", marks: [] },
      { no: 7, name: "Banduka", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Red", marks: ["F"] },
      { no: 8, name: "Milindu", role: "BTAL", bat: "LHB", bowl: "LFM", ct: "Red", rt: "Green", marks: ["F", "D"] },
      { no: 9, name: "Vidura", role: "BTAL", bat: "LHB", bowl: "LM", ct: "Red", rt: "Green", marks: [] },
      { no: 10, name: "Oshan", role: "WK", bat: "RHB", bowl: null, ct: "Green", rt: "Red", wkCt: "Red", wkRt: "Blue", wkSt: "Red", marks: ["★", "O"], starRuns: 15 },
      { no: 11, name: "Minura", role: "WK", bat: "LHB", bowl: null, ct: "Red", rt: "Green", wkCt: "Green", wkRt: "Blue", wkSt: "Red", marks: [] },
      { no: 12, name: "Eshantha", role: "BWAL", bat: "LHB", bowl: "LFM", ct: "Green", rt: "Red", marks: [] },
      { no: 13, name: "Sadeera", role: "BWAL", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: ["F"] },
      { no: 14, name: "Wickramasinghe", role: "BW", bat: "RHB", bowl: "RL", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Ruwan", role: "BW", bat: "LHB", bowl: "LO", ct: "Green", rt: "Red", marks: [] },
      { no: 16, name: "Naveen", role: "BW", bat: "RHB", bowl: "RFM", ct: "Blue", rt: "Blue", marks: ["D"] },
      { no: 17, name: "Asanka", role: "BW", bat: "RHB", bowl: "RF", ct: "Green", rt: "Red", marks: [] },
      { no: 18, name: "Ravishka", role: "BW", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 19, name: "Naved", role: "BW", bat: "LHB", bowl: "LC", ct: "Red", rt: "Green", marks: [] },
      { no: 20, name: "Gimhan", role: "BW", bat: "LHB", bowl: "LF", ct: "Blue", rt: "Blue", marks: [] }
    ]
  },
  {
    id: "PAK",
    name: "Pakistan",
    code: "PAK",
    printedStars: 5,
    color: "#14b8a6",
    captain: "Daniyal",
    starPlayers: [{ name: "Daniyal", runs: 20 }, { name: "Umair", runs: 20 }],
    deathBowlers: ["Huzaifa", "Faizan"],
    finishers: ["Danish", "Basit", "Khalid", "Aryan"],
    openers: ["Daniyal", "Murtuza", "Umair"],
    suggestedXI: [
      "Daniyal", "Umair", "Danish", "Hamza", "Basit", "Khalid", "Aryan", "Huzaifa", "Musa", "Faizan", "Muhammad"
    ],
    suggested7: [
      "Daniyal", "Umair", "Danish", "Aryan", "Huzaifa", "Musa", "Faizan"
    ],
    players: [
      { no: 1, name: "Daniyal", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Red", rt: "Red", marks: ["C", "★", "O"], starRuns: 20 },
      { no: 2, name: "Danish", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Red", rt: "Green", marks: ["F"] },
      { no: 3, name: "Huda", role: "BTBW", bat: "LHB", bowl: "LM", ct: "Red", rt: "Red", marks: [] },
      { no: 4, name: "Hamza", role: "BAT", bat: "RHB", bowl: null, ct: "Red", rt: "Red", marks: [] },
      { no: 5, name: "Basit", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Green", marks: ["F"] },
      { no: 6, name: "Murtuza", role: "BAT", bat: "RHB", bowl: null, ct: "Blue", rt: "Green", marks: ["O"] },
      { no: 7, name: "Azhar", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Red", marks: [] },
      { no: 8, name: "Khalid", role: "BTAL", bat: "LHB", bowl: "LM", ct: "Red", rt: "Green", marks: ["F"] },
      { no: 9, name: "Mudassir", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Green", marks: [] },
      { no: 10, name: "Muhazzim", role: "WK", bat: "RHB", bowl: null, ct: "Green", rt: "Red", wkCt: "Red", wkRt: "Blue", wkSt: "Green", marks: [] },
      { no: 11, name: "Umair", role: "WK", bat: "LHB", bowl: null, ct: "Red", rt: "Green", wkCt: "Red", wkRt: "Blue", wkSt: "Red", marks: ["★", "O"], starRuns: 20 },
      { no: 12, name: "Aryan", role: "BWAL", bat: "LHB", bowl: "LFM", ct: "Green", rt: "Red", marks: ["F"] },
      { no: 13, name: "Huzaifa", role: "BWAL", bat: "RHB", bowl: "RFM", ct: "Green", rt: "Blue", marks: ["D"] },
      { no: 14, name: "Gauhar", role: "BW", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Musa", role: "BW", bat: "LHB", bowl: "LC", ct: "Green", rt: "Red", marks: [] },
      { no: 16, name: "Arfeen", role: "BW", bat: "RHB", bowl: "RFM", ct: "Blue", rt: "Blue", marks: [] },
      { no: 17, name: "Faizan", role: "BW", bat: "RHB", bowl: "RF", ct: "Green", rt: "Red", marks: ["D"] },
      { no: 18, name: "Abbas", role: "BW", bat: "LHB", bowl: "LF", ct: "Green", rt: "Blue", marks: [] },
      { no: 19, name: "Abid", role: "BW", bat: "LHB", bowl: "LO", ct: "Red", rt: "Green", marks: [] },
      { no: 20, name: "Muhammad", role: "BW", bat: "LHB", bowl: "LF", ct: "Blue", rt: "Blue", marks: [] }
    ]
  },
  {
    id: "IND",
    name: "India",
    code: "IND",
    printedStars: 5,
    color: "#ff8c4a",
    captain: "Debashish",
    starPlayers: [{ name: "Debashish", runs: 25 }, { name: "Rana", runs: 18 }],
    deathBowlers: ["Ojas", "Javed"],
    finishers: ["Tejas", "Randeep", "Maneesh", "Satyam"],
    openers: ["Debashish", "Arham", "Aditya"],
    suggestedXI: [
      "Debashish", "Aarav", "Rana", "Arham", "Tejas", "Maneesh", "Randeep", "Ojas", "Subroto", "Javed", "Nischay"
    ],
    suggested7: [
      "Debashish", "Arham", "Rana", "Aditya", "Maneesh", "Ojas", "Javed"
    ],
    players: [
      { no: 1, name: "Debashish", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Red", rt: "Red", marks: ["C", "★", "O"], starRuns: 25 },
      { no: 2, name: "Arham", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Red", rt: "Green", marks: ["O"] },
      { no: 3, name: "Tejas", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Red", marks: ["F"] },
      { no: 4, name: "Aditya", role: "BAT", bat: "RHB", bowl: null, ct: "Red", rt: "Red", marks: ["O"] },
      { no: 5, name: "Manjot", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Green", marks: [] },
      { no: 6, name: "Vedant", role: "BTAL", bat: "RHB", bowl: "RO", ct: "Blue", rt: "Green", marks: [] },
      { no: 7, name: "Rana", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Red", marks: ["★"], starRuns: 18 },
      { no: 8, name: "Aarav", role: "BTAL", bat: "LHB", bowl: "LM", ct: "Red", rt: "Green", marks: [] },
      { no: 9, name: "Randeep", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Green", marks: ["F"] },
      { no: 10, name: "Maneesh", role: "WK", bat: "RHB", bowl: null, ct: "Green", rt: "Red", wkCt: "Red", wkRt: "Blue", wkSt: "Green", marks: ["F"] },
      { no: 11, name: "Ruman", role: "WK", bat: "RHB", bowl: null, ct: "Red", rt: "Green", wkCt: "Red", wkRt: "Blue", wkSt: "Red", marks: [] },
      { no: 12, name: "Shiva", role: "WK", bat: "LHB", bowl: null, ct: "Green", rt: "Red", wkCt: "Red", wkRt: "Green", wkSt: "Red", marks: [] },
      { no: 13, name: "Satyam", role: "BWAL", bat: "RHB", bowl: "RFM", ct: "Green", rt: "Blue", marks: ["F"] },
      { no: 14, name: "Yash", role: "BWAL", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Ojas", role: "BW", bat: "LHB", bowl: "LFM", ct: "Green", rt: "Red", marks: ["D"] },
      { no: 16, name: "Subroto", role: "BW", bat: "LHB", bowl: "LC", ct: "Blue", rt: "Blue", marks: [] },
      { no: 17, name: "Akshat", role: "BW", bat: "RHB", bowl: "RL", ct: "Green", rt: "Red", marks: [] },
      { no: 18, name: "Javed", role: "BW", bat: "RHB", bowl: "RF", ct: "Green", rt: "Blue", marks: ["D"] },
      { no: 19, name: "Nischay", role: "BW", bat: "LHB", bowl: "LF", ct: "Red", rt: "Green", marks: [] },
      { no: 20, name: "Himanshu", role: "BW", bat: "LHB", bowl: "LO", ct: "Blue", rt: "Blue", marks: [] }
    ]
  },
  {
    id: "BAN",
    name: "Bangladesh",
    code: "BAN",
    printedStars: 4,
    color: "#d62f2f",
    captain: "Faisal",
    starPlayers: [{ name: "Hirday", runs: 25 }],
    deathBowlers: ["Ashish"],
    finishers: ["Hussain", "Faisal", "Asad"],
    openers: ["Habib", "Hirday", "Qais"],
    suggestedXI: [
      "Hirday", "Qais", "Habib", "Faisal", "Nabil", "Hussain", "Ashish", "Saif", "Tahseen", "Saleh", "Muzammil"
    ],
    suggested7: [
      "Hirday", "Qais", "Habib", "Faisal", "Ashish", "Saleh", "Tahseen"
    ],
    players: [
      { no: 1, name: "Habib", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Red", rt: "Red", marks: ["O"] },
      { no: 2, name: "Nabil", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Red", rt: "Green", marks: [] },
      { no: 3, name: "Hirday", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Red", marks: ["★", "O"], starRuns: 25 },
      { no: 4, name: "Qais", role: "BAT", bat: "RHB", bowl: null, ct: "Green", rt: "Green", marks: ["O"] },
      { no: 5, name: "Arindam", role: "BTAL", bat: "RHB", bowl: "RO", ct: "Red", rt: "Red", marks: [] },
      { no: 6, name: "Mubasshir", role: "BTAL", bat: "RHB", bowl: "RO", ct: "Blue", rt: "Green", marks: [] },
      { no: 7, name: "Hussain", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Red", marks: ["F"] },
      { no: 8, name: "Obaida", role: "BTAL", bat: "LHB", bowl: "LM", ct: "Red", rt: "Green", marks: [] },
      { no: 9, name: "Ashish", role: "BTAL", bat: "LHB", bowl: "LFM", ct: "Red", rt: "Red", marks: ["D"] },
      { no: 10, name: "Deepak", role: "WK", bat: "RHB", bowl: null, ct: "Green", rt: "Red", wkCt: "Red", wkRt: "Blue", wkSt: "Green", marks: [] },
      { no: 11, name: "Faisal", role: "WK", bat: "LHB", bowl: null, ct: "Red", rt: "Green", wkCt: "Red", wkRt: "Green", wkSt: "Red", marks: ["C", "F"] },
      { no: 12, name: "Amirul", role: "BWAL", bat: "LHB", bowl: "LO", ct: "Green", rt: "Red", marks: [] },
      { no: 13, name: "Asad", role: "BWAL", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: ["F"] },
      { no: 14, name: "Rahman", role: "BWAL", bat: "RHB", bowl: "RFM", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Saif", role: "BWAL", bat: "LHB", bowl: "LF", ct: "Green", rt: "Green", marks: [] },
      { no: 16, name: "Tahseen", role: "BW", bat: "RHB", bowl: "RF", ct: "Blue", rt: "Blue", marks: [] },
      { no: 17, name: "Soumik", role: "BW", bat: "LHB", bowl: "LFM", ct: "Green", rt: "Green", marks: [] },
      { no: 18, name: "Rony", role: "BW", bat: "RHB", bowl: "RL", ct: "Green", rt: "Blue", marks: [] },
      { no: 19, name: "Saleh", role: "BW", bat: "LHB", bowl: "LC", ct: "Blue", rt: "Green", marks: [] },
      { no: 20, name: "Muzammil", role: "BW", bat: "LHB", bowl: "LF", ct: "Blue", rt: "Blue", marks: [] }
    ]
  },
  {
    id: "ENG",
    name: "England",
    code: "ENG",
    printedStars: 4,
    color: "#4f8ff7",
    captain: "Joshua",
    starPlayers: [{ name: "Joshua", runs: 30 }],
    deathBowlers: ["Eric"],
    finishers: ["Jack", "Hudson", "Joshua"],
    openers: ["Arthur", "Kent", "Habeeb"],
    suggestedXI: [
      "Kent", "Arthur", "Joshua", "Jack", "Dylan", "Oliver", "Hudson", "Stephen", "Philip", "Gurdas", "Eric"
    ],
    suggested7: [
      "Habeeb", "Arthur", "Joshua", "Kent", "Oliver", "Eric", "Gurdas"
    ],
    players: [
      { no: 1, name: "Jack", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Red", rt: "Green", marks: ["F"] },
      { no: 2, name: "Hudson", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Red", rt: "Green", marks: ["F"] },
      { no: 3, name: "Dylan", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Red", rt: "Red", marks: [] },
      { no: 4, name: "Arthur", role: "BTBW", bat: "LHB", bowl: "LM", ct: "Green", rt: "Green", marks: ["O"] },
      { no: 5, name: "Kent", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Red", marks: ["O"] },
      { no: 6, name: "Habeeb", role: "BAT", bat: "RHB", bowl: null, ct: "Blue", rt: "Green", marks: ["O"] },
      { no: 7, name: "Francis", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Red", marks: [] },
      { no: 8, name: "Joshua", role: "BTAL", bat: "LHB", bowl: "LFM", ct: "Red", rt: "Red", marks: ["C", "F", "★"], starRuns: 30 },
      { no: 9, name: "Daniel", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Red", marks: [] },
      { no: 10, name: "Harry", role: "BTAL", bat: "RHB", bowl: "RFM", ct: "Green", rt: "Red", marks: [] },
      { no: 11, name: "Oliver", role: "WK", bat: "LHB", bowl: null, ct: "Red", rt: "Green", wkCt: "Red", wkRt: "Green", wkSt: "Red", marks: [] },
      { no: 12, name: "Edward", role: "WK", bat: "LHB", bowl: null, ct: "Green", rt: "Red", wkCt: "Blue", wkRt: "Blue", wkSt: "Green", marks: [] },
      { no: 13, name: "Richard", role: "BWAL", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 14, name: "Rupert", role: "BWAL", bat: "RHB", bowl: "RF", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Stephen", role: "BW", bat: "LHB", bowl: "LO", ct: "Green", rt: "Green", marks: [] },
      { no: 16, name: "Philip", role: "BW", bat: "RHB", bowl: "RFM", ct: "Blue", rt: "Blue", marks: [] },
      { no: 17, name: "Eric", role: "BW", bat: "LHB", bowl: "LF", ct: "Green", rt: "Green", marks: ["D"] },
      { no: 18, name: "Gurdas", role: "BW", bat: "RHB", bowl: "RL", ct: "Green", rt: "Blue", marks: [] },
      { no: 19, name: "Percy", role: "BW", bat: "LHB", bowl: "LC", ct: "Blue", rt: "Green", marks: [] },
      { no: 20, name: "Ahmad", role: "BW", bat: "LHB", bowl: "LFM", ct: "Blue", rt: "Blue", marks: [] }
    ]
  },
  {
    id: "SA",
    name: "South Africa",
    code: "SA",
    printedStars: 4,
    color: "#e8649b",
    captain: "Siyabonga",
    starPlayers: [{ name: "Sadiq", runs: 25 }],
    deathBowlers: ["Teboho"],
    finishers: ["Justin", "Aviral", "Tanvir"],
    openers: ["Shawn", "Jabulani", "Sadiq"],
    suggestedXI: [
      "Shawn", "Jabulani", "Sadiq", "Connor", "Tanvir", "Justin", "Siyabonga", "Hendrik", "Luthando", "Haider", "Teboho"
    ],
    suggested7: [
      "Sadiq", "Jabulani", "Shawn", "Tanvir", "Siyabonga", "Teboho", "Luthando"
    ],
    players: [
      { no: 1, name: "Shawn", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Red", rt: "Red", marks: ["O"] },
      { no: 2, name: "Jabulani", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Red", rt: "Green", marks: ["O"] },
      { no: 3, name: "Connor", role: "BAT", bat: "RHB", bowl: null, ct: "Red", rt: "Red", marks: [] },
      { no: 4, name: "Sisanda", role: "BAT", bat: "LHB", bowl: null, ct: "Green", rt: "Green", marks: [] },
      { no: 5, name: "Sadiq", role: "BAT", bat: "RHB", bowl: null, ct: "Red", rt: "Red", marks: ["★", "O"], starRuns: 25 },
      { no: 6, name: "Bryan", role: "BTAL", bat: "RHB", bowl: "RO", ct: "Blue", rt: "Green", marks: [] },
      { no: 7, name: "Justin", role: "BTAL", bat: "LHB", bowl: "LFM", ct: "Red", rt: "Red", marks: ["F"] },
      { no: 8, name: "Aviral", role: "BTAL", bat: "LHB", bowl: "LO", ct: "Red", rt: "Green", marks: ["F"] },
      { no: 9, name: "Tanvir", role: "WK", bat: "LHB", bowl: null, ct: "Red", rt: "Red", wkCt: "Red", wkRt: "Green", wkSt: "Red", marks: ["F"] },
      { no: 10, name: "Luke", role: "WK", bat: "RHB", bowl: null, ct: "Green", rt: "Red", wkCt: "Red", wkRt: "Green", wkSt: "Green", marks: [] },
      { no: 11, name: "Francois", role: "WK", bat: "LHB", bowl: null, ct: "Red", rt: "Green", wkCt: "Red", wkRt: "Blue", wkSt: "Red", marks: [] },
      { no: 12, name: "Siyabonga", role: "BWAL", bat: "LHB", bowl: "LO", ct: "Green", rt: "Red", marks: ["C"] },
      { no: 13, name: "Jacques", role: "BWAL", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 14, name: "Hendrik", role: "BWAL", bat: "RHB", bowl: "RFM", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Teboho", role: "BW", bat: "LHB", bowl: "LFM", ct: "Green", rt: "Green", marks: ["D"] },
      { no: 16, name: "Gerald", role: "BW", bat: "RHB", bowl: "RF", ct: "Blue", rt: "Blue", marks: [] },
      { no: 17, name: "Luthando", role: "BW", bat: "LHB", bowl: "LF", ct: "Green", rt: "Green", marks: [] },
      { no: 18, name: "Haider", role: "BW", bat: "RHB", bowl: "RL", ct: "Green", rt: "Blue", marks: [] },
      { no: 19, name: "Vedant", role: "BW", bat: "LHB", bowl: "LC", ct: "Blue", rt: "Green", marks: [] },
      { no: 20, name: "Bongani", role: "BW", bat: "LHB", bowl: "LFM", ct: "Blue", rt: "Blue", marks: [] }
    ]
  },
  {
    id: "NZ",
    name: "New Zealand",
    code: "NZ",
    printedStars: 4,
    color: "#7c6fa8",
    captain: "David",
    starPlayers: [{ name: "Harvey", runs: 25 }],
    deathBowlers: ["Ibrahim"],
    finishers: ["Tyler", "Nathan", "David"],
    openers: ["Harvey", "Bennet", "Hasan"],
    suggestedXI: [
      "Bennet", "Harvey", "Reynolds", "Tyler", "Graham", "Hasan", "David", "Dhruv", "Ibrahim", "Martin", "Jacob"
    ],
    suggested7: [
      "Harvey", "Bennet", "Hasan", "Tyler", "David", "Jacob", "Ibrahim"
    ],
    players: [
      { no: 1, name: "Reynolds", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Red", rt: "Red", marks: [] },
      { no: 2, name: "Harvey", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Red", rt: "Green", marks: ["★", "O"], starRuns: 25 },
      { no: 3, name: "Bennet", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Red", marks: ["O"] },
      { no: 4, name: "Craig", role: "BAT", bat: "RHB", bowl: null, ct: "Green", rt: "Green", marks: [] },
      { no: 5, name: "Graham", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Red", marks: [] },
      { no: 6, name: "Nixon", role: "BAT", bat: "RHB", bowl: null, ct: "Blue", rt: "Green", marks: [] },
      { no: 7, name: "Tyler", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Red", marks: ["F"] },
      { no: 8, name: "Nathan", role: "BTAL", bat: "LHB", bowl: "LM", ct: "Red", rt: "Green", marks: ["F"] },
      { no: 9, name: "Cody", role: "BTAL", bat: "LHB", bowl: "LFM", ct: "Red", rt: "Red", marks: [] },
      { no: 10, name: "Nicholson", role: "WK", bat: "RHB", bowl: null, ct: "Green", rt: "Red", wkCt: "Red", wkRt: "Blue", wkSt: "Green", marks: [] },
      { no: 11, name: "Hasan", role: "WK", bat: "LHB", bowl: null, ct: "Red", rt: "Green", wkCt: "Red", wkRt: "Green", wkSt: "Red", marks: ["O"] },
      { no: 12, name: "Presley", role: "BWAL", bat: "LHB", bowl: "LFM", ct: "Green", rt: "Red", marks: [] },
      { no: 13, name: "David", role: "BWAL", bat: "RHB", bowl: "RFM", ct: "Green", rt: "Blue", marks: ["C", "F"] },
      { no: 14, name: "Benzamin", role: "BW", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Mason", role: "BW", bat: "LHB", bowl: "LO", ct: "Green", rt: "Green", marks: [] },
      { no: 16, name: "Ibrahim", role: "BW", bat: "RHB", bowl: "RF", ct: "Blue", rt: "Blue", marks: ["D"] },
      { no: 17, name: "Martin", role: "BW", bat: "LHB", bowl: "LF", ct: "Green", rt: "Green", marks: [] },
      { no: 18, name: "Jacob", role: "BW", bat: "RHB", bowl: "RL", ct: "Green", rt: "Blue", marks: [] },
      { no: 19, name: "Blake", role: "BW", bat: "LHB", bowl: "LC", ct: "Blue", rt: "Green", marks: [] },
      { no: 20, name: "Dhruv", role: "BW", bat: "LHB", bowl: "LFM", ct: "Blue", rt: "Blue", marks: [] }
    ]
  },
  {
    id: "AFG",
    name: "Afghanistan",
    code: "AFG",
    printedStars: 3,
    color: "#2dd4bf",
    captain: "Reza",
    starPlayers: [{ name: "Arqam", runs: 30 }],
    deathBowlers: ["Taimur"],
    finishers: ["Besharat", "Mursalin", "Reza"],
    openers: ["Arqam", "Muhib"],
    suggestedXI: [
      "Arqam", "Muhib", "Hamed", "Bakhtiar", "Idrees", "Mursalin", "Reza", "Mirwais", "Taimur", "Nemat", "Yawar"
    ],
    suggested7: [
      "Arqam", "Muhib", "Musheer", "Mursalin", "Reza", "Taimur", "Yawar"
    ],
    players: [
      { no: 1, name: "Arqam", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Red", rt: "Red", marks: ["★", "O"], starRuns: 30 },
      { no: 2, name: "Hamed", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Green", rt: "Green", marks: [] },
      { no: 3, name: "Musheer", role: "BTBW", bat: "LHB", bowl: "LM", ct: "Red", rt: "Red", marks: [] },
      { no: 4, name: "Muhib", role: "BAT", bat: "LHB", bowl: null, ct: "Green", rt: "Green", marks: ["O"] },
      { no: 5, name: "Idrees", role: "BAT", bat: "RHB", bowl: null, ct: "Red", rt: "Red", marks: [] },
      { no: 6, name: "Zulfaqar", role: "BTAL", bat: "RHB", bowl: "RO", ct: "Green", rt: "Green", marks: [] },
      { no: 7, name: "Besharat", role: "BTAL", bat: "LHB", bowl: "LFM", ct: "Red", rt: "Red", marks: ["F"] },
      { no: 8, name: "Bakhtiar", role: "BTAL", bat: "LHB", bowl: "LM", ct: "Red", rt: "Green", marks: [] },
      { no: 9, name: "Mursalin", role: "WK", bat: "RHB", bowl: null, ct: "Red", rt: "Green", wkCt: "Red", wkRt: "Green", wkSt: "Red", marks: ["F"] },
      { no: 10, name: "Fareed", role: "WK", bat: "RHB", bowl: null, ct: "Blue", rt: "Red", wkCt: "Red", wkRt: "Blue", wkSt: "Green", marks: [] },
      { no: 11, name: "Mirwais", role: "BWAL", bat: "LHB", bowl: "LC", ct: "Green", rt: "Green", marks: [] },
      { no: 12, name: "Fahim", role: "BWAL", bat: "LHB", bowl: "LO", ct: "Green", rt: "Red", marks: [] },
      { no: 13, name: "Yawar", role: "BW", bat: "RHB", bowl: "RFM", ct: "Blue", rt: "Blue", marks: [] },
      { no: 14, name: "Ayub", role: "BW", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Nasar", role: "BW", bat: "RHB", bowl: "RFM", ct: "Green", rt: "Blue", marks: [] },
      { no: 16, name: "Nemat", role: "BW", bat: "RHB", bowl: "RF", ct: "Blue", rt: "Blue", marks: [] },
      { no: 17, name: "Taimur", role: "BW", bat: "LHB", bowl: "LF", ct: "Green", rt: "Green", marks: ["D"] },
      { no: 18, name: "Reza", role: "BW", bat: "RHB", bowl: "RL", ct: "Blue", rt: "Blue", marks: ["C", "F"] },
      { no: 19, name: "Zakaria", role: "BW", bat: "LHB", bowl: "LC", ct: "Blue", rt: "Blue", marks: [] },
      { no: 20, name: "Noorullah", role: "BW", bat: "LHB", bowl: "LO", ct: "Blue", rt: "Blue", marks: [] }
    ]
  },
  {
    id: "WI",
    name: "West Indies",
    code: "WI",
    printedStars: 3,
    color: "#8a5a34",
    captain: "Devnarain",
    starPlayers: [{ name: "Devnarain", runs: 10 }],
    deathBowlers: ["Mohammad"],
    finishers: ["Williams", "Akhtar", "Devnarain"],
    openers: ["Omar", "Devnarain"],
    suggestedXI: [
      "Devnarain", "Omar", "Williams", "Keston", "Jason", "Darren", "Carlton", "Andre", "Ricardo", "Mohammad", "Siddharth"
    ],
    suggested7: [
      "Devnarain", "Omar", "Williams", "Darren", "Andre", "Mohammad", "Thomas"
    ],
    players: [
      { no: 1, name: "Darren", role: "BTBW", bat: "LHB", bowl: "LM", ct: "Red", rt: "Red", marks: [] },
      { no: 2, name: "Kevin", role: "BTBW", bat: "RHB", bowl: "RM", ct: "Green", rt: "Green", marks: [] },
      { no: 3, name: "Williams", role: "BTBW", bat: "RHB", bowl: "RO", ct: "Red", rt: "Red", marks: ["F"] },
      { no: 4, name: "Jason", role: "BAT", bat: "RHB", bowl: null, ct: "Green", rt: "Green", marks: [] },
      { no: 5, name: "Omar", role: "BAT", bat: "LHB", bowl: null, ct: "Red", rt: "Red", marks: ["O"] },
      { no: 6, name: "Keston", role: "BTAL", bat: "LHB", bowl: "LM", ct: "Green", rt: "Green", marks: [] },
      { no: 7, name: "Akhtar", role: "BTAL", bat: "RHB", bowl: "RO", ct: "Red", rt: "Red", marks: ["F"] },
      { no: 8, name: "Emmanuel", role: "BTAL", bat: "LHB", bowl: "LFM", ct: "Red", rt: "Green", marks: [] },
      { no: 9, name: "Nelson", role: "BTAL", bat: "RHB", bowl: "RM", ct: "Red", rt: "Green", marks: [] },
      { no: 10, name: "Rennard", role: "WK", bat: "RHB", bowl: null, ct: "Blue", rt: "Red", wkCt: "Red", wkRt: "Blue", wkSt: "Green", marks: [] },
      { no: 11, name: "Devnarain", role: "WK", bat: "LHB", bowl: null, ct: "Green", rt: "Green", wkCt: "Red", wkRt: "Green", wkSt: "Red", marks: ["C", "F", "★", "O"], starRuns: 10 },
      { no: 12, name: "Gabriel", role: "BWAL", bat: "LHB", bowl: "LFM", ct: "Green", rt: "Red", marks: [] },
      { no: 13, name: "Conrad", role: "BWAL", bat: "RHB", bowl: "RFM", ct: "Blue", rt: "Blue", marks: [] },
      { no: 14, name: "Carlton", role: "BWAL", bat: "RHB", bowl: "RO", ct: "Green", rt: "Blue", marks: [] },
      { no: 15, name: "Jayden", role: "BWAL", bat: "LHB", bowl: "LO", ct: "Green", rt: "Blue", marks: [] },
      { no: 16, name: "Andre", role: "BWAL", bat: "RHB", bowl: "RF", ct: "Blue", rt: "Blue", marks: [] },
      { no: 17, name: "Mohammad", role: "BW", bat: "LHB", bowl: "LF", ct: "Green", rt: "Green", marks: ["D"] },
      { no: 18, name: "Siddharth", role: "BW", bat: "RHB", bowl: "RL", ct: "Blue", rt: "Blue", marks: [] },
      { no: 19, name: "Thomas", role: "BW", bat: "LHB", bowl: "LC", ct: "Blue", rt: "Blue", marks: [] },
      { no: 20, name: "Ricardo", role: "BW", bat: "LHB", bowl: "LFM", ct: "Blue", rt: "Blue", marks: [] }
    ]
  }
];

console.log(`Validated ${TEAMS_DATA.length} teams and ${TEAMS_DATA.reduce((acc, t) => acc + t.players.length, 0)} players.`);

// 2. RULES DATA
const RULES_DATA = {
  dominationTable: {
    // bowlerType -> batsmanType -> line
    BW: { BW: "BWD3", BWAL: "BWD2", BTAL_WK: "BWD1", BAT_BTBW: "EQ" },
    BWAL: { BW: "BWD2", BWAL: "BWD1", BTAL_WK: "EQ", BAT_BTBW: "BTD1" },
    BTAL: { BW: "BWD1", BWAL: "EQ", BTAL_WK: "BTD1", BAT_BTBW: "BTD2" },
    BTBW: { BW: "EQ", BWAL: "BTD1", BTAL_WK: "BTD2", BAT_BTBW: "BTD3" }
  },
  matchupGridB: {
    // bowlerStyle -> RHB line, LHB line
    RF: { RHB: "NS", LHB: "LS" },
    LF: { RHB: "LS", LHB: "NS" },
    RFM: { RHB: "NS", LHB: "LS" },
    LFM: { RHB: "LS", LHB: "NS" },
    RM: { RHB: "HS/★", LHB: "NS" },
    LM: { RHB: "NS", LHB: "HS/★" },
    RO: { RHB: "HS/★", LHB: "LS" },
    LO: { RHB: "LS", LHB: "HS/★" },
    RL: { RHB: "LS", LHB: "HS/★" },
    LC: { RHB: "HS/★", LHB: "LS" }
  },
  deathBowlersByTeam: {
    AUS: ["Victor", "Abhay"],
    SL: ["Milindu", "Naveen"],
    PAK: ["Huzaifa", "Faizan"],
    IND: ["Ojas", "Javed"],
    BAN: ["Ashish"],
    ENG: ["Eric"],
    SA: ["Teboho"],
    NZ: ["Ibrahim"],
    AFG: ["Taimur"],
    WI: ["Mohammad"]
  },
  spinners: ["RO", "RL", "LO", "LC"],
  pacers: ["RF", "RFM", "RM", "LF", "LFM", "LM"],
  formats: {
    "5_overs": {
      overs: 5,
      playersPerSide: 7,
      allOutWickets: 6,
      maxOversPerBowlerRule: "2 bowlers may bowl 2 overs, the rest 1",
      powerplayOvers: [1],
      slogOvers: [5],
      middleOvers: [2, 3, 4]
    },
    "10_overs": {
      overs: 10,
      playersPerSide: 11,
      allOutWickets: 10,
      maxOversPerBowlerRule: "Max 2 overs each",
      powerplayOvers: [1, 2],
      slogOvers: [9, 10],
      middleOvers: [3, 4, 5, 6, 7, 8]
    }
  }
};

// 3. CARDS DATA
// 3.1 Wicket Cards (25 total)
// Breakdown from OCR / md §9:
// 4 LBW, 5 CATCH, 6 BOWLED, 3 STUMPING OR CAUGHT BEHIND, 2 CAUGHT BEHIND, 1 CAUGHT & BOWLED, 2 RUN OUT AT STRIKER'S END, 2 RUN OUT AT NON-STRIKER'S END = 25 cards
const WICKET_CARDS = [
  // Page 1
  { id: 1, type: "lbw", title: "LBW", desc: "LEG BEFORE WICKET", chance: "none" },
  { id: 2, type: "lbw", title: "LBW", desc: "LEG BEFORE WICKET", chance: "none" },
  { id: 3, type: "lbw", title: "LBW", desc: "LEG BEFORE WICKET", chance: "none" },
  { id: 4, type: "lbw", title: "LBW", desc: "LEG BEFORE WICKET", chance: "none" },
  { id: 5, type: "caught", title: "CATCH", desc: "CAUGHT IN THE FIELD", chance: "fielder_catch" },
  { id: 6, type: "caught", title: "CATCH", desc: "CAUGHT IN THE FIELD", chance: "fielder_catch" },
  { id: 7, type: "caught", title: "CATCH", desc: "CAUGHT IN THE FIELD", chance: "fielder_catch" },
  { id: 8, type: "caught", title: "CATCH", desc: "CAUGHT IN THE FIELD", chance: "fielder_catch" },
  { id: 9, type: "caught", title: "CATCH", desc: "CAUGHT IN THE FIELD", chance: "fielder_catch" },
  // Page 3
  { id: 10, type: "bowled", title: "BOWLED", desc: "STUMPS HIT", chance: "none" },
  { id: 11, type: "bowled", title: "BOWLED", desc: "STUMPS HIT", chance: "none" },
  { id: 12, type: "bowled", title: "BOWLED", desc: "STUMPS HIT", chance: "none" },
  { id: 13, type: "bowled", title: "BOWLED", desc: "STUMPS HIT", chance: "none" },
  { id: 14, type: "bowled", title: "BOWLED", desc: "STUMPS HIT", chance: "none" },
  { id: 15, type: "bowled", title: "BOWLED", desc: "STUMPS HIT", chance: "none" },
  { id: 16, type: "stumpingOrCaughtBehind", title: "STUMPING OR CAUGHT BEHIND", desc: "STUMPED: LM, RM, LO, RO, RL, LC · CAUGHT BEHIND: LF, RF, LFM, RFM", chance: "conditional" },
  { id: 17, type: "stumpingOrCaughtBehind", title: "STUMPING OR CAUGHT BEHIND", desc: "STUMPED: LM, RM, LO, RO, RL, LC · CAUGHT BEHIND: LF, RF, LFM, RFM", chance: "conditional" },
  { id: 18, type: "stumpingOrCaughtBehind", title: "STUMPING OR CAUGHT BEHIND", desc: "STUMPED: LM, RM, LO, RO, RL, LC · CAUGHT BEHIND: LF, RF, LFM, RFM", chance: "conditional" },
  // Page 5
  { id: 19, type: "caughtBehind", title: "CAUGHT BEHIND", desc: "BY THE KEEPER", chance: "keeper_catch" },
  { id: 20, type: "caughtBehind", title: "CAUGHT BEHIND", desc: "BY THE KEEPER", chance: "keeper_catch" },
  { id: 21, type: "caughtAndBowled", title: "CAUGHT & BOWLED", desc: "BY THE BOWLER", chance: "bowler_catch" },
  { id: 22, type: "runOutStriker", title: "RUN OUT", desc: "AT STRIKER'S END", chance: "fielder_run_out" },
  { id: 23, type: "runOutStriker", title: "RUN OUT", desc: "AT STRIKER'S END", chance: "fielder_run_out" },
  { id: 24, type: "runOutNonStriker", title: "RUN OUT", desc: "AT NON-STRIKER'S END", chance: "fielder_run_out" },
  { id: 25, type: "runOutNonStriker", title: "RUN OUT", desc: "AT NON-STRIKER'S END", chance: "fielder_run_out" }
];

// 3.2 Runs Cards (16 total) - Table from md §10
const RUNS_CARDS = [
  {
    card: 1,
    catchDroppedFielder: 0,
    catchDroppedKeeperBowler: 0,
    noFielderCatch: 1,
    noFielderRunOut: 1,
    stumpingMissed: 0,
    runOutHit: { fielder: 0, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 0, bowler: 0, keeper: 0 },
    extrasPrinted: "WIDE",
    extrasAppNow: "DOT",
    freeHitOthers: 0,
    freeHitBowler: 0
  },
  {
    card: 2,
    catchDroppedFielder: 0,
    catchDroppedKeeperBowler: 0,
    noFielderCatch: 1,
    noFielderRunOut: 1,
    stumpingMissed: 0,
    runOutHit: { fielder: 0, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 0, bowler: 0, keeper: 0 },
    extrasPrinted: "WIDE +1",
    extrasAppNow: "DOT",
    freeHitOthers: 1,
    freeHitBowler: 0
  },
  {
    card: 3,
    catchDroppedFielder: 1,
    catchDroppedKeeperBowler: 0,
    noFielderCatch: 2,
    noFielderRunOut: 1,
    stumpingMissed: 0,
    runOutHit: { fielder: 0, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 1, bowler: 0, keeper: 0 },
    extrasPrinted: "WIDE +2",
    extrasAppNow: "WIDE",
    freeHitOthers: 2,
    freeHitBowler: 0
  },
  {
    card: 4,
    catchDroppedFielder: 1,
    catchDroppedKeeperBowler: 0,
    noFielderCatch: 2,
    noFielderRunOut: 2,
    stumpingMissed: 0,
    runOutHit: { fielder: 0, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 1, bowler: 0, keeper: 0 },
    extrasPrinted: "WIDE +3",
    extrasAppNow: "DOT",
    freeHitOthers: 3,
    freeHitBowler: 0
  },
  {
    card: 5,
    catchDroppedFielder: 1,
    catchDroppedKeeperBowler: 0,
    noFielderCatch: 2,
    noFielderRunOut: 2,
    stumpingMissed: 0,
    runOutHit: { fielder: 0, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 1, bowler: 0, keeper: 1 },
    extrasPrinted: "WIDE +4",
    extrasAppNow: "L1",
    freeHitOthers: 4,
    freeHitBowler: 0
  },
  {
    card: 6,
    catchDroppedFielder: 2,
    catchDroppedKeeperBowler: 0,
    noFielderCatch: 2,
    noFielderRunOut: 2,
    stumpingMissed: 0,
    runOutHit: { fielder: 0, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 1, bowler: 0, keeper: 1 },
    extrasPrinted: "NO BALL",
    extrasAppNow: "DOT",
    freeHitOthers: 4,
    freeHitBowler: 0
  },
  {
    card: 7,
    catchDroppedFielder: 2,
    catchDroppedKeeperBowler: 1,
    noFielderCatch: 2,
    noFielderRunOut: 2,
    stumpingMissed: 0,
    runOutHit: { fielder: 0, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 1, bowler: 0, keeper: "B1" },
    extrasPrinted: "NO BALL +1",
    extrasAppNow: "NO BALL",
    freeHitOthers: 4,
    freeHitBowler: 0
  },
  {
    card: 8,
    catchDroppedFielder: 2,
    catchDroppedKeeperBowler: 1,
    noFielderCatch: 3,
    noFielderRunOut: 2,
    stumpingMissed: "WIDE",
    runOutHit: { fielder: 0, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 1, bowler: 0, keeper: "B1" },
    extrasPrinted: "NO BALL +2",
    extrasAppNow: "DOT",
    freeHitOthers: 4,
    freeHitBowler: 0
  },
  {
    card: 9,
    catchDroppedFielder: 2,
    catchDroppedKeeperBowler: 2,
    noFielderCatch: 3,
    noFielderRunOut: 2,
    stumpingMissed: "WIDE +1",
    runOutHit: { fielder: 1, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 2, bowler: 1, keeper: "B1" },
    extrasPrinted: "NO BALL +3",
    extrasAppNow: "B1",
    freeHitOthers: 6,
    freeHitBowler: 1
  },
  {
    card: 10,
    catchDroppedFielder: 2,
    catchDroppedKeeperBowler: 2,
    noFielderCatch: 3,
    noFielderRunOut: 3,
    stumpingMissed: "WIDE +2",
    runOutHit: { fielder: 1, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 2, bowler: 1, keeper: "B1" },
    extrasPrinted: "NO BALL +4",
    extrasAppNow: "WIDE +1",
    freeHitOthers: 6,
    freeHitBowler: 2
  },
  {
    card: 11,
    catchDroppedFielder: 3,
    catchDroppedKeeperBowler: 3,
    noFielderCatch: 3,
    noFielderRunOut: 3,
    stumpingMissed: "WIDE +3",
    runOutHit: { fielder: 1, bowler: 0, keeper: 0 },
    runOutMissed: { fielder: 2, bowler: 1, keeper: "B1" },
    extrasPrinted: "NO BALL +6",
    extrasAppNow: "DOT",
    freeHitOthers: 6,
    freeHitBowler: 3
  },
  {
    card: 12,
    catchDroppedFielder: 3,
    catchDroppedKeeperBowler: 3,
    noFielderCatch: 3,
    noFielderRunOut: 3,
    stumpingMissed: "WIDE +4",
    runOutHit: { fielder: 1, bowler: 1, keeper: 0 },
    runOutMissed: { fielder: 2, bowler: 2, keeper: "B1" },
    extrasPrinted: "B4",
    extrasAppNow: "NO BALL +1",
    freeHitOthers: 6,
    freeHitBowler: 4
  },
  {
    card: 13,
    catchDroppedFielder: 4,
    catchDroppedKeeperBowler: 4,
    noFielderCatch: 4,
    noFielderRunOut: "L1",
    stumpingMissed: "B1",
    runOutHit: { fielder: 1, bowler: 1, keeper: 0 },
    runOutMissed: { fielder: 2, bowler: "L1", keeper: "B1" },
    extrasPrinted: "L1",
    extrasAppNow: "L2",
    freeHitOthers: 6,
    freeHitBowler: 4
  },
  {
    card: 14,
    catchDroppedFielder: 4,
    catchDroppedKeeperBowler: 4,
    noFielderCatch: 4,
    noFielderRunOut: "L1",
    stumpingMissed: "B2",
    runOutHit: { fielder: 2, bowler: 1, keeper: 0 },
    runOutMissed: { fielder: 2, bowler: "L1", keeper: "B1" },
    extrasPrinted: "L2",
    extrasAppNow: "DOT",
    freeHitOthers: 6,
    freeHitBowler: 4
  },
  {
    card: 15,
    catchDroppedFielder: 6,
    catchDroppedKeeperBowler: 4,
    noFielderCatch: 4,
    noFielderRunOut: "L2",
    stumpingMissed: "B3",
    runOutHit: { fielder: 2, bowler: 1, keeper: 1 },
    runOutMissed: { fielder: 3, bowler: "L1", keeper: "B1" },
    extrasPrinted: "L3",
    extrasAppNow: "WIDE +2",
    freeHitOthers: 6,
    freeHitBowler: 4
  },
  {
    card: 16,
    catchDroppedFielder: 6,
    catchDroppedKeeperBowler: 4,
    noFielderCatch: 6,
    noFielderRunOut: "L3",
    stumpingMissed: "B4",
    runOutHit: { fielder: 2, bowler: 1, keeper: 1 },
    runOutMissed: { fielder: 3, bowler: "L1", keeper: "B1" },
    extrasPrinted: "L4",
    extrasAppNow: "DOT",
    freeHitOthers: 6,
    freeHitBowler: 6
  }
];

// 3.3 Fielding Cards (20 total) - 1 to 20
const FIELDING_CARDS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  positionNumber: i + 1
}));

// 3.4 Skills Cards (20 total) - from md §9.3
const SKILLS_CARDS = [
  { card: 1, wkCatch: ["Red", "Blue"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Red"], fldCatch: ["Green", "Blue"], fldRunOut: ["Red", "Green"] },
  { card: 2, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Green"], fldCatch: ["Red"], fldRunOut: ["Red", "Blue"] },
  { card: 3, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Green", "Blue"], wkRunOut: ["Green"], fldCatch: ["Red", "Green"], fldRunOut: ["Red", "Green"] },
  { card: 4, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Green", "Blue"], wkRunOut: ["Green"], fldCatch: ["Red", "Blue"], fldRunOut: ["Red", "Green"] },
  { card: 5, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Green"], fldCatch: ["Green", "Blue"], fldRunOut: ["Red", "Green"] },
  { card: 6, wkCatch: ["Red", "Green"], wkStump: ["Red", "Blue"], wkRunOut: ["Red", "Blue"], fldCatch: ["Red", "Green"], fldRunOut: ["Green", "Blue"] },
  { card: 7, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Green"], fldCatch: ["Red", "Blue"], fldRunOut: ["Red", "Blue"] },
  { card: 8, wkCatch: ["Green", "Blue"], wkStump: ["Red", "Blue"], wkRunOut: ["Red"], fldCatch: ["Red", "Green"], fldRunOut: ["Red"] },
  { card: 9, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Green"], fldCatch: ["Red", "Blue"], fldRunOut: ["Red", "Blue"] },
  { card: 10, wkCatch: ["Red", "Green"], wkStump: ["Red", "Blue"], wkRunOut: ["Red", "Blue"], fldCatch: ["Red", "Green"], fldRunOut: ["Red"] },
  { card: 11, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Red", "Green"], wkRunOut: ["Green"], fldCatch: ["Red", "Blue"], fldRunOut: ["Green", "Blue"] },
  { card: 12, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Red", "Green"], wkRunOut: ["Green"], fldCatch: ["Red", "Green"], fldRunOut: ["Red"] },
  { card: 13, wkCatch: ["Red", "Blue"], wkStump: ["Red", "Green"], wkRunOut: ["Red", "Blue"], fldCatch: ["Red", "Blue"], fldRunOut: ["Red", "Blue"] },
  { card: 14, wkCatch: ["Green", "Blue"], wkStump: ["Red", "Green"], wkRunOut: ["Red", "Blue"], fldCatch: ["Red", "Green"], fldRunOut: ["Red"] },
  { card: 15, wkCatch: ["Red", "Green"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Red", "Blue"], fldCatch: ["Red", "Green"], fldRunOut: ["Red"] },
  { card: 16, wkCatch: ["Red", "Green"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Red", "Green"], fldCatch: ["Green", "Blue"], fldRunOut: ["Green", "Blue"] },
  { card: 17, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Red", "Blue"], fldCatch: ["Red", "Green"], fldRunOut: [] },
  { card: 18, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Blue"], fldCatch: ["Red", "Green"], fldRunOut: [] },
  { card: 19, wkCatch: ["Red", "Green", "Blue"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Red", "Blue"], fldCatch: ["Red", "Blue"], fldRunOut: ["Green", "Blue"] },
  { card: 20, wkCatch: ["Red", "Blue"], wkStump: ["Red", "Green", "Blue"], wkRunOut: ["Red"], fldCatch: ["Green", "Blue"], fldRunOut: ["Red", "Green"] }
];

// 3.5 Power Cards (6 total)
const POWER_CARDS = [
  { id: 1, name: "Reroll", count: 2, usedBy: "BAT/BTBW/BTAL/WK Captain on batting, BW/BWAL Captain on bowling", desc: "Cancel his own roll and roll again — both dice, or only red, or only blue." },
  {
    id: 2,
    name: "Wonderful Shot",
    count: 2,
    usedBy: "BAT / BTBW / BTAL / WK Captain on strike",
    desc: "30 of 36 cells are 4 or 6. No wicket.",
    grid: [
      ["6", "6", "6", "6", "6", "6"],
      ["4", "6", "1", "4", "6", "4"],
      ["1", "4", "4", "6", "6", "2"],
      ["6", "6", "4", "4", "6", "2"],
      ["6", "1", "6", "4", "6", "2"],
      ["4", "6", "4", "4", "6", "4"]
    ]
  },
  {
    id: 3,
    name: "Great Delivery",
    count: 2,
    usedBy: "BW / BWAL Captain bowling",
    desc: "22 of 36 cells are wickets (X 22, D 12, B 1, + 1).",
    grid: [
      ["X", "D", "X", "X", "D", "X"],
      ["+", "X", "D", "X", "X", "B"],
      ["X", "X", "D", "D", "X", "X"],
      ["D", "D", "D", "D", "D", "X"],
      ["X", "X", "X", "X", "D", "X"],
      ["X", "X", "X", "X", "X", "D"]
    ]
  }
];

export {
  TEAMS_DATA,
  RULES_DATA,
  WICKET_CARDS,
  RUNS_CARDS,
  FIELDING_CARDS,
  SKILLS_CARDS,
  POWER_CARDS
};
