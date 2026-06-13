import React, { type ComponentPropsWithoutRef } from 'react';

type RadioFieldProps = ComponentPropsWithoutRef<'input'> & {
    name: string;
    options: { value: string, label: string, isDefault?: boolean }[];
}

const RadioField = ({ name, options, ...radioProps }: RadioFieldProps) => {
    return (<div className="flex gap-[6px]">
        <div className="pokemon-form__radio-container">
            {options.map((opt) => (
                <label>
                    <input
                        {...radioProps}
                        className="pokemon-form__radio"
                        value={opt.value}
                        name={name}
                        id={`${name}-${opt.value.toLowerCase()}`}
                        type="radio"
                        defaultChecked={opt.isDefault} />
                    <span>{opt.label}</span>
                </label>
            ))}
        </div>
    </div>);
}

export default RadioField;
