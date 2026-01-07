import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, debounceAsync } from '../debounce';

describe('Debounce Utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('a');
      debounced('b');
      debounced('c');

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('c');
    });

    it('should call function with latest arguments', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced(1, 2, 3);
      debounced(4, 5, 6);
      debounced(7, 8, 9);

      vi.advanceTimersByTime(50);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(7, 8, 9);
    });

    it('should reset delay on each call', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      vi.advanceTimersByTime(50);

      debounced();
      vi.advanceTimersByTime(50);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple executions after delay', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);

      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should have cancel method', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      expect(debounced.cancel).toBeDefined();
      expect(typeof debounced.cancel).toBe('function');
    });

    it('should cancel pending execution', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced.cancel();

      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it('should handle cancel when no execution is pending', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      expect(() => debounced.cancel()).not.toThrow();
    });

    it('should handle rapid calls during race conditions', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 16); // 60fps

      for (let i = 0; i < 100; i++) {
        debounced(i);
      }

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(16);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(99);
    });

    it('should work with different delay values', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();

      const debounced1 = debounce(fn1, 50);
      const debounced2 = debounce(fn2, 100);

      debounced1();
      debounced2();

      vi.advanceTimersByTime(50);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn2).toHaveBeenCalledTimes(1);
    });
  });

  describe('debounceAsync', () => {
    it('should debounce async function calls', async () => {
      const fn = vi.fn().mockResolvedValue('result');
      const debounced = debounceAsync(fn, 100);

      const promise = debounced('test');

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      await promise;

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('should return promise that resolves with function result', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const debounced = debounceAsync(fn, 100);

      const promise = debounced();

      vi.advanceTimersByTime(100);

      const result = await promise;
      expect(result).toBe('success');
    });

    it('should reject previous promises when called again', async () => {
      const fn = vi.fn().mockResolvedValue('result');
      const debounced = debounceAsync(fn, 100);

      const promise1 = debounced('first');
      const promise2 = debounced('second');

      vi.advanceTimersByTime(100);

      await expect(promise1).rejects.toThrow('Debounced: newer call made');
      await expect(promise2).resolves.toBe('result');
    });

    it('should handle async function errors', async () => {
      const error = new Error('test error');
      const fn = vi.fn().mockRejectedValue(error);
      const debounced = debounceAsync(fn, 100);

      const promise = debounced();

      vi.advanceTimersByTime(100);

      await expect(promise).rejects.toThrow('test error');
    });

    it('should have cancel method', () => {
      const fn = vi.fn().mockResolvedValue('result');
      const debounced = debounceAsync(fn, 100);

      expect(debounced.cancel).toBeDefined();
      expect(typeof debounced.cancel).toBe('function');
    });

    it('should cancel pending execution and reject promise', async () => {
      const fn = vi.fn().mockResolvedValue('result');
      const debounced = debounceAsync(fn, 100);

      const promise = debounced();
      debounced.cancel();

      await expect(promise).rejects.toThrow('Debounced: cancelled');
      expect(fn).not.toHaveBeenCalled();
    });

    it('should handle multiple rapid calls', async () => {
      const fn = vi.fn().mockResolvedValue('final');
      const debounced = debounceAsync(fn, 16);

      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(debounced(i));
      }

      vi.advanceTimersByTime(16);

      // First 9 should reject, last should resolve
      for (let i = 0; i < 9; i++) {
        await expect(promises[i]).rejects.toThrow('Debounced: newer call made');
      }
      await expect(promises[9]).resolves.toBe('final');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(9);
    });
  });

  describe('Race Condition Prevention', () => {
    it('should prevent dimension calculation race conditions', () => {
      const calculateDimensions = vi.fn();
      const debouncedCalc = debounce(calculateDimensions, 16);

      // Simulate rapid slider movements
      for (let i = 0; i < 50; i++) {
        debouncedCalc({ padding: i, frameType: 'browser' });
      }

      expect(calculateDimensions).not.toHaveBeenCalled();

      vi.advanceTimersByTime(16);

      // Should only calculate once with final values
      expect(calculateDimensions).toHaveBeenCalledTimes(1);
      expect(calculateDimensions).toHaveBeenCalledWith({
        padding: 49,
        frameType: 'browser',
      });
    });

    it('should handle interleaved rapid calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 20);

      debounced('call1');
      vi.advanceTimersByTime(10);
      debounced('call2');
      vi.advanceTimersByTime(10);
      debounced('call3');

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(20);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('call3');
    });
  });
});
