import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface InputThemedProps {
    label?: string;
    type: string;
    field?: string;
    data?: { [key: string]: string };
    setData?: (field: string, value: string) => void;
    placeholder: string;
    onBlur?: () => void;
    showPassword?: boolean;
    toggleShowPassword?: () => void;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef?: React.Ref<HTMLInputElement>;  
    className?: string;  
}

const InputThemed = React.forwardRef<HTMLInputElement, InputThemedProps>(
    (props, ref) => {
      const {
        label,
        type,
        field,
        data,
        setData,
        placeholder,
        onBlur,
        showPassword,
        toggleShowPassword,
        value,
        onChange,
        className = ''
      } = props;
  
      const [hasText, setHasText] = useState(false);
  
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (setData && field) {
          setData(field, e.target.value);
        }
        if (onChange) {
          onChange(e);
        }
        setHasText(e.target.value.length > 0);
      };
  
      const inputValue = field && data ? data[field] : value;
  
      return (
        <div>
          {label && (
            <label className="block mb-2 text-sm font-medium text-text-primary">
              {label}
            </label>
          )}
          <div className="relative">
            <input
              ref={ref}  
              type={showPassword ? "text" : type}
              value={inputValue}
              onChange={handleChange}
              onBlur={onBlur}
              placeholder={placeholder}
              className={`w-full p-2.5 bg-bg-input border border-border-primary rounded-lg text-text-primary pr-10 ${className}`}
            />
            {type === "password" && hasText && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <FaRegEyeSlash color="black" size={20} />
                ) : (
                  <FaRegEye color="black" size={20} />
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
  );
  
  InputThemed.displayName = 'InputThemed';

export default InputThemed;
