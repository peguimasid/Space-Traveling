import { GetStaticProps } from 'next';
import Image from 'next/image';

import Prismic from '@prismicio/client';
import { FunctionComponent } from 'react';
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
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Image
            src="/Logo.png"
            alt="logo"
            width="238.62"
            height="25"
            loading="eager"
          />
        </div>
        {results.map(({ uid, first_publication_date, data }) => (
          <article key={uid}>
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
          </article>
        ))}
        {next_page && (
          <button type="button" onClick={() => console.log('carrega mais')}>
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
      pageSize: 2,
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
