import { FunctionComponent } from 'react';

import Image from 'next/image';

import styles from './header.module.scss';

const Header: FunctionComponent = () => {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/Logo.png"
          alt="logo"
          width="238.62"
          height="25"
          loading="eager"
        />
      </div>
    </main>
  );
};

export default Header;
