import React from 'react';
import { motion } from 'framer-motion';
import styles from './FeatureSection.module.css';
import FeatureCard, { FeatureItem } from './FeatureCard';
import useIntersectionObserver from './useIntersectionObserver';

interface FeatureSectionProps {
  features: FeatureItem[];
}

function FeatureSection({ features }: FeatureSectionProps): JSX.Element {
  const { ref: featuresRef, isVisible: featuresVisible } = useIntersectionObserver({ threshold: 0.15, rootMargin: '-30px' });

  return (
    <section ref={featuresRef} className={styles.features}>
      <motion.div
        className={styles.featuresContainer}
        initial={{ opacity: 0, y: 50 }}
        animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
      >
        <div className={styles.featureGrid}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={featuresVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.7, delay: 0.15 + idx * 0.1, ease: "easeOut" }}
            >
              <FeatureCard feature={feature} index={idx} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default FeatureSection;