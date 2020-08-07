export interface BaseCord19Article {
  [key: string]: any;
}

export interface BaseAclArticle {
  [key: string]: any;
}

export interface AclSearchArticle extends BaseAclArticle {
  highlights: Array<Array<[number, number]>>;
  highlighted_abstract: boolean;
  paragraphs: Array<string>;
  score: number;
  has_related_articles: boolean;
}

export interface Cord19SearchArticle extends BaseCord19Article {
  highlights: Array<Array<[number, number]>>;
  highlighted_abstract: boolean;
  paragraphs: Array<string>;
  score: number;
  has_related_articles: boolean;
}

export interface AclRelatedArticle extends BaseAclArticle {
  distance: number;
}

export interface Cord19RelatedArticle extends BaseCord19Article {
  distance: number;
}


export interface SearchFilters {
  yearMinMax: number[];
  authors: string[];
  journals: string[];
  sources: string[];
}

export interface SelectedSearchFilters {
  yearRange: number[];
  authors: Set<string>;
  journals: Set<string>;
  sources: Set<string>;
}
