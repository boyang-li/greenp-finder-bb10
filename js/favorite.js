// GreenParking
// js/favorite.js
// Feb 21, 2013

// B. DB functions
var currenttasks = null;

function errorHandler(transaction, error) {
    alert("SQL error: " + error.message);
}

// open the database
var gpDb = openDatabase('greenParkingDb', '1.0', 'task DB', 100 * 1024);

function createTables() {
    // create the task table if it doesn't exist
    gpDb.transaction(function (transaction) {
        var sqlString = "CREATE TABLE IF NOT EXISTS favorite ("
        + " id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
        + " lotId INTEGER NOT NULL,"
        + " lotName VARCHAR NOT NULL);";
        transaction.executeSql(sqlString, [], null, errorHandler);
    }, errorHandler);
}

// drop table called only when clear all is clicked
function dropTables() {
    var query = 'DROP TABLE favorite;';
    try {
        gpDb.transaction(function (transaction) {
            transaction.executeSql(query, [], null, errorHandler);
        });
    }
    catch (e) {
        alert("Error: Unable to drop table " + e + ".");
        return;
    }
    createTables();
}

function addFavorite(lotId, lotName, callback) {
    var sqlString = "INSERT INTO favorite (lotId, lotName)"
		+ " VALUES (?,?);";
    gpDb.transaction(function (transaction) {
        transaction.executeSql(
			sqlString,
			[lotId, lotName],
			callback,
			errorHandler
		);
    }); // end transaction
    $("#detailStar").attr('src', 'images/star_yellow.png');
    $("#detailStar").attr("onclick", "delFavorite(" + currentIndex + ")");
}

function delFavorite(rowId) {
    var l_lotName;
    gpDb.transaction(function (transaction) {
        transaction.executeSql("SELECT lotName FROM favorite WHERE lotId = "+ rowId,
            [],
            function (transaction, result) {
                l_lotName = result.rows.item(0).lotName;
            },
            errorHandler);
    }); //executeSql
    var sqlString = "DELETE FROM favorite WHERE lotId = " + rowId;
    gpDb.transaction(function (transaction) {
        transaction.executeSql(
                sqlString,
                [],
                function () {
                    $("#detailStar").attr('src', 'images/star_gray.png');
                    $("#detailStar").attr("onclick", "addFavorite(" + currentIndex + ",'" + l_lotName + "')");
                },
                errorHandler
            );
    });
} // deletetask

function displayAddCompleted() {
    alert("New favorite record added.");
    // stay on same page to add more rows
}

function showFavoriteList() {
    gpDb.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM favorite",
            [],
            function (transaction, result) { onGetRecordsSuccess(result) },
            errorHandler);
    }); //executeSql
} //end getRecords

function onGetRecordsSuccess(result) {
    // initialise a string to hold the html line items
    var htmlStr = '';
    var aRow = null;

    if (result.rows.length == 0) {
        htmlStr += '<h4>No records found.</h4>';
    } else {
        var items = [], item;
        for (var i = 0; i < result.rows.length; i++) {

            var streetId = result.rows.item(i).lotId;
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'item');
            item.setAttribute('data-bb-title', result.rows.item(i).lotName);
            item.innerHTML = result.rows.item(i).lotName;

            item.setAttribute("onclick", "changeCurrentIndex(" + streetId + ")");
            items.push(item);
        }

        document.getElementById('favoriteList').refresh(items);
    }


}

function isFavorateExist() {
    gpDb.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM favorite",
            [],
            function (transaction, result) {
                for (var i = 0; i < result.rows.length; i++) {
                    if (currentIndex == result.rows.item(i)['lotId']) {
                        $("#detailStar").attr('src', 'images/star_yellow.png');
                        $("#detailStar").attr("onclick", "delFavorite(" + currentIndex + ")");
                    }
                }
            },
            errorHandler);
    });          //executeSql
}