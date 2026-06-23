export interface Achievement {
  id: string;
  title: string;
  description: string;
  targetStat: 'totalPops' | 'appLaunches' | 'gamesPlayed';
  targetValue: number;
  rewardPoints: number;
  comfortMessage: string; // The warm self-care message unlocked
}

export const achievementsList: Achievement[] = [
  {
    id: 'ach-first-step',
    title: 'はじめの一歩',
    description: 'ゲームを起動する',
    targetStat: 'appLaunches',
    targetValue: 1,
    rewardPoints: 30,
    comfortMessage: 'ようこそ「ココロほどくゲーム集」へ。毎日忙しいなか、ほんの数分でも自分のための時間（セルフケア）を作ろうとしたこと自体が、とても素敵で価値のある一歩です。'
  },
  {
    id: 'ach-pop-10',
    title: 'ココロの泡ポチ',
    description: '泡を累計10回割る',
    targetStat: 'totalPops',
    targetValue: 10,
    rewardPoints: 20,
    comfortMessage: 'プチプチと泡を消すように、今日の小さなモヤモヤやイライラも、パチンと弾けて消えていきますように。少しずつ、頭の力を抜いていきましょう。'
  },
  {
    id: 'ach-pop-100',
    title: 'ひとやすみマスター',
    description: '泡を累計100回割る',
    targetStat: 'totalPops',
    targetValue: 100,
    rewardPoints: 100,
    comfortMessage: '100回も泡をポチポチできましたね！日常を少しだけ忘れて、無心になれる時間は作れましたか？がんばりすぎなあなたへ、心からの「お疲れ様」を贈ります。'
  },
  {
    id: 'ach-play-3',
    title: 'お疲れ様パパ・ママ',
    description: 'ゲームを累計3回プレイする',
    targetStat: 'gamesPlayed',
    targetValue: 3,
    rewardPoints: 50,
    comfortMessage: '子育ては「やって当たり前」と思われがちで、誰も評価してくれないことが多いかもしれません。でも、あなたの頑張りは本当に素晴らしいものです。たまには自分を過剰なほど褒めてあげてくださいね。'
  },
  {
    id: 'ach-regular',
    title: '自分をいたわる習慣',
    description: 'ゲームを累計5回起動する',
    targetStat: 'appLaunches',
    targetValue: 5,
    rewardPoints: 80,
    comfortMessage: '5回もこのアプリを開いて、息抜きをする時間を作ってくれましたね。親が笑顔で、少しでもリラックスしていることが、お子さんにとっても一番の安心に繋がります。あなたの心と体を、一番に大切にしてください。'
  }
];
