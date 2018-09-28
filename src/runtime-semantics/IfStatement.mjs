import {
  Evaluate_Expression,
  Evaluate_Statement,
} from '../evaluator.mjs';
import {
  GetValue,
  ToBoolean,
} from '../abstract-ops/all.mjs';
import {
  Q,
  Completion,
  NormalCompletion,
  UpdateEmpty,
} from '../completion.mjs';
import { New as NewValue } from '../value.mjs';

// #sec-if-statement-runtime-semantics-evaluation
//   IfStatement :
//     `if` `(` Expression `)` Statement `else` Statement
//     `if` `(` Expression `)` Statement
export function* Evaluate_IfStatement({
  test: Expression,
  consequent: Statement,
  alternate: AlternateStatement,
}) {
  const exprRef = yield* Evaluate_Expression(Expression);
  const exprValue = ToBoolean(Q(GetValue(exprRef)));

  if (AlternateStatement !== null) {
    let stmtCompletion;
    if (exprValue.isTrue()) {
      stmtCompletion = yield* Evaluate_Statement(Statement);
    } else {
      stmtCompletion = yield* Evaluate_Statement(AlternateStatement);
    }
    return Completion(UpdateEmpty(stmtCompletion, NewValue(undefined)));
  } else {
    if (exprValue.isFalse()) {
      return new NormalCompletion(undefined);
    } else {
      const stmtCompletion = yield* Evaluate_Statement(Statement);
      return Completion(UpdateEmpty(stmtCompletion, NewValue(undefined)));
    }
  }
}
