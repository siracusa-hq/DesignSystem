import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

// jsdom に存在しない API のモック
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

// cmdk が scrollIntoView を使用するがjsdomに未実装
Element.prototype.scrollIntoView = function () {};

// Radix UI が PointerEvent の capture API を使用するがjsdomに未実装
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function () { return false; };
  Element.prototype.setPointerCapture = function () {};
  Element.prototype.releasePointerCapture = function () {};
}
