import * as React from 'react';
import styles from './MeetTheTeam.module.scss';
import type { IMeetTheTeamProps } from './IMeetTheTeamProps';
import { useElementWidth } from '../hooks/useElementWidth';
import { useProfiles } from '../hooks/useProfiles';
import FeaturedCard from './FeaturedCard';
import Responsibilities from './Responsibilities';
import SpecialistsGrid from './SpecialistsGrid';

// Below this web part width, the profile card and the responsibilities stack vertically.
const STACK_BREAKPOINT: number = 760;

const MeetTheTeam: React.FC<IMeetTheTeamProps> = props => {
  const [rootRef, width] = useElementWidth<HTMLElement>();
  const isStacked: boolean = width > 0 && width < STACK_BREAKPOINT;

  // The featured employee is loaded as a list of one, so it shares the same loader as specialists.
  const featuredPeople = React.useMemo(
    () => (props.featuredEmployee ? [props.featuredEmployee] : []),
    [props.featuredEmployee]
  );
  const featured = useProfiles(props.profileService, featuredPeople);
  const specialists = useProfiles(props.profileService, props.specialists);

  const hasResponsibilities: boolean = !!props.description || props.responsibilities.length > 0;

  return (
    <section ref={rootRef} className={styles.meetTheTeam}>
      {props.title && <h2 className={styles.mainTitle}>{props.title}</h2>}

      <div className={`${styles.leadership} ${isStacked ? styles.stacked : ''}`}>
        <FeaturedCard
          sectionTitle={props.featuredSectionTitle}
          profile={featured.profiles[0]}
          isLoading={featured.isLoading}
          hasSelection={!!props.featuredEmployee}
          teamDlUrl={props.teamDlUrl}
          isEditMode={props.isEditMode}
        /> 
        {hasResponsibilities && (
          <Responsibilities description={props.description} items={props.responsibilities} />
        )}
      </div>

      <SpecialistsGrid
        title={props.specialistsTitle}
        people={props.specialists}
        profiles={specialists.profiles}
        isLoading={specialists.isLoading}
        isEditMode={props.isEditMode}
      />
    </section>
  );
};

export default MeetTheTeam;
