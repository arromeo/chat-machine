import { useContext } from 'react';
import { InteractionContext } from './interactionProvider';

export function useInteraction() {
  const interactionContext = useContext(InteractionContext);

  return interactionContext;
}
