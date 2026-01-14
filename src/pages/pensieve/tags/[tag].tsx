import React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';
import styled from 'styled-components';
import Head from '@components/head';
import { copyContentAssets, getPosts, getTagsWithCounts } from '@lib/content';
import type { Post } from '@lib/types';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  h1 {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 50px;

    a {
      font-size: var(--fz-lg);
      font-weight: 400;
    }
  }

  ul {
    li {
      font-size: 24px;
      h2 {
        font-size: inherit;
        margin: 0;
        a {
          color: var(--light-slate);
        }
      }
      .subtitle {
        color: var(--slate);
        font-size: var(--fz-sm);

        .tag {
          margin-right: 10px;
        }
      }
    }
  }
`;

type TagPageProps = {
  tag: string;
  posts: Post[];
};

const TagPage = ({ tag, posts }: TagPageProps) => (
  <>
    <Head title={`Tagged: #${tag}`} />

    <StyledTagsContainer>
      <span className="breadcrumb">
        <span className="arrow">&larr;</span>
        <Link href="/pensieve">All memories</Link>
      </span>

      <h1>
        <span>#{tag}</span>
        <span>
          <Link href="/pensieve/tags">View all tags</Link>
        </span>
      </h1>

      <ul className="fancy-list">
        {posts.map(({ title, slug, date, tags }) => {
          const path = slug.replace('/pensieve/', '').replace(/^\//, '');

          return (
            <li key={slug}>
              <h2>
                <Link href={`/pensieve/${path}`}>{title}</Link>
              </h2>
              <p className="subtitle">
                <time>
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>&nbsp;&mdash;&nbsp;</span>
                {tags &&
                  tags.length > 0 &&
                  tags.map((tagItem, i) => (
                    <Link key={i} href={`/pensieve/tags/${kebabCase(tagItem)}`} className="tag">
                      #{tagItem}
                    </Link>
                  ))}
              </p>
            </li>
          );
        })}
      </ul>
    </StyledTagsContainer>
  </>
);

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getTagsWithCounts();

  const paths = tags.map(tag => ({
    params: { tag: kebabCase(tag.tag) },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TagPageProps> = async ({ params }) => {
  copyContentAssets();
  const tagParam = params?.tag as string;
  const posts = await getPosts();

  const filtered = posts.filter(post =>
    post.tags?.some(tag => kebabCase(tag) === kebabCase(tagParam)),
  );

  const displayTag = filtered[0]?.tags.find(tag => kebabCase(tag) === kebabCase(tagParam)) || tagParam;

  return {
    props: {
      tag: displayTag,
      posts: filtered,
    },
  };
};

export default TagPage;
