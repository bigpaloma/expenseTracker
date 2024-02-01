import React, { useState, useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setMode } from "../state"

export const ThemeContext = React.createContext()
export const ThemeUpdateContext = React.createContext()
export function useTheme() {
    return useContext(ThemeContext)
}
export function useThemeUpdate() {
    return useContext(ThemeUpdateContext)
}

export function ThemeProvider({ children }) {

    const mode = useSelector((state) => state.mode)
    const dispatch = useDispatch();
    const toggleTheme = () => {
        dispatch(setMode());
    }

    return (
        <ThemeContext.Provider value={mode}>
            <ThemeUpdateContext.Provider value={toggleTheme}>
                {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    )
}