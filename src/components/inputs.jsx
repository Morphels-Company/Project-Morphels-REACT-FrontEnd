function Inputs({id, type= "text", placeholder = "", erros , register, children, ...props }) {
    const hasError = erros?.[id]
  return (
      <>
          <div className="flex flex-col items-start w-full space-y-1">
            <label htmlFor={id} className="text-xs text-primary-titles-color">{children}</label>
            <input
              id={id}
              placeholder={placeholder}
              type={type}
              className="w-full text-xs bg-bg-secondary-color border rounded-md border-bg-secondary-destack-color hover:cursor-auto focus:outline-none placeholder:text-gray-500 transition-all px-2 py-2"
              {...register}
              {...props}
            />
              {hasError && <span className='text-red-700 text-sm'>This field is required</span>}
          </div>
    </>
  )
}
export default Inputs;