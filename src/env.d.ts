/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

import '@hufe921/canvas-editor';

declare module '@hufe921/canvas-editor' {
  export interface IElementStyle {
    indent?: number;
    titleLevel?: string;
    spacingBefore?: string | number;
    spacingAfter?: string | number;
  }
  export interface ITd {
    isVerticalRestart?: boolean;
    isVerticalContinue?: boolean;
  }
}
