import { GetStaticPaths, GetStaticProps } from 'next';
import { FunctionComponent, useMemo } from 'react';

import { RichText } from 'prismic-dom';

import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

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

const Post: FunctionComponent<PostProps> = ({ post }) => {
  const { isFallback } = useRouter();

  const estimatedReadTimeInMinutes = useMemo(() => {
    if (isFallback) return 0;
    const wordsInPost = post.data.content.reduce((acc, curr) => {
      acc += curr.heading.split(' ').length;
      acc += curr.body.reduce(
        (accumulator, paragraph) =>
          accumulator + paragraph.text.split(' ').length,
        0
      );
      return acc;
    }, 0);

    const readWordsByMinute = 200;

    return Math.ceil(wordsInPost / readWordsByMinute);
  }, [isFallback, post]);

  if (isFallback) return <h1>Carregando...</h1>;

  return (
    <main className={styles.container}>
      <img src={post.data.banner.url} alt="Post banner" />
      <div className={styles.postContent}>
        <h1>{post.data.title}</h1>
        <div>
          <time>
            <FiCalendar />
            <p>
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </p>
          </time>
          <address>
            <FiUser />
            <p>{post.data.author}</p>
          </address>
          <div>
            <FiClock />
            <p>{estimatedReadTimeInMinutes} min</p>
          </div>
        </div>
        {post.data.content.map(content => {
          return (
            <article key={content.heading}>
              <h2>{content.heading}</h2>
              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: { post },
    revalidate: 60 * 60, // 1 hour
  };
};
