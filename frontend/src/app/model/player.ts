export interface Player {
  name: string;
  scores: (number | null)[];
}

export interface EnrichedPlayer
  extends Player {
  scoresCumSum: number[];
  total: number;
  rank: number;
  last: boolean;
  track: string;
}
