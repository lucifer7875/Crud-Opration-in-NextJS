import React from 'react'
import CreatableSelect from 'react-select/creatable';

const CustomCreatableSelect = ({ option, value, onChange, className }) => {
    return (
        <CreatableSelect
            className={`custom-select ${className}`}
            options={option}
            value={value}
            onChange={onChange}
            isMulti
        />
    )
}

export default CustomCreatableSelect