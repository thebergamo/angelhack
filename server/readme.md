Documents>
Transactions{
    date: Datetime,
    status: String,
    _ID: ObjectID,
    wallet: Wallet{
        hash: String,
        key: String
    },
    seller: User{
        email: String,
        wallet: String,
        password: String,
        name: String,
    },
    buyer: User{
        email: String,
        wallet: String,
        password: String,
        name: String,
    },
    messages: Messages,
    title: String,
    value: Float,
    code: String
}

Message{
    _ID: ObjectID,
    date: Datetime,
    sender: String,
    message: String,
}
