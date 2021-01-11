export interface BaseArticle {
  [key: string]: any;
}

export interface SearchArticle extends BaseArticle {
  highlights: Array<Array<[number, number]>>;
  highlighted_abstract: boolean;
  paragraphs: Array<string>;
  score: number;
  has_related_articles: boolean;
}

export interface RelatedArticle extends BaseArticle {
  distance: number;
}

export interface SearchFilters {
  [key: string]: any;
}
