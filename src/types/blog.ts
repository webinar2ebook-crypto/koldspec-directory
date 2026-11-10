export interface ArticleSection {
  id: string;
  heading: string;
  subheading?: string;
  paragraphs: string[];
  callout?: {
    title: string;
    text: string;
    type?: 'info' | 'tip' | 'warning';
  };
  table?: {
    headers: string[];
    rows: string[][];
    caption?: string;
  };
  keyTakeaways?: string[];
}

export interface BlogArticle {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: 'Buying Guides' | 'Energy Efficiency' | 'Equipment Standards' | 'Kitchen Operations';
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
  };
  heroImage: string;
  tags: string[];
  sections: ArticleSection[];
}
