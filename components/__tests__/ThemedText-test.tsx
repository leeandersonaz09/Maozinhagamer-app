import * as React from 'react';
import renderer, { act } from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

it(`renders correctly`, () => {
  let root: renderer.ReactTestRenderer;
  act(() => {
    root = renderer.create(<ThemedText>Snapshot test!</ThemedText>);
  });

  expect(root!.toJSON()).toMatchSnapshot();
});
