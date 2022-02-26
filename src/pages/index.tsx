import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { FunctionComponent } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const Home: FunctionComponent<HomeProps> = ({ postsPagination }) => {
  console.log(postsPagination);
  return <h1>Test</h1>;
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 100,
      // page: 2,
    }
  );

  const posts = postsResponse.results.map(
    ({ uid, data: { title, subtitle, author }, first_publication_date }) => {
      return {
        slug: uid,
        first_publication_date,
        data: {
          title,
          subtitle,
          author,
        },
      };
    }
  );

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    revalidate: 60 * 60, // 1 hour
  };
};
