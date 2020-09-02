function filter(obj,...fields) {
    const newObj = {};
    fields.forEach(field=>{
        newObj[field] = obj[field]
    });

    return newObj;
}

module.exports = filter;