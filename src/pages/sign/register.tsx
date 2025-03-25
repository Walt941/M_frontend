import { useFormik } from 'formik';
import { useState } from 'react'
import { Link } from 'react-router';
import * as Yup from 'yup';
import InputThemed from '../../components/inputs/InputThemed';
import { usePublicGuard } from "../../Hooks/usePublicGuard";
import useApiRequest from '../../Hooks/useApiRequest';
import ActionButton from '../../components/ActionButton';

interface FormValues {
    username: string;
    email: string;
    password: string;
    [key: string]: string;
}

const Register = () => {
    usePublicGuard();
    const [showPassword, setShowPassword] = useState(false);
    const { makeRequest, isLoading } = useApiRequest();

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(4, 'El nombre debe tener al menos 4 caracteres')
            .max(20, 'El nombre no puede tener más de 20 caracteres')
            .required('El nombre es obligatorio'),
        email: Yup.string()
            .email('Correo electrónico no válido')
            .required('El correo electrónico es obligatorio'),
        password: Yup.string()
            .min(5, 'La contraseña debe tener al menos 5 caracteres')
            .max(20, 'La contraseña no puede tener más de 20 caracteres')
            .required('La contraseña es obligatoria'),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            email: '',
            username: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (user) => {
            const errors = await formik.validateForm();
            if (Object.keys(errors).length > 0) {
                formik.setTouched({
                    username: true,
                    email: true,
                    password: true,
                });
                return;
            }

            await makeRequest({
                url: '/register',
                method: 'post',
                data: user,
                successMessage: 'Registro exitoso! Redirigiendo...',
                redirectTo: '/login',
                onError: (error) => {
                    console.error('Error en el registro:', error);
                },
            });
        },
    });

    return (
        <section className="">
            <div className="flex flex-col items-center justify-center px-6 mx-auto py-20">
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-main-secondary border-border-primary animate-top-to-bottom">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-text-primary md:text-2xl">
                            Regístrate
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                            <InputThemed
                                label="Nombre"
                                type="text"
                                field="username"
                                data={formik.values}
                                setData={formik.setFieldValue}
                                placeholder="Tu nombre"
                                onBlur={() => formik.setFieldTouched('username', true)}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
                            ) : null}

                            <InputThemed
                                label="Correo electrónico"
                                type="email"
                                field="email"
                                data={formik.values}
                                setData={formik.setFieldValue}
                                placeholder="example@gmail.com"
                                onBlur={() => formik.setFieldTouched('email', true)}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
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
                                <div className="text-red-500 text-sm">{formik.errors.password}</div>
                            ) : null}

                            <ActionButton
                                type="submit"
                                text={isLoading ? 'Registrándose...' : 'Registrarse'}
                                color="primary"
                                disabled={isLoading}
                                fullWidth
                                className="font-bold rounded-lg text-sm px-5 py-2.5 text-center"
                            />

                            <p className="text-sm font-light text-text-primary">
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/login" className="font-bold text-text-primary hover:underline">
                                    Inicia sesión
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;