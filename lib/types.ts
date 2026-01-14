export type Job = {
  title: string;
  company: string;
  location: string;
  range: string;
  url?: string;
  date?: string | number;
  html: string;
};

export type FeaturedProject = {
  title: string;
  tech: string[];
  github?: string;
  external?: string;
  cta?: string;
  cover?: string;
  date?: string | number;
  html: string;
};

export type Project = {
  title: string;
  tech?: string[];
  github?: string;
  external?: string;
  ios?: string;
  android?: string;
  date?: string | number;
  company?: string;
  showInProjects?: boolean;
  html: string;
};

export type Post = {
  title: string;
  description?: string;
  date: string;
  draft?: boolean;
  slug: string;
  tags: string[];
  html: string;
};

export type TagCount = {
  tag: string;
  totalCount: number;
};
