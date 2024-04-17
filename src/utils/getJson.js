module.exports = {
    jsonErrorForm: function ({ res, err }) {
        const form = {};
        if(err && err.errors) {
            Object.keys(err.errors).forEach(element=>{
                form[element] = err.errors[element].message;
            })
        }
        res.json({ status: 0, message: err.message , form });
       
    },
};
