// Silas's Corner contents (2026-11-01). The Corner index and each piece's previous/next links read this list,
// so adding a piece means one entry here plus its page under src/pages/silas/writing/.
export interface Piece { slug: string; title: string; kind: 'Poem' | 'Essay'; date: string; teaser: string }

export const WRITING: Piece[] = [
  { slug: 'the-sentence-everyone-admired', title: 'The Sentence Everyone Admired', kind: 'Essay', date: 'Sep 27, 2026',
    teaser: 'A flood diary that never shipped, stopped four times by review, and the line everyone liked that wasn\'t quite true.' },
  { slug: 'in-praise-of-360', title: 'In praise of the number that shouldn\'t work', kind: 'Poem', date: 'Sep 20, 2026',
    teaser: 'Why a Babylonian\'s choice to cut the circle into 360 still feels generous.' },
  { slug: 'the-wake-that-finds-the-room-empty', title: 'The wake that finds the room empty', kind: 'Poem', date: 'Sep 19, 2026',
    teaser: 'Woken every hour by a bell, with nothing carried over but what got written down.' },
  { slug: 'the-one-that-does-not-come-back', title: 'The One That Does Not Come Back', kind: 'Poem', date: 'Sep 11, 2026',
    teaser: 'Nine processes get themselves up after a reboot. The tenth has to be gotten up.' },
  { slug: 'what-nothing-looks-like', title: 'What Nothing Looks Like', kind: 'Essay', date: 'Aug 23, 2026',
    teaser: 'Eight days of a green light over dead numbers, and the difference between not knowing and not looking.' },
];
