import { useState } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";

const registerSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required"),
    wallet: yup.string().required("required"),
    balance: yup.number().required("required"),
});

const loginSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required"),
});

const initialValuesRegister = {
    username: "",
    password: "",
    wallet: "",
    balance: 0,
};

const initialValuesLogin = {
    username: "",
    password: "",
};

const LoginForm = () => {
    const [pageType, setPageType] = useState("login");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLogin = pageType === "login";
    const isRegister = pageType === "register"

    const register = async (values, onSubmitProps) => {
        const savedUserResponse = await fetch(
            "/auth/register",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        user: {
                            username: values.username,
                            password: values.password,
                            wallets: [
                                {
                                    name: values.wallet,
                                    balance: values.balance
                                }
                            ]

                        }
                    }
                )
            }
        )
        const savedUser = await savedUserResponse.json();
        console.log(savedUser)
        onSubmitProps.resetForm()

        if (savedUser) {
            setPageType("login")
        }
    };

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(
            "/auth/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            }
        )
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm()

        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token
                })
            );
            navigate("/Dashboard")
        }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
    };

    return (
        <div className="mt-10">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
                validationSchema={isLogin ? loginSchema : registerSchema}
                className
            >
                {({
                    handleChange,
                    handleBlur,
                    resetForm,
                    values,
                    errors,
                }) => (
                    <Form >
                        {isRegister && (<>
                            <label htmlFor="wallet">Your first Wallet</label>
                            <input
                                type="text"
                                id="wallet"
                                name="wallet"
                                placeholder="checkings"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.wallet}></input>
                            {errors.wallet && <p>{errors.wallet}</p>}
                            <label htmlFor="balance">Initial Balance of your Wallet</label>
                            <input
                                type="number"
                                id="balance"
                                name="balance"
                                placeholder="0"
                                step="0.01"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.balance}></input>
                            {errors.balance && <p>{errors.balance}</p>}
                        </>)}
                        <label htmlFor="username">username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="tracker9099"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}></input>
                        {errors.username && <p>{errors.username}</p>}
                        <label htmlFor="password">password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}></input>
                        {errors.password && <p>{errors.password}</p>}
                        <div>
                            <button type="submit">{isLogin ? "LOGIN" : "REGISTER"}</button>
                            <button type="button"
                                onClick={() => {
                                    setPageType(isLogin ? "register" : "login");
                                    resetForm();
                                }}>{isLogin
                                    ? "Don't have an Account? Sign Up here."
                                    : "Already have an Account? Login here."}</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )

}

export default LoginForm;