import { useFormik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router';
import * as Yup from 'yup';
import InputThemed from '../../components/inputs/InputThemed';
import { usePublicGuard } from '../../Hooks/usePublicGuard';
import { useAuthStore } from '../../stores/AuthStore';
import useApiRequest from '../../Hooks/useApiRequest';
import ActionButton from '../../components/ActionButton';

interface FormValues {
  email: string;
  password: string;
  [key: string]: string;
}

const Login = () => {
  usePublicGuard();
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { makeRequest, isLoading } = useApiRequest();

  const validationSchema = Yup.object({
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
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          email: true,
          password: true,
        });
        return;
      }

      await makeRequest({
        url: '/login',
        method: 'post',
        data: values,
        onSuccess: (data) => {
          login(data);
        },
        successMessage: 'Inicio de sesión exitoso',
        redirectTo: '/home',
      });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center px-6 mx-auto py-20">
      <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-main-secondary border-border-primary animate-top-to-bottom">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-text-primary md:text-2xl">
            Acceder
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
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
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            ) : null}

            <div className="mx-5 flex items-center justify-end cursor-pointer text-primary">
              <Link to="/login/forgot_password">
                <p className="font-bold text-black text-base">¿Olvidó la contraseña?</p>
              </Link>
            </div>

            <ActionButton
              type="submit"
              text={isLoading ? 'Accediendo...' : 'Acceder'}
              color="primary"
              disabled={isLoading}
              fullWidth
              className="font-bold rounded-lg text-sm px-5 py-2.5 text-center"
            />

            <p className="text-sm font-light text-text-primary">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-bold text-text-primary hover:underline">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;