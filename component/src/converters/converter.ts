export interface Converter<I, O, C = unknown> {
  convert(input: I, context?: C): O;
}
