import type { UnwrapNestedRefs } from 'vue'
import type { ZodType } from 'zod'

type FormActions<T> = {
  reset: () => void
  fields: UnwrapNestedRefs<Nullfy<T>>
  submit: (handleFn: (fields: UnwrapNestedRefs<T>) => void) => void
  errors: UnwrapNestedRefs<Partial<Record<keyof T, string | null>>>
  set: (form: Partial<T>) => void
  setError: (errors: Partial<T>) => void
}

type FormOptions<T> = {
  initialValue: Nullfy<T>
  resolver?: ZodType<T>
}

export default function useForm<T extends object>({ initialValue, resolver }: FormOptions<T>): FormActions<T> {
  const initial = structuredClone(initialValue)

  const fields = reactive<Nullfy<T>>(initialValue)

  const errors = reactive<Partial<Record<keyof T, string | null>>>({})

  function reset(): void {
    Object.keys(fields).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      fields[key] = initial[key]
    })

    resetErrors()
  }

  function submit(handleFn: (fields: UnwrapNestedRefs<T>) => void): void {
    if (resolver) {
      resetErrors()

      const validationResult = resolver.safeParse(fields)

      if (!validationResult.success) {
        validationResult.error.errors.forEach((error) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          errors[error.path[0]] = error.message
        })

        return
      }
    }

    handleFn({ ...fields } as UnwrapNestedRefs<T>)
  }

  function set(form: Partial<T>): void {
    Object.keys(fields).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      fields[key] = form[key]
    })

    resetErrors()
  }

  function setError(fields: Partial<T>): void {
    Object.keys(fields).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      errors[key] = fields[key]
    })
  }

  // HELPERS

  function resetErrors(): void {
    Object.keys(fields).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      errors[key] = null
    })
  }

  return { reset, fields, submit, errors, set, setError }
}

type Nullfy<T> = {
  [K in keyof T]: T[K] | null
}
