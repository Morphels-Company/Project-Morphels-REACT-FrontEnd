import {PatternFormat} from 'react-number-format'
function NumericInputs({id, type= "text", placeholder = "", erros , register, children, format, ...props }) {
    return (
        <>
            <PatternFormat
                format={format}
                id={id}
                placeholder={placeholder}
                {...register}
                {...props}
               className="w-full text-xs bg-bg-secondary-color border rounded-md border-bg-secondary-destack-color hover:cursor-auto focus:border-primary-titles-color focus:outline-none placeholder:text-gray-500 transition-all px-2 py-2"/>
        </>
    )
}
export default NumericInputs;