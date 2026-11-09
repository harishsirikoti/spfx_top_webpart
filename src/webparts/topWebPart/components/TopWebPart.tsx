import * as React from 'react';
import { FontIcon } from '@fluentui/react/lib/Icon';
import styles from './TopWebPart.module.scss';
import type { ITopWebPartProps } from './ITopWebPartProps';

/**
 * Informational announcement banner: megaphone icon, title and description.
 * Purely presentational - there are intentionally no links or click handlers.
 */
const TopWebPart: React.FC<ITopWebPartProps> = ({ title, description }) => {
  return (
    <section className={styles.banner}>
      {/* Decorative icon; hidden from screen readers */}
      <div className={styles.iconBox} aria-hidden="true">
        <FontIcon iconName="Megaphone" className={styles.icon} />
      </div>
      <div className={styles.content}>
        {/* Empty values are not rendered so the banner collapses gracefully */}
        {title && <div className={styles.title}>{title}</div>}
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </section>
  );
};

export default TopWebPart;
