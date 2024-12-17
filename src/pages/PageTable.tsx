import React from "react";
import clsx from "clsx";
import styles from "./PageTable.module.css";
import NanoClamp from "nanoclamp";
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
  return (
    <div className="margin-top--lg margin-horiz--lg">
      <div className="row">
        {Items.map((item) => (
          <div className="col col--4 margin-bottom--lg" key={item.name}>
            <div className={clsx("card", styles.card)}>
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
                    className={clsx("avatar__name",styles.name)}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PagesTable;
