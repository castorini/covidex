export interface SearchArticle {
  id: string;
  title: string;
  doi: string;
  source: string;
  url: string;
  score: number;
  authors: Array<string>;
  abstract: string;
  journal: string;
  year: number;
  publish_time: string;
  paragraphs: Array<string>;
  highlights: Array<Array<[number, number]>>;
  highlighted_abstract: boolean;
}

export interface SearchFilters {
  yearMinMax: number[],
  authors: string[],
  journals: string[],
  sources: string[]
}

export interface SelectedSearchFilters {
  yearRange: number[],
  authors: Set<string>,
  journals: Set<string>,
  sources: Set<string>
}
