export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  bgColor: string; // Hex code or gradient
  price: number; // Cost in "shizuku" points (0 = default/free)
}

export const avatarsList: Avatar[] = [
  {
    id: 'avatar-default',
    name: '初期アバター',
    emoji: '👤',
    bgColor: '#94a3b8', // slate-400
    price: 0
  },
  {
    id: 'avatar-cat',
    name: 'ねむねこ',
    emoji: '🐱',
    bgColor: '#fca5a5', // red-300
    price: 50
  },
  {
    id: 'avatar-dog',
    name: 'おさんぽイヌ',
    emoji: '🐶',
    bgColor: '#fde047', // yellow-300
    price: 80
  },
  {
    id: 'avatar-penguin',
    name: '親子ペンギン',
    emoji: '🐧',
    bgColor: '#7dd3fc', // sky-300
    price: 150
  },
  {
    id: 'avatar-panda',
    name: 'だらだらパンダ',
    emoji: '🐼',
    bgColor: '#e2e8f0', // slate-200
    price: 250
  },
  {
    id: 'avatar-unicorn',
    name: '夢かわユニコーン',
    emoji: '🦄',
    bgColor: '#f5d0fe', // fuchsia-200
    price: 500
  }
];
