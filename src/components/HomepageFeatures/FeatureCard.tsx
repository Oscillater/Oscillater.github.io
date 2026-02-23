import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './FeatureCard.module.css';

export interface FeatureItem {
  title: string;
  description: JSX.Element;
  href: string;
}

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps): JSX.Element {
  return (
    <div className={clsx(styles.featureCard)}>
      <motion.a
        className={styles.featureLink}
        href={feature.href}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
      >
        <div className={styles.featureInner}>
          <div className={styles.featureNumber}>
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className={styles.featureContent}>
            <Heading as="h2" className={styles.featureTitle}>
              {feature.title}
            </Heading>
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
          <div className={styles.featureArrow}>
            <span className={styles.arrowLine}></span>
            <span className={styles.arrowHead}></span>
          </div>
        </div>
      </motion.a>
    </div>
  );
}

export default FeatureCard;