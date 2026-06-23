export interface GameMetadata {
  id: string;
  title: string;
  category: string;
  coverImage: string; // Path relative to public folder (e.g., 'assets/bubbles_cover.jpg')
  coverColor: string; // Fallback gradient
  icon: string; // Lucide icon name
  description: string;
  isLocked: boolean;
}

export const gamesList: GameMetadata[] = [
  {
    id: 'jelly-link',
    title: 'ぷるぷるゼリーリンク',
    category: 'パズル',
    coverImage: 'assets/jelly_link_cover.jpg',
    coverColor: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)',
    icon: 'Sparkles',
    description: '同じ色のゼリーを一筆書きで繋げて消す、制限時間60秒のツムツム風爽快パズルゲーム。たくさん消してフィーバーを目指そう！',
    isLocked: false
  },
  {
    id: 'soothing-bubbles',
    title: 'ぷにぷに泡ポチ',
    category: '基準ゲーム',
    coverImage: 'assets/bubbles_cover.jpg',
    coverColor: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
    icon: 'Sparkles',
    description: '画面をプニプニとタップして泡を消す、最もシンプルな癒やしゲーム。ここから色々なゲームが展開されます。',
    isLocked: false
  },
  {
    id: 'aquarium-v2',
    title: 'ほっこりアクアリウム',
    category: '開発中',
    coverImage: 'assets/aquarium_cover.jpg',
    coverColor: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)',
    icon: 'Fish',
    description: '深海をたゆたう魚たちを眺め、しずくを集めていく癒やしの放置アクアリウム。',
    isLocked: true
  },
  {
    id: 'tidyup-v2',
    title: 'すっきりお片付け',
    category: '開発中',
    coverImage: 'assets/tidyup_cover.jpg',
    coverColor: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
    icon: 'Grid',
    description: '散らかったブロックを対応するトレイに綺麗に収め、お部屋をすっきりさせる片付けパズル。',
    isLocked: true
  },
  {
    id: 'sleepy-sheep',
    title: 'のんびりひつじ数え',
    category: '開発中',
    coverImage: 'assets/sheep_cover.jpg',
    coverColor: 'linear-gradient(135deg, #fef08a 0%, #ca8a04 100%)',
    icon: 'Moon',
    description: '柵を飛び越えるひつじたちをのんびり眺める、おやすみ前の睡眠導入ゲーム。',
    isLocked: true
  }
];
