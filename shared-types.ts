
export type RootStackParamList = {
  Home: undefined;
  Article: ArticleParams;
};

export interface ArticleParams {
  url: string;
  title: string;
}