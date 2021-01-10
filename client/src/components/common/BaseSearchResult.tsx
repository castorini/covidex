import { BaseArticle, SearchArticle } from '../../shared/Models';

export interface SearchResultProps {
  article: SearchArticle;
  position: number;
  queryId: string;
  queryTokens: Array<string>;
}

export interface ArticleResultProps {
  article: BaseArticle;
  position?: number;
  onClickTitle?: () => void;
  boldTitle?: boolean;
}
