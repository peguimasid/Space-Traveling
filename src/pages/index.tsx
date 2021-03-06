import { GetStaticProps } from 'next';
import Link from 'next/link';

import Prismic from '@prismicio/client';
import { FunctionComponent, useCallback, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

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

const Home: FunctionComponent<HomeProps> = ({
  postsPagination: { results, next_page },
}) => {
  const [posts, setPosts] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  const [fetchingPosts, setFetchingPosts] = useState(false);

  const handleLoadMorePosts = useCallback(async () => {
    setFetchingPosts(true);
    const { results: responseResults, next_page: responseNextPage } =
      await fetch(nextPage).then(response => response.json());

    setPosts(prevState => [...prevState, ...responseResults]);
    setNextPage(responseNextPage);
    setFetchingPosts(false);
  }, [nextPage]);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {posts.map(({ uid, first_publication_date, data }) => (
          <div key={uid}>
            <Link href={`/post/${uid}`}>
              <a>
                <h1>{data.title}</h1>
                <p>{data.subtitle}</p>
                <div>
                  <time>
                    <FiCalendar />
                    <p>
                      {format(new Date(first_publication_date), 'dd MMM yyyy', {
                        locale: ptBR,
                      })}
                    </p>
                  </time>
                  <address>
                    <FiUser />
                    <p>{data.author}</p>
                  </address>
                </div>
              </a>
            </Link>
          </div>
        ))}
        {nextPage && (
          <button
            type="button"
            disabled={fetchingPosts}
            onClick={handleLoadMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </main>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      page: 1,
    }
  );

  const posts = postsResponse.results.map(
    ({ uid, data: { title, subtitle, author }, first_publication_date }) => {
      return {
        uid,
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
