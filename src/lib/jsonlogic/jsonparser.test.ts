import { describe, expect, test } from '@jest/globals';
import { parse } from './jsonparser';
import { ArrayPattern, BinaryExpression, BooleanLiteral, CallExpression, Expression, IfExpression, NullLiteral, NumericLiteral, ObjectPattern, StringLiteral, VarExpression } from './ast';

function expectParsingCorrect(json: any, expectation: Expression) {
    expect(parse(json)).toEqual(expectation);
}


describe('json parser', () => {
    test('string literal parsing', () => {
        expectParsingCorrect(
            'str',
            new StringLiteral('str'),
        );
    });

    test('number literal parsing', () => {
        expectParsingCorrect(
            123,
            new NumericLiteral(123),
        );
    });

    test('boolean literal parsing', () => {
        expectParsingCorrect(
            true,
            new BooleanLiteral(true),
        );
    });

    test('array pattern parsing', () => {
        expectParsingCorrect(
            [],
            new ArrayPattern([]),
        );

        expectParsingCorrect(
            [1],
            new ArrayPattern([
                new NumericLiteral(1),
            ]),
        );

        expectParsingCorrect(
            ['str', false],
            new ArrayPattern([
                new StringLiteral('str'),
                new BooleanLiteral(false),
            ]),
        );
    });

    test('nested array pattern parsing', () => {
        expectParsingCorrect(
            [[]],
            new ArrayPattern([
                new ArrayPattern([]),
            ]),
        );
    });

    test('simple object pattern parsing', () => {
        expectParsingCorrect(
            {
                'cam_alias': 'active',
                'cam_num': 2,
            },
            new ObjectPattern([
                ['cam_alias', new StringLiteral('active')],
                ['cam_num', new NumericLiteral(2)],
            ]),
        );
    });
});

describe('Associative operator parsing', () => {
    test('`+` operator with 0 args', () => {
        expectParsingCorrect(
            {
                '+': [],
            },
            new BinaryExpression('+', new NullLiteral(), new NullLiteral()),
        );
    });

    test('`+` operator with 1 arg', () => {
        expectParsingCorrect(
            {
                '+': [1],
            },
            new BinaryExpression('+', new NumericLiteral(1), new NullLiteral()),
        );
    });

    test('`+` operator with 2 args', () => {
        expectParsingCorrect(
            {
                '+': [1, 2],
            },
            new BinaryExpression('+', new NumericLiteral(1), new NumericLiteral(2)),
        );
    });

    test('`+` operator with 3 args', () => {
        expectParsingCorrect(
            {
                '+': [
                    1,
                    2,
                    3,
                ],
            },
            new BinaryExpression(
                '+',
                new NumericLiteral(1),
                new BinaryExpression(
                    '+',
                    new NumericLiteral(2),
                    new NumericLiteral(3),
                ),
            ),
        );
    });
});

describe('complex expression parsing', () => {
    test('complex "and" expression', () => {
        const json = {
            'and': [
                {
                    '==': [
                        {
                            'var': 'key_code',
                        },
                        32,
                    ],
                },
                {
                    '<': [
                        {
                            'var': 'hold_duration',
                        },
                        1000000000,
                    ],
                },
            ],
        };

        const expectedTree = new BinaryExpression(
            'and',
            new BinaryExpression(
                '==',
                new VarExpression('key_code'),
                new NumericLiteral(32),
            ),
            new BinaryExpression(
                '<',
                new VarExpression('hold_duration'),
                new NumericLiteral(1000000000),
            ),
        );

        expectParsingCorrect(json, expectedTree);
    });


    test('complex "if" expression', () => {
        const json = {
            'if': [
                {
                    '==': [
                        {
                            'var': 'camera_num',
                        },
                        2,
                    ],
                },
                {
                    'cat': [
                        'cam',
                        {
                            'var': 'camera_num',
                        },
                    ],
                },
                {
                    'max': [
                        0,
                        {
                            'min': [
                                {
                                    'var': 'camera_num',
                                },
                                100,
                            ],
                        },
                    ],
                },
            ],
        };

        const expectedTree = new IfExpression(
            new BinaryExpression(
                '==',
                new VarExpression('camera_num'),
                new NumericLiteral(2),
            ),
            new CallExpression(
                'cat',
                [
                    new StringLiteral('cam'),
                    new VarExpression('camera_num'),
                ],
            ),
            new CallExpression(
                'max',
                [
                    new NumericLiteral(0),
                    new CallExpression(
                        'min',
                        [
                            new VarExpression('camera_num'),
                            new NumericLiteral(100),
                        ],
                    ),
                ],
            ),
        );

        expectParsingCorrect(json, expectedTree);
    });
});
