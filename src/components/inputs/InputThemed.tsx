import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface InputThemedProps {
    label: string;
    type: string;
    field: string;
    data: { [key: string]: string };
    setData: (field: string, value: string) => void;
    placeholder: string;
    onBlur?: () => void;
    showPassword?: boolean;
    toggleShowPassword?: () => void;
}

const InputThemed: React.FC<InputThemedProps> = ({
    label,
    type,
    field,
    data,
    setData,
    placeholder,
    onBlur,
    showPassword,
    toggleShowPassword,
}) => {
    const [hasText, setHasText] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(field, e.target.value);
        setHasText(e.target.value.length > 0);
    };

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-text-primary">{label}</label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : type}
                    value={data[field]}
                    onChange={handleChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className="w-full p-2.5 bg-bg-input border border-border-primary rounded-lg text-text-primary pr-10"
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
};

export default InputThemed;
