import * as React from 'react';
import { Label, NormalPeoplePicker, type IPersonaProps } from '@fluentui/react';
import type { IPersonValue } from '../models/IMeetTheTeam';
import type { PeopleSearchService } from '../services/PeopleSearchService';

export interface IPeoplePickerFieldProps {
  label: string;
  /** 1 for a single person, a bigger number (or undefined) for many. */
  itemLimit?: number;
  initialValue: IPersonValue[];
  searchService: PeopleSearchService;
  onChange: (value: IPersonValue[]) => void;
}

// We keep our own person data inside the Fluent persona object, so we can read it back later.
interface IPickerPersona extends IPersonaProps {
  person: IPersonValue;
}

function toPersona(person: IPersonValue): IPickerPersona {
  return {
    key: person.loginName,
    text: person.displayName,
    secondaryText: person.jobTitle || person.email,
    person
  };
}

/** Fluent UI v8 People Picker used inside the property pane. Selection order is kept. */
const PeoplePickerField: React.FC<IPeoplePickerFieldProps> = props => {
  const [selected, setSelected] = React.useState<IPickerPersona[]>(() => props.initialValue.map(toPersona));
  // Used to ignore slow search results that arrive after a newer search started.
  const searchId = React.useRef<number>(0);

  const onResolveSuggestions = async (filter: string, current?: IPersonaProps[]): Promise<IPersonaProps[]> => {
    if (filter.trim().length < 2) {
      return [];
    }
    const thisSearch: number = ++searchId.current;
    const results: IPersonValue[] = await props.searchService.searchUsers(filter).catch(() => []);
    if (thisSearch !== searchId.current) {
      return []; // a newer search replaced this one
    }
    // Hide people who are already selected.
    const chosen: Set<string> = new Set((current ?? []).map(p => String(p.key)));
    return results.filter(p => !chosen.has(p.loginName)).map(toPersona);
  };

  const onPickerChange = (items?: IPersonaProps[]): void => {
    const personas: IPickerPersona[] = (items ?? []) as IPickerPersona[];
    setSelected(personas);
    props.onChange(personas.map(p => p.person));
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <Label>{props.label}</Label>
      <NormalPeoplePicker
        onResolveSuggestions={onResolveSuggestions}
        selectedItems={selected}
        onChange={onPickerChange}
        itemLimit={props.itemLimit}
        resolveDelay={300}
        inputProps={{ 'aria-label': props.label, placeholder: 'Search by name or email' }}
        pickerSuggestionsProps={{
          noResultsFoundText: 'No users found',
          loadingText: 'Searching...',
          suggestionsHeaderText: 'Suggested people'
        }}
      />
    </div>
  );
};

export default PeoplePickerField;
