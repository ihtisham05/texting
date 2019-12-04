module.exports = function(app){
    var dataSource = app.dataSources.db;
    dataSource.autoupdate(null, function(err) {
        if (err) return;
    });
};
