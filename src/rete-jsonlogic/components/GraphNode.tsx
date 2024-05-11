import * as React from 'react';
import { ClassicScheme, RenderEmit, Presets } from 'rete-react-plugin';
import styled, { css } from 'styled-components';
import { BaseNode } from '../nodes';

export const $nodewidth = 200;
export const $socketmargin = 6;
export const $socketsize = 16;
export const $socketrowheight = 36;

const StackedContainer = (props: { children: React.ReactNode }) => {
    return (
        <div className="stack-container" >
            {props.children}
        </div>
    );
};

const { RefSocket, RefControl } = Presets.classic;

type NodeExtraData = { isRoot: boolean, width?: number; height?: number };

export const NodeStyles = styled.div<
    NodeExtraData & { selected: boolean; styles?: (props: any) => any }
>`
  background: rgba(110, 136, 255, 0.8);
  border: 2px solid rgb(78, 88, 191);
  border-radius: 10px;
  cursor: pointer;
  box-sizing: border-box;
  width: ${$nodewidth}px !important; 
  height: auto !important;
  padding-bottom: 6px;
  position: relative;
  user-select: none;
  ${(props) => props.selected && css`border-color: red;`}
  ${(props) => props.isRoot && css`box-shadow: 0 0 0 4px rgb(78, 88, 191);`}
  .title {
    color: white;
    font-family: sans-serif;
    font-size: 18px;
    padding: 8px;
  }
  .title.center {
    text-align: center;
  }
  .title.top {
    height: calc(100% + ${$socketrowheight}px);
    justify-content: start;
    align-items: start;
  }
  .title.hide {
    display: none;
  }
  .input {
    text-align: left;
  }
  .output {
    text-align: right;
  }
  .input-socket {
    text-align: left;
    margin-left: -18px;
  }
  .output-socket {
    text-align: right;
    margin-right: -18px;
  }
  .input-socket,
  .output-socket {
    height: ${$socketrowheight}px;
    display: inline-block;
    position: relative;
    z-index: 2;
  }
  .input-title,
  .output-title {
    vertical-align: middle;
    color: white;
    display: inline-block;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 500;
    margin: ${$socketmargin}px;
    line-height: ${$socketsize}px;
  }
  .input-control {
    z-index: 1;
    width: calc(100% - ${$socketsize + 2 * $socketmargin}px);
    vertical-align: middle;
    display: inline-block;
  }
  .control {
    display: block;
    padding: ${$socketmargin}px ${$socketsize / 2 + 2 * $socketmargin}px;
  }
  .stack {
    position: relative;
  }
  .stack-container {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`;

function sortByIndex<T extends [string, undefined | { index?: number }][]>(
    entries: T,
) {
    entries.sort((a, b) => {
        const ai = a[1]?.index || 0;
        const bi = b[1]?.index || 0;

        return ai - bi;
    });
}

export type CustomNodeProps<S extends ClassicScheme> = {
    data: S['Node'] & Partial<BaseNode>;
    styles?: () => any;
    emit: RenderEmit<S>;
};

export function GraphNode<Scheme extends ClassicScheme>(props: CustomNodeProps<Scheme>) {
    const inputs = Object.entries(props.data.inputs);
    const outputs = Object.entries(props.data.outputs);
    const controls = Object.entries(props.data.controls);
    const selected = props.data.selected || false;
    const { id, label, options, isRoot = false } = props.data;

    const rows = Math.max(2, inputs.length, outputs.length, controls.length);

    sortByIndex(inputs);
    sortByIndex(outputs);
    sortByIndex(controls);

    return (
        <NodeStyles
            selected={selected}
            isRoot={isRoot}
        >
            <div className="stack" style={{ height: $socketrowheight * rows + 'px' }}>

                {/* Outputs */}
                <StackedContainer>
                    {outputs.map(([key, output]) =>
                        output && (
                            <div className="output" key={key}>
                                <div className="output-title">
                                    {output?.label}
                                </div>
                                <RefSocket
                                    name="output-socket"
                                    side="output"
                                    emit={props.emit}
                                    socketKey={key}
                                    nodeId={id}
                                    payload={output.socket}
                                />
                            </div>
                        ),
                    )}
                </StackedContainer>

                {/* Inputs */}
                <StackedContainer>
                    {inputs.map(([key, input]) =>
                        input && (
                            <div className="input" key={key}>
                                <RefSocket
                                    name="input-socket"
                                    emit={props.emit}
                                    side="input"
                                    socketKey={key}
                                    nodeId={id}
                                    payload={input.socket}
                                />
                                {input && (!input.control || !input.showControl) && (
                                    <div className="input-title">
                                        {input?.label}
                                    </div>
                                )}
                                {input?.control && input?.showControl && (
                                    <span className="input-control">
                                        <RefControl
                                            key={key}
                                            name="input-control"
                                            emit={props.emit}
                                            payload={input.control}
                                        />
                                    </span>
                                )}

                            </div>
                        ),
                    )}
                </StackedContainer>

                {/* Label */}
                <StackedContainer>
                    <div className={`title ${options?.titlePosition || 'center'}`}>
                        {label}
                    </div>
                </StackedContainer>

                {/* Controls */}
                <StackedContainer>
                    {controls.map(([key, control]) => {
                        return control ? (
                            <RefControl
                                key={key}
                                name="control"
                                emit={props.emit}
                                payload={control}
                            />
                        ) : null;
                    })}
                </StackedContainer>
            </div>

        </NodeStyles>
    );
}
