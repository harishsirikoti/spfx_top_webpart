import * as React from 'react';
import { Icon } from '@fluentui/react';
import styles from './MeetTheTeam.module.scss';
import type { IResponsibility } from '../models/IMeetTheTeam';

export interface IResponsibilitiesProps {
  description: string;
  items: IResponsibility[];
}

/** Right side of the leadership row: a bordered description box and a list with green check icons. */
const Responsibilities: React.FC<IResponsibilitiesProps> = props => {
  // Empty lines are skipped, so editors can leave a blank row without breaking the layout.
  const items: IResponsibility[] = props.items.filter(item => item.text && item.text.trim());

  return (
    <div className={styles.responsibilities}>
      {props.description && <p className={styles.descriptionBox}>{props.description}</p>}
      {items.length > 0 && (
        <ul className={styles.responsibilityList}>
          {items.map(item => (
            <li key={item.id} className={styles.responsibilityItem}>
              <span className={styles.checkCircle} aria-hidden="true">
                <Icon iconName="CheckMark" />
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Responsibilities;
