import React, { type ComponentPropsWithoutRef, useState, useEffect } from 'react';

export type SelectFieldOption<T> = {
    text: string;
    value: T;
}

type SelectFieldProps<T> = ComponentPropsWithoutRef<'input'> & {
    name: string;
    label: string;
    data: SelectFieldOption<T>[];
    multi?: SelectFieldOption<T>[];
    onOptionSelect: (value: T) => void;
}


const SelectField = <T,>({ name, label, data, multi, placeholder, onOptionSelect, className, ...inputProps }: SelectFieldProps<T>) => {
    const [filter, setFilter] = useState<string>('');
    const [filteredList, setFilteredList] = useState<SelectFieldOption<T>[]>();
    const [showOptions, setShowOptions] = useState<boolean>(false);

    useEffect(() => {
        setListSorted();
    }, [multi]);

    useEffect(() => {
        setListSorted();
    }, [data]);

    useEffect(() => {
        setListSorted();
    }, [filter]);

    const setListSorted = () => {
        const selected = multi ? multi : [];
        const notSelected = data
            .filter((option: SelectFieldOption<T>) => (!selected.some((opt: SelectFieldOption<T>) => opt.value == option.value)))
            .sort((a, b) => a.text.localeCompare(b.text));
        const aggregated = [...selected, ...notSelected];
        if (!!filter) {
            setFilteredList(aggregated.filter((opt: SelectFieldOption<T>) => (opt.text.toLowerCase().includes(filter))));
        } else {
            setFilteredList([...aggregated]);
        }
    }

    const searchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.trim();
        setFilter(val);
    }

    const handleOptionSelection = (option: T) => {
        onOptionSelect(option);
        setListSorted();
    }

    const isSelected = (option: SelectFieldOption<T>) => {
        if (!multi) return false;
        return multi.some(opt => opt.value == option.value);
    }

    return (
        <div
            className="pokemon-form__input-container"
            onFocus={() => setShowOptions(true)}
            onBlur={() => setShowOptions(false)}
        >
            <label htmlFor="pokemon">{label}</label>
            <div className="pokemon-form__dropdown-container">
                <input
                    {...inputProps}
                    className="pokemon-form__input"
                    name={name}
                    type="text"
                    autoComplete="off"
                    onChange={searchInputChange}
                    placeholder={placeholder} />
                {
                    !!showOptions && !!filteredList && (
                        <div className={`pokemon-form__input-dropdown-container ${className}`}>
                            <div className="pokemon-form__input-dropdown">
                                {filteredList.map((option: SelectFieldOption<T>) => (
                                    <div
                                        className="pokemon-form__input-dropdown__item"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleOptionSelection(option.value)}
                                    >{option.text}{isSelected(option) && "✓"}</div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>
            {multi?.length > 0 && (
                <div className="pokemon-form__input-dropdown__selected-item-container" >
                    {
                        multi.map((opt: SelectFieldOption<T>) => (
                            <div
                                className="pokemon-form__input-dropdown__selected-item"
                                onClick={(e) => handleOptionSelection(opt.value)}
                            >{opt.text}</div>))
                    }
                </div>
            )
            }
        </div >
    );
}

export default SelectField;
