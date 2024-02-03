import React from "react";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, useField } from "formik";
import DatePicker from "react-datepicker";
import * as yup from "yup";
import { useSelector } from "react-redux"

import "react-datepicker/dist/react-datepicker.css";
import CardRadio from "../../components/CardRadio";

export default function Dashboard() {

    /** USER LOGIC */
    const [user, setUser] = useState(null);
    const [wallets, setWallets] = useState([]);
    const [transactionsArr, setTransactionsArr] = useState([])
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const reduxUser = useSelector((state) => state.user);

    const getUser = async () => {
        const response = await fetch(`/user/${_id}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });
        const data = await response.json();
        setUser(data);
        setTransactionsArr([...data.transactions.reverse()])
        setWallets([...data.wallets])
    };

    useEffect(() => {
        getUser();
    }, []);


    /** FORM LOGIC */
    const [transactionType, setTransactionType] = useState("expense");
    const isExpense = transactionType === "expense";
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const transactionSchema = yup.object().shape({
        label: yup.string().required("required"),
        category: yup.string(),
        newCategory: yup.string(),
        //type: yup.mixed().oneOf(['income', "expense"]).required("required"),
        // type: yup.string().required("required"),
        amount: yup.number().positive().required("required"),
        date: yup.date().default(() => new Date()),
        wallet: yup.string()
    });

    const initialValuesTransaction = {
        label: "",
        category: "",
        newCategory: "",
        type: "",
        amount: "",
        wallet: reduxUser.wallets[0].name,
        date: new Date()
    }

    const MyDatePicker = ({ name = "" }) => {
        const [field, meta, helpers] = useField(name);

        const { value } = meta;
        const { setValue } = helpers;

        return (
            <DatePicker
                {...field}
                selected={value}
                onChange={(date) => setValue(date)}
            />
        );
    };

    const expenseTransactions = transactionsArr.filter((x) => x.type === "expense")
    const expenseCategoriesUnsorted = expenseTransactions.map((x) => x.category)
    const RemoveDuplicates = (arr) => {
        return [...new Set(arr)]
    }
    const expenseCategories = RemoveDuplicates(expenseCategoriesUnsorted)

    const handleRadioButtonChange = (e) => {
        setTransactionType(e.target.value);
    }

    const addTransaction = async (values, onSubmitProps) => {
        values.type = isExpense ? "expense" : "income"
        let isNewCat = true
        if (values.newCategory === "") {
            isNewCat = false
        }
        values.category = isNewCat ? values.newCategory : values.category
        const addedTransactionResponse = await fetch(
            `/user/${_id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        transaction: {
                            label: values.label,
                            category: values.category,
                            type: values.type,
                            amount: values.amount,
                            date: values.date,
                            wallet: values.wallet
                        }
                    }
                )
            }
        )
        const updatedUser = await addedTransactionResponse.json();
        // WHITOUT THIS CONSOLE.LOG THE SETSTATE DOES NOT TRIGGER ????????
        //console.log([...updatedUser.transactions.reverse()])
        // WHITOUT THIS CONSOLE.LOG THE SETSTATE DOES NOT TRIGGER ????????
        setTransactionsArr([...updatedUser.transactions.reverse()])
        onSubmitProps.resetForm();
    };

    const deleteTransaction = async (trx) => {
        const deletedTransactionResponse = await fetch(
            `/user/${_id}/${trx._id}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        const updatedUser = await deletedTransactionResponse.json();
        setTransactionsArr([...updatedUser.transactions.reverse()])
    };

    const handleTransactionDelete = (trx) => {
        deleteTransaction(trx)
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        await addTransaction(values, onSubmitProps);
    };



    if (!user) {
        return null;
    }

    return (
        <>
            <div className="mt-[10vh]">
                <h2>Add a Transaction</h2>
            </div>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValuesTransaction}
                validationSchema={transactionSchema}
            >
                {({
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                }) => (
                    <Form>
                        <div>
                            <MyDatePicker name="date" />
                        </div>
                        <div>
                            <CardRadio handleRadioButtonChange={handleRadioButtonChange} transactionType={transactionType} a={"expense"} b={"income"} />
                        </div>
                        <div>
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                placeholder="0"
                                step="0.01"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.amount}></input>
                            {errors.amount && <p>{errors.amount}</p>}
                        </div>
                        <div>
                            <label htmlFor="wallet">Select a Wallet</label>
                            <Field as="select" id="wallet" value={values.wallet} onChange={handleChange} onBlur={handleBlur}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {wallets.map((wallet) => (
                                    <option key={wallet._id} value={wallet.name}>{wallet.name}</option>
                                ))}
                            </Field>
                        </div>
                        <div>
                            <label htmlFor="category">Select a Category</label>
                            <Field as="select" id="category" value={values.category} onChange={handleChange} onBlur={handleBlur}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option>Category</option>
                                {expenseCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Field>
                        </div>
                        <div>
                            <label htmlFor="newCategory">Or add a new Category</label>
                            <input
                                type="text"
                                id="newCategory"
                                name="newCategory"
                                placeholder="food"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.newCategory}></input>
                            {errors.newCategory && <p>{errors.newCategory}</p>}
                        </div>
                        <div>
                            <label htmlFor="label">Note</label>
                            <input
                                type="text"
                                id="label"
                                name="label"
                                placeholder="checkings"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.label}></input>
                            {errors.label && <p>{errors.label}</p>}
                        </div>
                        <div>
                            <button type="submit">Add Transaction</button>
                        </div>
                    </Form>
                )}
            </Formik>
            <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Latest Customers</h5>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                        View all
                    </a>
                </div>
                {<div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                        {transactionsArr.map((trx) => (
                            <li key={trx._id} className="py-3 sm:py-4">
                                <div className="flex justify-between items-center">
                                    <div className=" min-w-0 ms-4">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {trx.label} - {trx.category}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {trx.date}
                                        </p>
                                    </div>
                                    <div className="inline-flex flex-col items-center text-base font-semibold text-gray-900 dark:text-white">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {trx.amount}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            from {trx.wallet}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center text-base font-semibold text-gray-900 dark:text-white">
                                        <button>Edit</button>
                                        <button onClick={() => handleTransactionDelete(trx)}>Delete</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>}
            </div>
        </>
    )
}

