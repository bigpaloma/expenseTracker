import * as yup from "yup";

export const loginSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required"),
});
