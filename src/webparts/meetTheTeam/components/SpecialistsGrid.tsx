import * as React from 'react';
import { Persona, PersonaSize, Spinner, SpinnerSize } from '@fluentui/react';
import * as strings from 'MeetTheTeamWebPartStrings';
import styles from './MeetTheTeam.module.scss';
import type { IEmployeeProfile, IPersonValue } from '../models/IMeetTheTeam';

export interface ISpecialistsGridProps {
  title: string;
  people: IPersonValue[];
  profiles: IEmployeeProfile[];
  isLoading: boolean;
  isEditMode: boolean;
}

/** "Dedicated Specialists": a responsive grid with one card per selected user. */
const SpecialistsGrid: React.FC<ISpecialistsGridProps> = props => {
  if (props.people.length === 0) {
    // Readers see nothing; editors see a hint.
    return props.isEditMode ? (
      <div className={styles.specialists}>
        {props.title && <h3 className={styles.specialistsTitle}>{props.title}</h3>}
        <p className={styles.hint}>{strings.SpecialistsEmptyHint}</p>
      </div>
    ) : null;
  }

  // Until the real profiles arrive, show the saved picker data so cards keep their order and size.
  // Match by login name (not by position), so a changed selection can never show another person's data.
  const cards: IEmployeeProfile[] = props.people.map(
    person => props.profiles.find(p => p.loginName === person.loginName) ?? { ...person }
  );

  return (
    <div className={styles.specialists}>
      {props.title && <h3 className={styles.specialistsTitle}>{props.title}</h3>}
      <ul className={styles.specialistGrid}>
        {cards.map(card => (
          <li key={card.loginName} className={styles.specialistCard}>
            <Persona
              className={styles.specialistPersona}
              text={card.displayName}
              secondaryText={card.jobTitle || (props.isLoading ? undefined : strings.RoleNotAvailable)}
              imageUrl={card.photoUrl}
              imageAlt={card.displayName}
              size={PersonaSize.size40}
            />
          </li>
        ))}
      </ul>
      {props.isLoading && (
        <Spinner size={SpinnerSize.small} label={strings.Loading} ariaLive="polite" labelPosition="right" className={styles.spinner} />
      )}
    </div>
  );
};

export default SpecialistsGrid;
