/// <reference types="cypress" />

import type { JSXOutput } from '@qwik.dev/core';

export declare function mount(element: JSXOutput): Cypress.Chainable<unknown>;

type MountParams = Parameters<typeof mount>;
type OptionsParam = MountParams[0];

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
