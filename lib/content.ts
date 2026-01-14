import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import fse from 'fs-extra';
import type { FeaturedProject, Job, Post, Project, TagCount } from './types';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'content');
const PUBLIC_CONTENT_ROOT = path.join(ROOT, 'public', 'content');
const STATIC_ROOT = path.join(ROOT, 'static');
const FONTS_ROOT = path.join(ROOT, 'src', 'fonts');
const PUBLIC_FONTS_ROOT = path.join(ROOT, 'public', 'fonts');

type MarkdownResult<T> = T & {
  html: string;
};

const markdownToHtml = async (markdown: string, imageBasePath?: string) => {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml as any)
    .process(markdown);

  let html = processedContent.toString();

  if (imageBasePath) {
    const relativeImageRegex = /src="\.\/([^"]*)"/g;
    html = html.replace(relativeImageRegex, (_match, filePath) => {
      const normalized = filePath.replace(/\\/g, '/');
      return `src="${path.posix.join(imageBasePath, normalized)}"`;
    });
  }

  return html;
};

const getMarkdownFromFile = async <T>(filePath: string, imageBasePath?: string) => {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const html = await markdownToHtml(content, imageBasePath);

  return { ...(data as T), html };
};

export const copyContentAssets = () => {
  fse.ensureDirSync(PUBLIC_CONTENT_ROOT);
  fse.copySync(CONTENT_ROOT, PUBLIC_CONTENT_ROOT, {
    filter: src => !src.endsWith('.md'),
  });

  if (fs.existsSync(STATIC_ROOT)) {
    fse.copySync(STATIC_ROOT, path.join(ROOT, 'public'), { overwrite: true });
  }

  if (fs.existsSync(FONTS_ROOT)) {
    fse.copySync(FONTS_ROOT, PUBLIC_FONTS_ROOT, { overwrite: true });
  }

  const resumeSource = path.join(ROOT, 'resume', 'Arslan Kaleem - Resume.pdf');
  const resumeDest = path.join(ROOT, 'public', 'resume.pdf');
  if (fs.existsSync(resumeSource)) {
    fse.copyFileSync(resumeSource, resumeDest);
  }
};

export const getJobs = async (): Promise<Job[]> => {
  const jobsDir = path.join(CONTENT_ROOT, 'jobs');
  const entries = fs.readdirSync(jobsDir);

  const jobs = await Promise.all(
    entries.map(async entry => {
      const filePath = path.join(jobsDir, entry, 'index.md');
      return getMarkdownFromFile<{
        title: string;
        company: string;
        location: string;
        range: string;
        url?: string;
        date?: string | number;
      }>(filePath);
    }),
  );

  return jobs
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .map(job => ({
      ...job,
      date: job.date ? new Date(job.date).toISOString() : undefined,
      html: job.html || '',
    }));
};

export const getFeaturedProjects = async (): Promise<FeaturedProject[]> => {
  const featuredDir = path.join(CONTENT_ROOT, 'featured');
  const entries = fs.readdirSync(featuredDir);

  const projects = await Promise.all(
    entries.map(async entry => {
      const folderPath = path.join(featuredDir, entry);
      const filePath = path.join(folderPath, 'index.md');
      const frontmatter = await getMarkdownFromFile<{
        title: string;
        tech: string[];
        github?: string;
        external?: string;
        cta?: string;
        cover?: string;
        date?: string | number;
      }>(filePath);

      const coverPath =
        frontmatter.cover && frontmatter.cover.startsWith('.')
          ? `/content/featured/${entry}/${frontmatter.cover.replace('./', '')}`
          : frontmatter.cover;

      return { ...frontmatter, cover: coverPath };
    }),
  );

  return projects
    .sort((a, b) => Number(a.date || 0) - Number(b.date || 0))
    .map(project => ({
      ...project,
      date: project.date ? String(project.date) : undefined,
    }));
};

export const getProjects = async (filterShown = false): Promise<Project[]> => {
  const projectsDir = path.join(CONTENT_ROOT, 'projects');
  const entries = fs.readdirSync(projectsDir).filter(file => file.endsWith('.md'));

  const projects = await Promise.all(
    entries.map(async entry => {
      const filePath = path.join(projectsDir, entry);
      const slug = entry.replace(/\\.md$/, '');
      const imageBasePath = `/content/projects/${slug}`;

      return getMarkdownFromFile<{
        title: string;
        tech?: string[];
        github?: string;
        external?: string;
        ios?: string;
        android?: string;
        date?: string | number;
        company?: string;
        showInProjects?: boolean;
      }>(filePath, imageBasePath);
    }),
  );

  const sorted = projects.sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
  );

  const normalized = sorted.map(project => ({
    ...project,
    date: project.date ? new Date(project.date).toISOString() : undefined,
  }));

  return filterShown ? normalized.filter(project => project.showInProjects) : normalized;
};

export const getPosts = async (includeDrafts = false): Promise<Post[]> => {
  const postsDir = path.join(CONTENT_ROOT, 'posts');
  const entries = fs.readdirSync(postsDir);

  const posts = await Promise.all(
    entries.map(async entry => {
      const folderPath = path.join(postsDir, entry);
      const filePath = path.join(folderPath, 'index.md');
      const imageBasePath = `/content/posts/${entry}`;

      return getMarkdownFromFile<{
        title: string;
        description?: string;
        date: string;
        draft?: boolean;
        slug: string;
        tags: string[];
      }>(filePath, imageBasePath);
    }),
  );

  const filtered = includeDrafts ? posts : posts.filter(post => !post.draft);
  const normalized = filtered.map(post => ({
    ...post,
    date:
      typeof post.date === 'string'
        ? post.date
        : new Date(post.date || '').toISOString(),
  }));

  return normalized.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await getPosts(true);
  return posts.find(post => post.slug === slug) || null;
};

export const getTagsWithCounts = async (): Promise<TagCount[]> => {
  const posts = await getPosts();
  const counts: Record<string, number> = {};

  posts.forEach(post => {
    post.tags?.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  return Object.entries(counts).map(([tag, totalCount]) => ({
    tag,
    totalCount,
  }));
};
