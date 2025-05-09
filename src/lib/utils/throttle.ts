/**
 * Creates a throttled version of a function that limits its execution frequency.
 * 
 * @param func - The function to be throttled
 * @param limit - The minimum time (in milliseconds) between function executions
 * @param options - Optional configuration for more advanced throttling behavior
 * @returns A throttled version of the input function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T, 
    limit: number, 
    options: { 
      leading?: boolean, 
      trailing?: boolean 
    } = { leading: true, trailing: true }
  ): T {
    let inThrottle: boolean;
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number;
    let context: any;
    let args: any[];
  
    const throttled = function(this: any, ...callArgs: any[]) {
      context = this;
      args = callArgs;
      const now = Date.now();
  
      // First invocation handling
      if (!lastRan) {
        if (options.leading !== false) {
          func.apply(context, args);
          lastRan = now;
        } else {
          lastRan = now;
        }
      }
  
      // Clear any existing timeout
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
  
      // Check if we're in a throttle period
      if (!inThrottle && now >= lastRan + limit) {
        // Execute immediately if not in throttle and enough time has passed
        lastRan = now;
        func.apply(context, args);
        inThrottle = false;
      } else {
        // Schedule a potential trailing call
        if (options.trailing !== false) {
          lastFunc = setTimeout(() => {
            // Only execute if enough time has passed since last execution
            const timeSinceLastRan = Date.now() - lastRan;
            if (timeSinceLastRan >= limit) {
              lastRan = Date.now();
              func.apply(context, args);
              inThrottle = false;
            }
          }, limit - (now - lastRan));
        }
        
        inThrottle = true;
      }
    } as T;
  
    // Add method to cancel any pending throttled call
    (throttled as any).cancel = () => {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      lastRan = 0;
      inThrottle = false;
    };
  
    return throttled;
  }