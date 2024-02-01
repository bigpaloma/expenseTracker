import { Link } from "react-router-dom"
import "./index.css"

export default function Navbar() {
    return (
        <>
            <div className="navbar">
                <div className="navbar__wrapper navbar__wrapper--logo">
                    <Link to={"/Dashboard"} className="navbar__logo">expenseTracker</Link>
                </div>
                <div className="navbar__wrapper navbar__wrapper--links">
                    <Link className="navbar__link navbar__link--nav" to={"/wallets"} >Wallets</Link>
                    <Link className="navbar__link navbar__link--nav" to={"/spending"} >Spending</Link>
                    <Link className="navbar__link navbar__link--nav" to={"/list"} >List</Link>
                </div>
                <div className="navbar__wrapper navbar__wrapper--login">
                    <Link className="navbar__link navbar__link--login" to={"/"}>Login</Link>
                </div>
            </div>
        </>
    )
}