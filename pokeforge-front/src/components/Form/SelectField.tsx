import React, { type ComponentPropsWithoutRef, useState, useEffect } from 'react';

export type SelectFieldOption<T> = {
    text: string;
    value: T;
}

type SelectFieldProps<T> = ComponentPropsWithoutRef<'input'> & {
    name: string;
    label: string;
    data: SelectFieldOption<T>[];
    onOptionSelect: (value: T) => void;
}


const SelectField = <T,>({ name, label, data, placeholder, onOptionSelect, ...inputProps }: SelectFieldProps<T>) => {
    const [filter, setFilter] = useState<string>('');
    const [filteredList, setFilteredList] = useState<SelectFieldOption<T>[]>(data);
    const [showOptions, setShowOptions] = useState<boolean>(false);

    useEffect(() => {
        setShowOptions(filter != '');
        if (!!filter) {
            setFilteredList(data.filter((opt: SelectFieldOption<T>) => (opt.text.toLowerCase().includes(filter))));
        }
    }, [filter]);

    const searchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.trim();
        setFilter(val);
    }

    const handleOptionSelection = (option: T) => {
        onOptionSelect(option);
    }
    return (
        <div className="pokemon-form__input-container">
            <label htmlFor="pokemon">{label}</label>
            <input {...inputProps} className="pokemon-form__input" name={name} type="text" onChange={searchInputChange} placeholder={placeholder} />
            {!!showOptions && !!filteredList && (
                <div className="pokemon-form__input-dropdown">
                    {filteredList.map((option: SelectFieldOption<T>) => (
                        <div className="pokemon-form__input-dropdown__item" onClick={() => handleOptionSelection(option.value)}>{option.text}</div>
                    ))}
                </div>
            )
            }
        </div >
    );
}

export default SelectField;
