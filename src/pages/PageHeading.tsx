import clsx from 'clsx';
import React from 'react';
import Typical from 'react-typical';
import Heading from '@theme/Heading';
import styles from './PageHeading.module.css';
export const PageHeading = ({string1,string2}:{string1:string,string2:string}) => {
    return (
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className={styles.hero__title} >
            <Typical
              steps={[string1, 1000, `${string1}${string2}`, 1000, "", 50]}
              loop={Infinity}
              wrapper="p"
            />
          </Heading>
        </div>
      </header>
    );
  };
  