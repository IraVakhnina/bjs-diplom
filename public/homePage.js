'use strict';

const logoutButton = new LogoutButton();
logoutButton.action = function() {
    ApiConnector.logout(function(response) {
        if (response.success) {
            location.reload();
        }
    })
};

ApiConnector.current(function(response) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoards = new RatesBoard();
function getCurrencies() {
    ApiConnector.getStocks(function (response) {
        if (response.success) {
            ratesBoards.clearTable();
            ratesBoards.fillTable(response.data);
        }
    })
};

getCurrencies();
setInterval(getCurrencies, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function(data) {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, 'Баланс пополнен');
        } else {
            moneyManager.setMessage(true, response.data);
        }
    })
};

moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
        	ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, 'Конвертация завершена');
        } else {
            moneyManager.setMessage(true, response.data);
        }
    })
};

moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
        	ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, 'Перевод завершен');
        } else {
           moneyManager.setMessage(true, response.data); 
        }
    })
};

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(function (response) {
    if (response.success) {
        console.log(response);
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = function (data) {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, 'Пользователь добавлен');
        } else {
            favoritesWidget.setMessage(true, response.data);
        }
    })
};

favoritesWidget.removeUserCallback = function (id) {
    ApiConnector.removeUserFromFavorites(id, (response) =>{
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, 'Пользователь удален');
        } else {
            favoritesWidget.setMessage(true, response.data);
        }
    });
};


