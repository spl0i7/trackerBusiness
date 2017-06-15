let User = require('../models/User');
let pagination = require('../controllers/pagination')
let regradeController = {};
regradeController.home = function (req, res) {
    return renderList('regrade', req, res, req.user.regrade);
}
regradeController.doRegrade = function (req, res) {
    let selectedCoin = {
        id : req.sanitize(req.body['coin[id]']),
        grade : req.sanitize(req.body['coin[grade]']),
        certification : req.sanitize(req.body['coin[certification]'])
    };
    let regradeCoin = req.user.regrade.find((coin)=> {
        return (String(selectedCoin.id) === String(coin._id));
    });

    regradeCoin.grade = selectedCoin.grade;
    regradeCoin.certification = selectedCoin.certification;

    User.findOneAndUpdate({_id: req.user._id}, {$pull: {regrade: {_id: regradeCoin.id }}})
        .then(()=> {
            return User.findOneAndUpdate({_id: req.user._id}, {$push: {inventory: regradeCoin}})
        })
        .then(()=> {
        return res.json({success:true})
        })
        .catch((err)=>{
        console.log(err);
        return res.json({success:false})
        });
}

function renderList(view, req, res, coins) {
    let paginationInfo = pagination(req, coins);
    let url = req.url.split('?')[0];

    return res.render(view,
        {
            url : '/regrade' + url,
            pageCount: paginationInfo.pageCount,
            currentPage : paginationInfo.currentPage,
            coinIds :paginationInfo.inventory,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email:  req.user.email,
            username: req.user.username,
        });
}
module.exports = regradeController;

