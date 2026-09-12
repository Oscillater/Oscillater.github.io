import React, { useState } from "react";
import clsx from "clsx";
import styles from "./PageTable.module.css";
import { motion } from "framer-motion";
interface PageItem {
  name: string;
  url: string;
  description: string;
  imageUrl: string;
}

interface TableItemsProps {
  Items: PageItem[];
  showImage: boolean;
}

// 图片加载失败时的兜底占位图：灰底 + 人形剪影。
// SVG 写成可读的模板，再整体 URL 编码成 data URI（内联，无额外资源请求）。
const FALLBACK_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="#eceff4" />
    <circle cx="32" cy="26" r="11" fill="#b8c0cc" />
    <path d="M10 64c0-12.2 9.8-22 22-22s22 9.8 22 22z" fill="#b8c0cc" />
  </svg>
`;

const FALLBACK_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  FALLBACK_SVG
)}`;

const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
): void => {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied) return; // 占位图再加载失败时避免死循环
  img.dataset.fallbackApplied = "true";
  img.src = FALLBACK_IMAGE;
};

const PagesTable: React.FC<TableItemsProps> = ({ Items, showImage }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="margin-top--lg margin-horiz--lg">
      <div className="row">
        {Items.map((item, index) => (
          <div className="col col--4 margin-bottom--lg" key={index}>
            <motion.div
              className={clsx("card", styles.cardItem, {
                "shadow--tl": hovered === index,
                "": hovered !== index,
              })}
              animate={{
                scale: hovered === index ? 1.05 : 1.0,
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={clsx("card__header", styles.cardBody)}>
                {showImage && (
                  <div className={clsx("avatar", styles.img)}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className={clsx("avatar__photo", styles.avatarImg)}
                      loading="lazy"
                      onError={handleImageError}
                    />
                  </div>
                )}
                <div className="avatar__intro">
                  <a
                    href={item.url}
                    rel="noopener noreferrer"
                    title={item.name}
                    className={clsx("avatar__name", styles.name)}
                  >
                    {item.name}
                  </a>
                  <div className="avatar__subtitle">
                    <p className={styles.description} title={item.description}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PagesTable;
