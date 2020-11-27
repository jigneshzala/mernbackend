const mongoose = require("mongoose");

const DB = "mongodb+srv://jigar:nodeblog@cluster0.ztekr.mongodb.net/students-api?retryWrites=true&w=majority";

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false 
}).then(() => console.log('DB Connection successfull!')).catch((err) => console.log(err));
