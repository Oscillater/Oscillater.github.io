import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import type { Collection } from "@site/src/data/collections";
import styles from "./styles.module.css";

function CollectionContent({ collection }: { collection: Collection }) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        {collection.kind && <span className={styles.kind}>{collection.kind}</span>}
        <h1 className={styles.title}>{collection.title}</h1>
        {collection.description && (
          <p className={styles.description}>{collection.description}</p>
        )}
        <p className={styles.meta}>共 {collection.items.length} 篇 · 按阅读顺序排列</p>
      </header>

      <ol className={styles.items}>
        {collection.items.map((item, idx) => (
          <li key={idx} className={styles.item}>
            <Link href={item.url} className={styles.itemLink}>
              <span className={styles.part}>{item.part ?? `第 ${idx + 1} 篇`}</span>
              <span className={styles.label}>{item.label ?? item.url}</span>
              {item.note && <span className={styles.note}>{item.note}</span>}
            </Link>
          </li>
        ))}
      </ol>

      <footer className={styles.footer}>
        <Link href="/blog" className={styles.backLink}>
          ← 返回有所得
        </Link>
      </footer>
    </main>
  );
}

export default function CollectionPage({
  collection,
}: {
  collection: Collection;
}): JSX.Element {
  return (
    <Layout title={collection.title} description={collection.description}>
      <CollectionContent collection={collection} />
    </Layout>
  );
}
