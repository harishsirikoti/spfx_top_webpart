import * as React from 'react';
import { DefaultButton, Persona, PersonaSize, PrimaryButton, Spinner, SpinnerSize } from '@fluentui/react';
import * as strings from 'MeetTheTeamWebPartStrings';
import styles from './MeetTheTeam.module.scss';
import type { IEmployeeProfile } from '../models/IMeetTheTeam';
import { getSafeUrl } from '../utils/urlValidator';

export interface IFeaturedCardProps {
  sectionTitle: string;
  profile: IEmployeeProfile | undefined;
  isLoading: boolean;
  hasSelection: boolean;
  teamDlUrl: string;
  isEditMode: boolean;
}

/** The large profile card on the left: title, photo, name, job title and two buttons. */
const FeaturedCard: React.FC<IFeaturedCardProps> = props => {
  const { profile } = props;
  // Buttons only show when their link is valid. Unsafe values are dropped here too.
  const emailHref: string | undefined = profile?.email ? getSafeUrl(`mailto:${profile.email}`) : undefined;
  const teamDlHref: string | undefined = getSafeUrl(props.teamDlUrl);

  let body: React.ReactNode;
  if (!props.hasSelection) {
    body = props.isEditMode ? <p className={styles.hint}>{strings.FeaturedEmptyHint}</p> : null;
  } else if (props.isLoading && !profile) {
    body = <Spinner size={SpinnerSize.medium} label={strings.Loading} ariaLive="polite" labelPosition="right" className={styles.spinner} />;
  } else if (profile) {
    body = (
      <>
        <Persona
          className={styles.featuredPersona}
          text={profile.displayName}
          secondaryText={profile.jobTitle || strings.RoleNotAvailable}
          imageUrl={profile.photoUrl}
          size={PersonaSize.size72}
          imageAlt={profile.displayName}
        />
        <div className={styles.buttonRow}>
          {emailHref && (
            <PrimaryButton className={styles.emailButton} href={emailHref} text={strings.EmailButtonText} />
          )}
          {teamDlHref && (
            <DefaultButton className={styles.teamDlButton} href={teamDlHref} text={strings.TeamDlButtonText} />
          )}
        </div>
      </>
    );
  }

  return (
    <div className={styles.featuredCard}>
      {props.sectionTitle && <h3 className={styles.featuredTitle}>{props.sectionTitle}</h3>}
      {body}
    </div>
  );
};

export default FeaturedCard;
