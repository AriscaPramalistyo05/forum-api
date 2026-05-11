import { describe, it, expect } from 'vitest';
import { helloWorld } from '../HelloWorld.js';

describe('HelloWorld', () => {
  it('should return hello world', () => {
    expect(helloWorld()).toBe('Hello World');
  });
});
