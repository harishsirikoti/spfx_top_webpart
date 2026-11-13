import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { PropertyPaneFieldType, type IPropertyPaneField } from '@microsoft/sp-property-pane';

interface ICustomFieldProps {
  key: string;
  onRender: (elem: HTMLElement) => void;
  onDispose: (elem: HTMLElement) => void;
}

/**
 * Wraps a React component as a custom property pane field.
 * `render` builds the React element. `onChange` is the web part's handler,
 * which saves the new value into the web part properties and re-renders the web part.
 */
export function createReactField<T>(
  targetProperty: string,
  render: (onChange: (value: T) => void) => React.ReactElement,
  onChange: (value: T) => void
): IPropertyPaneField<ICustomFieldProps> {
  let root: Root | undefined;

  return {
    type: PropertyPaneFieldType.Custom,
    targetProperty,
    properties: {
      key: targetProperty,
      onRender: (elem: HTMLElement) => {
        if (!root) {
          root = createRoot(elem);
        }
        root.render(render(onChange));
      },
      onDispose: () => {
        root?.unmount();
        root = undefined;
      }
    }
  };
}
