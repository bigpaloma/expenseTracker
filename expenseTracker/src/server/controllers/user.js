import User from "../models/User.js";

/** READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        res.status(200).json(user);
    } catch (err) {
        req.status(404).json({ message: err.message });
    }
}

export const getUserTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        res.status(200).json(user.transactions);
    } catch (err) {
        req.status(404).json({ message: err.message });
    }
}

export const getUserWallets = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        res.status(200).json(user.wallets);
    } catch (err) {
        req.status(404).json({ message: err.message });
    }
}


/** UPDATE */
export const addWallet = async (req, res) => {
    try {
        console.log("1")
        const { id } = req.params;
        const wallet = req.body.wallet
        await User.findByIdAndUpdate(id, { $push: { wallets: wallet } })
        const user = await User.findById(id)
        res.status(200).json(user.wallets);
    } catch (err) {
        req.status(404).json({ message: err.message });
    }
}

export const addTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = req.body.transaction
        await User.findByIdAndUpdate(id, { $push: { transactions: transaction } })
        const user = await User.findById(id)
        res.status(200).json(user.transactions);
    } catch (err) {
        req.status(404).json({ message: err.message });
    }
}

/** DELETE */
export const removeTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { trxLabel } = req.query;
        await User.findByIdAndUpdate(id, { $pull: { transactions: { label: trxLabel } } })
        const user = await User.findById(id)
        res.status(200).json(user.transactions);
    } catch (err) {
        req.status(404).json({ message: err.message });
    }
}

export const removeWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const { walletName } = req.query;
        console.log(walletName)
        const walletId = "65ba74397c9f1cfa92343e07"
        await User.findByIdAndUpdate(id, { $pull: { wallets: { name: walletName } } })
        const user = await User.findById(id)
        res.status(200).send(user.wallets)
    } catch (err) {
        req.status(404).json({ message: err.message });
    }
}