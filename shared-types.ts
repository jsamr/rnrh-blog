
export type RootStackParamList = {
  Home: undefined;
  Article: ArticleParams;
};

export interface ArticleParams {
  url: string;
  title: string;
}

export interface FeedItem {
  title: string;
  links: [{ url: string }];
  description: string;
  published: string;
}