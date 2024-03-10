export type StateUpdater<S> = (prevState: S) => S;

export type SetStateAction<S> = S | StateUpdater<S>;

export type Dispatch<A> = (value: A) => void;
