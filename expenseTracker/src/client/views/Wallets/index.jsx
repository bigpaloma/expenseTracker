import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as yup from "yup"

export default function Wallets() {

    /** USER LOGIC */
    const [user, setUser] = useState(null);
    const [wallets, setWallets] = useState([])
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const getUser = async () => {
        const response = await fetch(`/user/${_id}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });
        const data = await response.json();
        setUser(data);
        setWallets([...data.wallets]);
    };

    useEffect(() => {
        getUser();
    }, []);


    const addWallet = async (values, onSubmitProps) => {
        console.log(values.name)
        console.log(values.balance)
        const addedWalletResponse = await fetch(
            `/user/${_id}/wallets`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        wallet: {
                            name: values.name,
                            balance: values.balance
                        }
                    }
                )
            }
        )
        const updatedWallets = await addedWalletResponse.json();
        onSubmitProps.resetForm();
        setWallets(updatedWallets)
    };


    const walletSchema = yup.object().shape({
        name: yup.string().required("required"),
        balance: yup.number().required("required")
    });

    const initialValuesWallet = {
        name: "",
        balance: ""
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        await addWallet(values, onSubmitProps);
    };


    return (
        <>
            <div className="mt-[10vh]">
                <h1>Wallets</h1>
                {wallets.length > 0 ?
                    wallets.map((wallet) => (
                        <h2>{wallet.name} - {wallet.balance}</h2>
                    )) : <p>Please Log in</p>}
            </div>
            <div>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValuesWallet}
                    validationSchema={walletSchema}
                >
                    {({
                        handleChange,
                        handleBlur,
                        values,
                        errors,
                    }) => (
                        <Form>
                            <div>
                                <label htmlFor="balance">Initial Balance</label>
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
                            </div>
                            <div>
                                <label htmlFor="name">Wallet Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="food"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}></input>
                                {errors.name && <p>{errors.name}</p>}
                            </div>
                            <div>
                                <button type="submit">Add Wallet</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}