import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { EndorsementItem } from '../../types/endorsement';
import styles from './EndorsementCard.module.css';

export interface EndorsementCardProps {
  endorsement: EndorsementItem;
  className?: string;
}

/**
 * 安利卡片组件
 * 展示安利内容的quote、source、link信息
 */
const EndorsementCard: React.FC<EndorsementCardProps> = ({
  endorsement,
  className,
}) => {
  const handleSourceClick = () => {
    // 在新标签页打开链接
    if (endorsement.link) {
      window.open(endorsement.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className={clsx(styles.endorsementCard, className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 安利语录 */}
      <div className={styles.quoteSection}>
        <div className={styles.quote}>
          {endorsement.quote}
        </div>
      </div>

      {/* 出处信息 */}
      <div
        className={styles.sourceSection}
        onClick={handleSourceClick}
        role={endorsement.link ? "button" : undefined}
        tabIndex={endorsement.link ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSourceClick();
          }
        }}
      >
        {endorsement.source}
      </div>
    </motion.div>
  );
};

export default EndorsementCard;