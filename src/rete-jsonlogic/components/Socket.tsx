import * as React from 'react';
import { ClassicPreset } from 'rete';
import styled from 'styled-components';

export const $socketsize = 24;
export const $socketmargin = 6;
export const $socketcolor = '#96b38a';


const Styles = styled.div`
    display: inline-block;
    cursor: pointer;
    border: 1px solid white;
    border-radius: ${$socketsize / 2.0}px;
    width: ${$socketsize}px;
    height: ${$socketsize}px;
    vertical-align: middle;
    background: ${$socketcolor};
    z-index: 2;
    box-sizing: border-box;
    &:hover {
      border-width: 4px;
    }
    &.multiple {
      border-color: yellow;
    }
`;

const Hoverable = styled.div`
    border-radius: ${($socketsize + $socketmargin * 2) / 2.0}px;
    padding: ${$socketmargin}px;
    &:hover ${Styles} {
      border-width: 4px;
    }
`;

const colors: Record<string, string> = {
    output: '#FF0000',
    input: '#001AFF',
};

export function Socket<T extends ClassicPreset.Socket>(props: { data: T }) {
    const name = props.data.name;

    return (
        <Hoverable>
            <Styles title={name} style={{
                background: colors[name],
            }} />
        </Hoverable>
    );
}
