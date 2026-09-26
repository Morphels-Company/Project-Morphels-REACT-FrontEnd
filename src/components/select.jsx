export default function Select ({id, register, title, options, ...rest}) {
    return (
        <div className="flex flex-col items-start w-full space-y-1">
            <label htmlFor={id} className="text-xs">
                {title}
            </label>
            <select  id="type"
                     className="w-full text-xs bg-bg-secondary-color border rounded-md border-bg-secondary-destack-color hover:cursor-auto focus:border-primary-titles-color  focus:outline-none placeholder:text-gray-500 focus:ring-gray-400 px-2 py-2"
                     {...register}
            >
                {options.map((option) => (
                    <option value={option.index}>{option.title}</option>
                ))}
            </select>
        </div>
    )
}