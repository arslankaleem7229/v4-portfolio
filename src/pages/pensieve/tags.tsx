import React from 'react';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';
import styled from 'styled-components';
import Head from '@components/head';
import { copyContentAssets, getTagsWithCounts } from '@lib/content';
import type { TagCount } from '@lib/types';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  h1 {
    margin-bottom: 50px;
  }
  ul {
    color: var(--light-slate);

    li {
      font-size: var(--fz-xxl);

      a {
        color: var(--light-slate);

        .count {
          color: var(--slate);
          font-family: var(--font-mono);
          font-size: var(--fz-md);
        }
      }
    }
  }
`;

type TagsProps = {
  tags: TagCount[];
};

const TagsPage = ({ tags }: TagsProps) => (
  <>
    <Head title="Tags" />

    <StyledTagsContainer>
      <span className="breadcrumb">
        <span className="arrow">&larr;</span>
        <Link href="/pensieve">All memories</Link>
      </span>

      <h1>Tags</h1>
      <ul className="fancy-list">
        {tags.map(tag => (
          <li key={tag.tag}>
            <Link href={`/pensieve/tags/${kebabCase(tag.tag)}`} className="inline-link">
              {tag.tag} <span className="count">({tag.totalCount})</span>
            </Link>
          </li>
        ))}
      </ul>
    </StyledTagsContainer>
  </>
);

export const getStaticProps: GetStaticProps<TagsProps> = async () => {
  copyContentAssets();
  const tags = await getTagsWithCounts();

  return {
    props: {
      tags,
    },
  };
};

export default TagsPage;
