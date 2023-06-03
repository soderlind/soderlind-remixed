import { parseJSON } from "date-fns";

// export function groupByYear<T>(objectArray: any[]) {
//   const InitialValue: T = {} as T;
//   return objectArray.reduce((acc, obj) => {
//     const key = parseJSON(obj.date).getFullYear();
//     (acc[key] as unknown as any[]) ??= [];
//     (acc[key] as unknown as any[]).push(obj);
//     return acc;
//   }, InitialValue);
// }
export function groupByYear<Type>(objectArray: any[], property: string) {
  const InitialValue: Type = {} as Type;
  const oArray = objectArray as unknown as any[];
  return oArray.reduce<Type>((acc, obj) => {
    const key = parseJSON(obj[property]).getFullYear() as keyof Type; //as unknown as string;
    (acc[key] as any[]) ??= [];
    (acc[key] as any[]).push(obj);
    return acc;
  }, InitialValue);
}

export const isDefinitelyAnError = (error: any): error is Error => {
  return error instanceof Error && error.message !== undefined;
};
