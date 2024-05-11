export abstract class Expression {
    abstract type: string;

    public children(): Expression[] {
        return [];
    }
}

/**
 * @example a
 */
export class VarExpression extends Expression {
    type = 'VarExpression';

    constructor(public name: string) {
        super();
    }
}

export class IfExpression extends Expression {
    type = 'IfExpression';

    constructor(
        public condition: Expression,
        public positive: Expression,
        public negative: Expression,
    ) {
        super();
    }

    public children(): Expression[] {
        return [
            this.condition,
            this.positive,
            this.negative,
        ];
    }
}

/**
 * @example x AND y
 * @example a + b
 * @example x <= 1
 */
export class BinaryExpression extends Expression {
    type = 'BinaryExpression';

    constructor(
        public operator: string,
        public left: Expression,
        public right: Expression,
    ) {
        super();
    }

    public children(): Expression[] {
        return [
            this.left,
            this.right,
        ];
    }
}

/**
 * @example !x
 */
export class UnaryExpression extends Expression {
    type = 'UnaryExpression';

    constructor(
        public operator: string,
        public argument: Expression,
    ) {
        super();
    }

    public children(): Expression[] {
        return [this.argument];
    }
}

/**
 * @example 1 in [1,2,3]
 * @example "1" in "123"
 */
export interface InOperator extends BinaryExpression {
    type: 'InOperator';
}

/**
 * @example max(1, 3)
 * @example concat("camera", "3")
 */
export class CallExpression extends Expression {
    type = 'CallExpression';

    constructor(
        public callee: string,
        public args: Expression[],
    ) {
        super();
    }

    public children(): Expression[] {
        return this.args;
    }
}

export abstract class Literal extends Expression {
    abstract value: number | string | boolean | null;
}

/**
 * @example 123
 * @example 1.005
 */
export class NumericLiteral extends Literal {
    type = 'NumericLiteral';

    constructor(
        public value: number,
    ) {
        super();
    }
}

/**
 * @example "hello world"
 */
export class StringLiteral extends Literal {
    type = 'StringLiteral';

    constructor(
        public value: string,
    ) {
        super();
    }
}

/**
 * @example true
 */
export class BooleanLiteral extends Literal {
    type = 'BooleanLiteral';

    constructor(
        public value: boolean,
    ) {
        super();
    }
}

/**
 * @example null
 */
export class NullLiteral extends Literal {
    type = 'NullLiteral';
    public value = null;

    constructor() {
        super();
    }
}

export abstract class Pattern extends Expression { }

/**
 * @example [1, 2, 3]
 */
export class ArrayPattern extends Pattern {
    type = 'ArrayPattern';

    constructor(
        public items: Expression[],
    ) {
        super();
    }

    public children(): Expression[] {
        return this.items;
    }
}

/**
 * @example 
 * {
 *   "cam_alias": "active",
 * }
 */
export class ObjectPattern extends Pattern {
    type = 'ObjectPattern';

    constructor(
        public entries: [string, Expression][],
    ) {
        super();
    }

    public children(): Expression[] {
        return this.entries.map(([, value]) => value);
    }
}
