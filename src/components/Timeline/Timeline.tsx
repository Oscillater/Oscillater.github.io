import React from "react";
import clsx from "clsx";
import styles from "./Timeline.module.css";

// 时间轴每一项的数据类型
export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
}

// 时间轴组件 props
interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => (
  <section className={clsx("container", styles.timelineSection)}>
    <ul className={styles.timeline}>
      {items.map((item, idx) => (
        <li key={idx} className={styles.timelineItem}>
          <div className={styles.timelineDot} />
          <div className={styles.timelineContent}>
            <div className={styles.timelineDate}>{item.date}</div>
            <div className={styles.timelineTitle}>{item.title}</div>
            {item.description && (
              <div className={styles.timelineDesc}>{item.description}</div>
            )}
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default Timeline;