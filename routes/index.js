
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Summer Camps 2012' })
};