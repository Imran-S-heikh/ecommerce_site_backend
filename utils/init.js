const Other = require("../models/Others.model");
const catchAsync = require("./catchAsync.util");
const { SITE_PROPERTIES } = require("./keys");






const init = ()=> {
    Other.findOne({key: SITE_PROPERTIES},(_,doc)=>{
        if(!doc){
            Other.create({
                key: SITE_PROPERTIES,
                catagories: [],
                sizes: [],
                defaultTheme: 'light'
            })
        }
    });
    
}

module.exports = init;
