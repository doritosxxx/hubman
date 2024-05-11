import { Expression, VarExpression, IfExpression, BinaryExpression, UnaryExpression, CallExpression, NumericLiteral, Literal, Pattern, StringLiteral, BooleanLiteral, ArrayPattern, ObjectPattern, NullLiteral } from './ast';

import { assertArray, assertObject } from '../helpers/assert';

const BINARY_OPERATORS = [
    '==', '!=',
    '>', '>=', '<', '<=',
    '+', '-', '*', '/', '%',
    'in',
] as const;
type BinaryOperator = typeof BINARY_OPERATORS[number];
const isBinaryOperator = (operator: any): operator is BinaryOperator => BINARY_OPERATORS.includes(operator);

const ASSOCIATIVE_BINARY_OPERATORS = [
    '+', '*', 'and', 'or',
] as const;

type AssociativeOperator = typeof ASSOCIATIVE_BINARY_OPERATORS[number];
const isAssociativeBinaryOperator = (operator: any): operator is AssociativeOperator => ASSOCIATIVE_BINARY_OPERATORS.includes(operator);

const UNARY_OPERATORS = ['!'] as const;
type UnaryOperator = typeof UNARY_OPERATORS[number];
const isUnaryOperator = (operator: any): operator is UnaryOperator => UNARY_OPERATORS.includes(operator);

type JsonLogicKey =
    | 'var' | 'if'
    | 'max' | 'min' | 'cat' | 'substr'
    | BinaryOperator | AssociativeOperator | UnaryOperator;

const parseVar = (arg: any): VarExpression => {
    if (typeof arg === 'string') {
        return new VarExpression(arg);
    }

    assertArray<string>(arg);

    if (arg.length === 0) {
        throw new TypeError('Variable name is not specified', {
            cause: arg,
        });
    }

    return new VarExpression(arg[0]);
};

const parseIf = (args: any): IfExpression => {
    assertArray(args);

    if (args.length < 3) {
        throw new TypeError('"If" clause must have at least 3 arguments', {
            cause: args,
        });
    }

    // Possible by specification but it would be tricky to implement if/else as a graph.
    if (args.length > 3) {
        throw new TypeError('"If" clause with more than 3 arguments is not supported', {
            cause: args,
        });
    }

    return new IfExpression(
        parseExpression(args[0]),
        parseExpression(args[1]),
        parseExpression(args[2]),
    );
};

const parseBinaryOperator = (args: any, operator: string): BinaryExpression => {
    assertArray(args);

    if (args.length != 2) {
        throw new TypeError('Binary operator must have exactly 2 arguments', {
            cause: args,
        });
    }

    return new BinaryExpression(
        operator,
        parseExpression(args[0]),
        parseExpression(args[1]),
    );
};

const parseAssociativeBinaryOperator = (args: any, operator: string): Expression => {
    assertArray(args);

    let root = parseExpression(args.at(-1) ?? null);

    for (let i = args.length - 2; i >= 0; i--) {
        root = new BinaryExpression(
            operator,
            parseExpression(args[i]),
            root,
        );
    }

    if (!(root instanceof BinaryExpression)) {
        return new BinaryExpression(
            operator,
            root,
            new NullLiteral(),
        );
    }

    return root;
};

const parseUnaryOperator = (arg: any, operator: UnaryOperator): UnaryExpression => {
    if (Array.isArray(arg)) {
        if (arg.length === 0) {
            throw new TypeError('Unary operator argument is not specified', {
                cause: arg,
            });
        }

        return new UnaryExpression(
            operator,
            parseExpression(arg[0]),
        );
    }

    return new UnaryExpression(
        operator,
        parseExpression(arg),
    );
};

const parseFunctionCall = (
    args: any,
    name: string,
    assertSignature: (args: unknown[]) => void,
): CallExpression => {
    assertArray(args);
    assertSignature(args);

    return new CallExpression(name, args.map(parseExpression));
};

const parseExpression = (json: any): Expression => {
    if (typeof json === 'number') {
        return new NumericLiteral(json);
    }
    if (typeof json === 'string') {
        return new StringLiteral(json);
    }
    if (typeof json === 'boolean') {
        return new BooleanLiteral(json);
    }
    if (json === null) {
        return new NullLiteral();
    }
    if (Array.isArray(json)) {
        return new ArrayPattern(json.map(parseExpression));
    }

    assertObject(json);

    const operator = Object.keys(json)[0] as JsonLogicKey;

    if (operator === undefined) {
        throw new TypeError('Expected at least 1 element in record', {
            cause: json,
        });
    }
    const value = json[operator];

    if (operator == 'var') {
        return parseVar(value);
    }
    if (operator === 'if') {
        return parseIf(value);
    }

    if (isAssociativeBinaryOperator(operator)) {
        return parseAssociativeBinaryOperator(value, operator);
    }
    if (isBinaryOperator(operator)) {
        return parseBinaryOperator(value, operator);
    }
    if (isUnaryOperator(operator)) {
        return parseUnaryOperator(value, operator);
    }

    if (operator === 'max' || operator === 'min') {
        return parseFunctionCall(value, operator, (args) => {
            if (args.length !== 2) {
                throw new TypeError(`"${operator}" call takes exactly 2 arguments`, {
                    cause: args,
                });
            }
        });
    }

    if (operator === 'cat') {
        return parseFunctionCall(value, operator, (args) => {
            if (args.length !== 2) {
                throw new TypeError('"cat" call takes exactly 2 arguments', {
                    cause: args,
                });
            }
        });
    }

    if (operator === 'substr') {
        return parseFunctionCall(value, operator, (args) => {
            if (args.length == 0) {
                throw new TypeError('"cat" call takes at least 1 argument (start index)', {
                    cause: args,
                });
            } else if (args.length > 3) {
                if (args.length == 0) {
                    throw new TypeError('"cat" call takes at most 2 arguments', {
                        cause: args,
                    });
                }
            }
        });
    }

    return new ObjectPattern(
        Object
            .entries(json)
            .map(([key, value]) => [key, parseExpression(value)]),
    );

};

export const parse = parseExpression;
