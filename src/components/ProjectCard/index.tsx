import React from "react";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { FiBookOpen, FiExternalLink, FiFileText } from "react-icons/fi";
import type { Project } from "../../data/projects";
import { TAG_ICONS } from "../../data/tagIcons";
import styles from "./ProjectCard.module.css";

// 根据 URL 推断链接图标：GitHub / 文集 / 站内文章 / 外链
function LinkIcon({ url }: { url: string }) {
  if (url.includes('github.com')) {
    return <SiGithub size="0.95em" aria-hidden={true} />;
  }
  if (url.startsWith('/collections')) {
    return <FiBookOpen size="0.95em" aria-hidden={true} />;
  }
  if (url.startsWith('/')) {
    return <FiFileText size="0.95em" aria-hidden={true} />;
  }
  return <FiExternalLink size="0.95em" aria-hidden={true} />;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      className={styles.projectCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      role="article"
      aria-label={`项目: ${project.title}`}
    >
      {project.image && (
        <div className={styles.projectImage}>
          <img src={project.image} alt={project.title} loading="lazy" />
        </div>
      )}
      <div className={styles.projectContent}>
        <div className={styles.titleRow}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          {project.period && <span className={styles.projectPeriod}>{project.period}</span>}
        </div>
        <p className={styles.projectDescription}>{project.description}</p>
        <div className={styles.cardMeta}>
          {project.tags && project.tags.length > 0 && (
            <div className={styles.tagRow}>
              {project.tags.map(tag => {
                const spec = TAG_ICONS[tag];
                return (
                  <span key={tag} className={styles.techTag}>
                    {spec && <spec.icon size="0.95em" color={spec.color} aria-hidden={true} />}
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
          {project.links.length > 0 && (
            <div className={styles.linkRow}>
              {project.links.map(link => (
                <Link
                  key={link.url}
                  href={link.url}
                  className={styles.projectLink}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <LinkIcon url={link.url} />
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
