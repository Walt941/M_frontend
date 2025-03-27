import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router';
import * as Yup from 'yup';
import { usePublicGuard } from "../../hooks/usePublicGuard";
import InputThemed from '../../components/inputs/InputThemed';
import ActionButton from '../../components/ActionButton';
import UseApiRequest from '../../hooks/useApiRequest';

interface FormValues {
    code: string[];
    password: string;
    password2: string;
    [key: string]: any;
}

const RecoverAccount: React.FC = () => {
    usePublicGuard();
    const [showPassword, setShowPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const navigate = useNavigate();
    const { makeRequest, isLoading } = UseApiRequest();

    const validationSchema = Yup.object({
        code: Yup.array()
            .of(Yup.string().matches(/^\d$/, 'El código debe ser un número'))
            .length(6, 'El código debe tener 6 dígitos')
            .required('El código es obligatorio'),
        password: Yup.string()
            .min(5, 'La contraseña debe tener al menos 5 caracteres')
            .max(20, 'La contraseña no puede tener más de 20 caracteres')
            .required('La contraseña es obligatoria'),
        password2: Yup.string()
            .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
            .required('Debes confirmar la contraseña'),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            code: Array(6).fill(''),
            password: '',
            password2: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const errors = await formik.validateForm();
            if (Object.keys(errors).length > 0) {
                formik.setTouched({
                    code: true,
                    password: true,
                    password2: true,
                });
                return;
            }

            await makeRequest({
                url: '/reset-password',
                method: 'post',
                data: {
                    email,
                    code: values.code.join(''),
                    newPassword: values.password,
                },
                onSuccess: () => {
                    navigate('/login');
                },
                successMessage: 'Contraseña cambiada exitosamente',
            });
        },
    });

    const handleChange = (index: number, value: string) => {
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newCode = [...formik.values.code];
            newCode[index] = value;
            formik.setFieldValue('code', newCode);

            if (value && index < 5) {
                const nextInput = document.getElementById(`code-input-${index + 1}`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').slice(0, 6);
        const newCode = [...formik.values.code];
        for (let i = 0; i < pasteData.length; i++) {
            if (/^\d*$/.test(pasteData[i])) {
                newCode[i] = pasteData[i];
            }
        }
        formik.setFieldValue('code', newCode);
    };

    return (
        <section className="h-screen flex items-center">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-border-primary animate-top-to-bottom">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-text-primary md:text-2xl">
                            Cambiar Contraseña
                        </h1>

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
                            <label className="block mb-2 font-bold text-sm">
                                Código
                            </label>
                            <div className="flex space-x-2">
                                {formik.values.code.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`code-input-${index}`}
                                        type="text"
                                        className="w-12 h-12 text-center border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onPaste={handlePaste}
                                        maxLength={1}
                                    />
                                ))}
                            </div>
                            {formik.touched.code && formik.errors.code ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.code}</div>
                            ) : null}

                            <InputThemed
                                label="Contraseña"
                                type="password"
                                field="password"
                                data={formik.values}
                                setData={formik.setFieldValue}
                                placeholder="••••••••"
                                onBlur={() => formik.setFieldTouched('password', true)}
                                showPassword={showPassword} 
                                toggleShowPassword={() => setShowPassword(!showPassword)}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            ) : null}

                            <InputThemed
                                label="Confirmar Contraseña"
                                type="password"
                                field="password2"
                                data={formik.values}
                                setData={formik.setFieldValue}
                                placeholder="••••••••"
                                onBlur={() => formik.setFieldTouched('password2', true)}
                                showPassword={showPassword} 
                                toggleShowPassword={() => setShowPassword(!showPassword)}
                            />
                            {formik.touched.password2 && formik.errors.password2 ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password2}</div>
                            ) : null}

                            <ActionButton
                                type="submit"
                                text={isLoading ? 'Enviando...' : 'Enviar'}
                                color="primary"
                                disabled={isLoading}
                                fullWidth
                            />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecoverAccount;