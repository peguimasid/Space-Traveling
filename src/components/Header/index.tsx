import { FunctionComponent } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

const Header: FunctionComponent = () => {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <Link href="/">
          <a>
            <Image
              src="/Logo.png"
              alt="logo"
              width="238.62"
              height="25"
              loading="eager"
            />
          </a>
        </Link>
      </div>
    </main>
  );
};

export default Header;
