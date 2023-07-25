export const errorNoElements = "'source' contains no elements.";
export const errorOutOfIndex = "'index' should be non-negative and less than the legnth of 'source'.";
export const errorNoMatch = "'source' contains no elements satisfying the condition in 'predicate'.";
export const errorMoreThanOneMatch = "'source' contains more than one elements satisfying the condition in 'predicate'.";
export function errorNegativeArgument(argumentName: string): string
{
    return `'${argumentName}' should be non-negative.`;
}