import { Link } from "react-router-dom"
import { setLogout } from "../../state"
import { useDispatch, useSelector } from "react-redux"

export default function Navbar() {

    const dispatch = useDispatch();
    const isAuth = Boolean(useSelector((state) => state.token))

    return (
        <>
            <div className="
            w-screen
            h-[10vh]
            flex 
            justify-around 
            items-center
            top-0 
            left-0 
            fixed 
            bg-slate-500
            font-karla
            ">
                <div className="
                grow-0
                w-1/5 
                ">
                    <Link to={"/Dashboard"} className="font-bold">expenseTracker</Link>
                </div>
                <div className="grow">
                    <Link className="px-10" to={"/wallets"} >Wallets</Link>
                    <Link className="px-10" to={"/spending"} >Spending</Link>
                    <Link className="px-10" to={"/list"} >List</Link>
                </div>
                <div className="
                grow-0 
                w-1/6">
                    <Link className="" to={"/"} onClick={() => dispatch(setLogout())}>{isAuth ? "Logout" : "Login"}</Link>
                </div>
            </div>
        </>
    )
}