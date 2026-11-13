import * as React from 'react';
import { DefaultButton, IconButton, Label, TextField } from '@fluentui/react';
import type { IResponsibility } from '../models/IMeetTheTeam';

export interface IResponsibilitiesFieldProps {
  label: string;
  addLabel: string;
  initialValue: IResponsibility[];
  onChange: (value: IResponsibility[]) => void;
}

// Simple unique id for new rows. It only needs to be unique inside this list.
function newId(): string {
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

/** Editor for the responsibilities list: add, edit, delete and move up/down. */
const ResponsibilitiesField: React.FC<IResponsibilitiesFieldProps> = props => {
  const [items, setItems] = React.useState<IResponsibility[]>(props.initialValue);

  // Every change updates the screen and tells the web part in one step.
  const update = (next: IResponsibility[]): void => {
    setItems(next);
    props.onChange(next);
  };

  const move = (index: number, direction: -1 | 1): void => {
    const target: number = index + direction;
    if (target < 0 || target >= items.length) {
      return;
    }
    const next: IResponsibility[] = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  return (
    <div>
      <Label>{props.label}</Label>
      {items.map((item, index) => (
        <div key={item.id} style={{ marginBottom: 12 }}>
          <TextField
            multiline
            autoAdjustHeight
            rows={2}
            value={item.text}
            ariaLabel={`${props.label} ${index + 1}`}
            onChange={(_, value) => update(items.map(i => (i.id === item.id ? { ...i, text: value ?? '' } : i)))}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              iconProps={{ iconName: 'Up' }}
              title="Move up"
              ariaLabel={`Move responsibility ${index + 1} up`}
              disabled={index === 0}
              onClick={() => move(index, -1)}
            />
            <IconButton
              iconProps={{ iconName: 'Down' }}
              title="Move down"
              ariaLabel={`Move responsibility ${index + 1} down`}
              disabled={index === items.length - 1}
              onClick={() => move(index, 1)}
            />
            <IconButton
              iconProps={{ iconName: 'Delete' }}
              title="Delete"
              ariaLabel={`Delete responsibility ${index + 1}`}
              onClick={() => update(items.filter(i => i.id !== item.id))}
            />
          </div>
        </div>
      ))}
      <DefaultButton
        iconProps={{ iconName: 'Add' }}
        text={props.addLabel}
        onClick={() => update([...items, { id: newId(), text: '' }])}
      />
    </div>
  );
};

export default ResponsibilitiesField;
