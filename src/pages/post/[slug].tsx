import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const Post: FunctionComponent = ({ slug }) => {
  return <h1>{slug}</h1>;
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(response);

  return {
    props: {
      slug,
    },
    revalidate: 60 * 60, // 1 hour
  };
};
