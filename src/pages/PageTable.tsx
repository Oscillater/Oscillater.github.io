import React, { useState } from "react";
import clsx from "clsx";
import styles from "./PageTable.module.css";
import NanoClamp from "nanoclamp";
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

const PagesTable: React.FC<TableItemsProps> = ({ Items, showImage }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="margin-top--lg margin-horiz--lg">
      <div className="row">
        {Items.map((item, index) => (
          <div className="col col--4 margin-bottom--lg" key={index}>
            <motion.div
              className={clsx("card", styles.card, {
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
                      className="avatar__photo"
                    />
                  </div>
                )}
                <div className="avatar__intro">
                  <a
                    href={item.url}
                    rel="noopener noreferrer"
                    className={clsx("avatar__name", styles.name)}
                  >
                    {item.name}
                  </a>
                  <div className="avatar__subtitle">
                    <NanoClamp
                      className="custom-class"
                      is="p"
                      lines={2}
                      text={item.description}
                    />
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
