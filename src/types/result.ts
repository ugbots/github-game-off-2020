///// Types

export type Result<F, S> = Failure<F> | Success<S>;

export interface Failure<F> {
  readonly kind: 'Failure';
  readonly error: F;
}

export interface Success<S> {
  readonly kind: 'Success';
  readonly value: S;
}

///// Constructors

export const failure = <F>(error: F): Failure<F> => ({
  kind: 'Failure',
  error,
});

export const success = <S>(value: S): Success<S> => ({
  kind: 'Success',
  value,
});

///// Accessors

export const isSuccess = <F, S>(result: Result<F, S>): result is Success<S> => {
  return result.kind === 'Success';
};

///// Combinators

export const map = <F, S, T>(r: Result<F, S>, f: (s: S) => T): Result<F, T> => {
  if (!isSuccess(r)) {
    return r;
  }

  return success(f(r.value));
};

export const flatMap = <F, S, T>(
  r: Result<F, S>,
  f: (s: S) => Result<F, T>,
): Result<F, T> => {
  if (!isSuccess(r)) {
    return r;
  }

  return f(r.value);
};
