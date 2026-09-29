// Fehler und Exit-Codes der Bibliotheks-CLI (npm run bib).
//
// Jeder Fehler ist {code, field, message}: `code` ist stabil und maschinenlesbar, `field` zeigt auf das
// Feld der Eingabe (z. B. "ops[2].to"), `message` ist Klartext für Menschen und darf sich ändern.

export class BibError extends Error {
  constructor({ code, field = '', message, op }) {
    super(message);
    this.code = code;
    this.field = field;
    if (op !== undefined) this.op = op;
  }
  toJSON() {
    return { code: this.code, field: this.field, message: this.message, ...(this.op !== undefined ? { op: this.op } : {}) };
  }
}

/** Stabile Exit-Codes. 0 und 2 gab es schon (`find`); die übrigen sind für `apply` und die Lookups neu. */
export const EXIT = Object.freeze({
  OK: 0,
  USAGE: 1,
  FOUND: 2, // find: Treffer in Protokoll/Friedhof/Dosen/Kandidaten (= „schon da“)
  NOT_FOUND: 4, // exists / quellen match ohne Treffer
  VALIDATION: 10, // Plan oder Operation ungültig, nichts geschrieben
  PRECONDITION: 11, // expect stimmt nicht mehr, nichts geschrieben
  PERMISSION: 12, // Akteur darf die Operation nicht, nichts geschrieben
  LOCK: 13, // Sperre nicht bekommen (--wait abgelaufen)
  APPLY_FAILED: 14, // beim Schreiben etwas schiefgegangen, alles zurückgerollt
});

export const ERROR_CODES = Object.freeze({
  USAGE: EXIT.USAGE,
  PLAN_INVALID: EXIT.VALIDATION,
  OP_UNKNOWN: EXIT.VALIDATION,
  FIELD_REQUIRED: EXIT.VALIDATION,
  VALUE_INVALID: EXIT.VALIDATION,
  NOT_FOUND: EXIT.VALIDATION,
  DUPLICATE: EXIT.VALIDATION,
  RULE_VIOLATION: EXIT.VALIDATION,
  PRECONDITION_FAILED: EXIT.PRECONDITION,
  PERMISSION_DENIED: EXIT.PERMISSION,
  LOCK_TIMEOUT: EXIT.LOCK,
  APPLY_FAILED: EXIT.APPLY_FAILED,
});

/** Exit-Code für eine Fehlerliste: der schwerste (höchste) gewinnt, damit eine Rechtefrage nicht als Formfehler erscheint. */
export const exitFor = (errors) => Math.max(EXIT.USAGE, ...errors.map((e) => ERROR_CODES[e.code] ?? EXIT.USAGE));
