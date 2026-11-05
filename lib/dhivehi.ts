const THAANA = /[ހ-޿]/;

/** True when text contains Thaana, the Dhivehi script. Such text is shown right to left and isn't marked by AI. */
export function hasThaana(text: string) {
    return THAANA.test(text);
}
