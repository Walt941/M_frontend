import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router';
import * as Yup from 'yup';
import InputThemed from '../../components/inputs/InputThemed';
import { usePublicGuard } from "../../hooks/usePublicGuard";
import useApiRequest from '../../hooks/useApiRequest'; 
import ActionButton from '../../components/ActionButton';


interface FormValues {
    email: string;
    [key: string]: string;
}

const ForgotPassword = () => {
    const navigate = useNavigate();
    usePublicGuard();
    const { makeRequest, isLoading } = useApiRequest(); 

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Correo electrónico no válido')
            .required('El correo electrónico es obligatorio'),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const errors = await formik.validateForm();
            if (Object.keys(errors).length > 0) {
                formik.setTouched({
                    email: true,
                });
                return;
            }

           
            await makeRequest({
                url: '/forgot-password',
                method: 'post',
                data: { email: values.email },
                successMessage: 'Se ha enviado un correo para recuperar tu contraseña.',
                onSuccess: () => {
                    navigate(`/login/recover_account?email=${values.email}`);
                },
                onError: (error) => {
                    console.error('Error en la solicitud:', error);
                },
            });
        },
    });

    return (
        <section className="">
            <div className="flex flex-col items-center justify-center px-6 mx-auto py-20">
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-border-primary animate-top-to-bottom">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-text-primary md:text-2xl">
                            ¿Olvidó la contraseña?
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                            <p className="text-sm font-bold mb-5">
                                Introduzca su email
                            </p>
                            <InputThemed
                                label="Email"
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

                            <div className="flex gap-3">
                                <Link
                                    to="/login"
                                    className="w-full bg-slate-600 text-text-secondary focus:outline-none font-bold rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Atrás
                                </Link>
                                <ActionButton
                                    type="submit"
                                    text={isLoading ? 'Enviando...' : 'Enviar'}
                                    color="primary"
                                    disabled={isLoading}
                                    fullWidth
                                    className="font-bold rounded-lg text-sm px-5 py-2.5 text-center"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;