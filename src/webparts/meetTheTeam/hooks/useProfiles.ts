import * as React from 'react';
import type { IEmployeeProfile, IPersonValue } from '../models/IMeetTheTeam';
import type { ProfileService } from '../services/ProfileService';

export interface IUseProfilesResult {
  /** Profiles for the CURRENT selection only. Empty while they are loading. */
  profiles: IEmployeeProfile[];
  isLoading: boolean;
}

interface ILoadedState {
  /** The selection these profiles belong to. */
  key: string;
  profiles: IEmployeeProfile[];
}

/**
 * Loads profiles for the selected people.
 * Results are tagged with the selection they were loaded for, so data from an
 * older selection is never shown for a new one.
 */
export function useProfiles(service: ProfileService, people: IPersonValue[]): IUseProfilesResult {
  const [loaded, setLoaded] = React.useState<ILoadedState>({ key: '', profiles: [] });

  // A stable text key: the effect only runs again when the real selection changes.
  const selectionKey: string = people.map(p => p.loginName).join('|');

  React.useEffect(() => {
    let isStale: boolean = false; // becomes true when this effect is cleaned up
    if (people.length === 0) {
      return undefined;
    }

    service.getProfiles(people)
      .then(result => {
        if (!isStale) {
          setLoaded({ key: selectionKey, profiles: result });
        }
      })
      .catch(() => {
        // getProfile already falls back to saved picker data, so this is only a safety net.
        if (!isStale) {
          setLoaded({ key: selectionKey, profiles: [] });
        }
      });

    return () => {
      isStale = true;
    };
    // "people" is represented by selectionKey; listing it would re-run on every render.
  }, [service, selectionKey]);

  const isCurrent: boolean = loaded.key === selectionKey;
  return {
    profiles: isCurrent ? loaded.profiles : [],
    isLoading: people.length > 0 && !isCurrent
  };
}
