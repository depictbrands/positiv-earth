// Minimal pub/sub so animated systems can publish their live local progress to
// the debug overlay without prop-drilling. Dev-only tool (Golden rule #4).

type Listener = () => void;

const values = new Map<string, number>();
const listeners = new Set<Listener>();

export function setDebugValue(name: string, value: number): void {
  values.set(name, value);
  listeners.forEach((fn) => fn());
}

export function getDebugValues(): ReadonlyMap<string, number> {
  return values;
}

export function subscribeDebug(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
