import React, { type ComponentPropsWithoutRef } from 'react';

type InputFieldProps = ComponentPropsWithoutRef<'input'> & {
    label: string;
    name: string; // redefined here to enforce it
    callback?: (name: string, value: string) => void;
    customValidation?: (inputType: string, value: string) => boolean;
}

const InputField = ({ label, name, type = 'text', callback, customValidation, ...inputProps }: InputFieldProps) => {
    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (customValidation) {
            if (!customValidation(type, val)) return;
        }
        if (callback) return callback(name, val);
        if (inputProps.onChange) inputProps.onChange(e);
    }
    return (
        <>
            <div className="pokemon-form__input-container">
                <label htmlFor={name}>{label}</label>
                <input
                    {...inputProps}
                    className="pokemon-form__input"
                    type={type}
                    name={name}
                    onChange={changeEventHandler} />
            </div>
        </>
    );
}

export default InputField;
