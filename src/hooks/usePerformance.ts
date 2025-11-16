import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Hook to debounce function calls
export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  ) as T;
};

// Hook to throttle function calls
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef(0);
  const lastCallTimer = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        callback(...args);
        lastCall.current = now;
      } else {
        if (lastCallTimer.current) {
          clearTimeout(lastCallTimer.current);
        }
        lastCallTimer.current = setTimeout(() => {
          callback(...args);
          lastCall.current = Date.now();
        }, delay - (now - lastCall.current));
      }
    },
    [callback, delay]
  ) as T;
};

// Hook to memoize expensive calculations
export const useMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => factory(), [factory, ...deps]);
};

// Hook to prevent unnecessary re-renders with deep comparison
export const useDeepMemo = <T>(
  value: T,
  deps: React.DependencyList
): T => {
  const ref = useRef<T>();
  const depsRef = useRef<React.DependencyList>();

  if (!ref.current || !depsRef.current || !areDepsEqual(deps, depsRef.current)) {
    ref.current = value;
    depsRef.current = deps;
  }

  return ref.current!;
};

// Helper function to compare dependencies
const areDepsEqual = (deps1: React.DependencyList, deps2: React.DependencyList): boolean => {
  if (deps1.length !== deps2.length) return false;
  return deps1.every((dep, index) => dep === deps2[index]);
};

// Hook to track component render count (for debugging)
export const useRenderCount = (componentName?: string) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    if (process.env.NODE_ENV === 'development' && componentName) {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
};

// Hook to optimize list rendering with virtualization
export const useVirtualization = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  return useMemo(() => {
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = 0;
    const endIndex = Math.min(visibleItemCount, itemCount);
    
    return {
      startIndex,
      endIndex,
      visibleItemCount,
      totalHeight: itemCount * itemHeight,
      offsetY: 0
    };
  }, [itemCount, itemHeight, containerHeight]);
};

// Hook to optimize image loading
export const useImagePreloader = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImages = async () => {
      const promises = imageUrls.map((url) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, url]));
            resolve();
          };
          img.onerror = () => {
            setFailedImages(prev => new Set([...prev, url]));
            reject(new Error(`Failed to load image: ${url}`));
          };
          img.src = url;
        });
      });

      try {
        await Promise.allSettled(promises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    preloadImages();
  }, [imageUrls]);

  return {
    loadedImages,
    failedImages,
    isImageLoaded: (url: string) => loadedImages.has(url),
    isImageFailed: (url: string) => failedImages.has(url)
  };
};

// Hook to optimize form validation
export const useFormValidation = <T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema: (values: T) => Partial<Record<keyof T, string>>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback((valuesToValidate: T) => {
    return validationSchema(valuesToValidate);
  }, [validationSchema]);

  const setValue = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback((field: keyof T) => {
    const fieldErrors = validate(values);
    setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
  }, [validate, values]);

  const validateAll = useCallback(() => {
    const allErrors = validate(values);
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [validate, values]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateAll,
    isValid: Object.keys(errors).length === 0
  };
};
