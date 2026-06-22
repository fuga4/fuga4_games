export interface GameMetadata {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon component name
  accentColor: string; // CSS color variable
  tags: string[];
  playTime: string;
}

export const gamesList: GameMetadata[] = [
  {
    id: 'aquarium',
    title: 'ほっこりアクアリウム',
    description: '深海をタップして、泡やハートを集めましょう。可愛い魚やサンゴが増えていく、静かで穏やかな時間。',
    icon: 'Fish',
    accentColor: 'var(--color-sky)',
    tags: ['癒やし', '放置', 'タップ'],
    playTime: '1分〜'
  },
  {
    id: 'tidyup',
    title: 'すっきりお片付け',
    description: '散らばったブロックを同じ形のトレイにドラッグして片付けます。整理整頓の心地よいスッキリ感を。',
    icon: 'Sparkles',
    accentColor: 'var(--color-mint)',
    tags: ['作業', 'パズル', 'スッキリ'],
    playTime: '2分〜'
  }
];
