import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import RestApiClient from '../../services/api';
import InputThemed from '../../components/inputs/InputThemed';
import { usePublicGuard } from "../../Hooks/usePublicGuard";


interface FormValues {
    email: string;
    [key: string]: string;
}

const ForgotPassword = () => {
    const navigate = useNavigate();
    usePublicGuard();

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

            try {
                const res = await RestApiClient.post('/forgot-password', { email: values.email });
                toast.success(res.data.message);
                navigate(`/login/recover_account?email=${values.email}`);
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data.message);
                }
                console.error(error);
            }
        },
    });

    return (
        <section className="">
            <div className="flex flex-col items-center justify-center px-6 mx-auto py-20">
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-border-primary">
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
                                <button
                                    type="submit"
                                    className={`w-full ${
                                        formik.isSubmitting ? 'bg-main-third' : 'bg-main-primary'
                                    } text-text-secondary focus:outline-none font-bold rounded-lg text-sm px-5 py-2.5 text-center`}
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? 'Enviando...' : 'Enviar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;