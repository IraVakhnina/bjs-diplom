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
            moneyManager.setMessage(true, response.data);
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, 'Баланс пополнен');
        }
    })
};
moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            moneyManager.setMessage(true, response.data);
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, 'Конвертация завершена');
        }
    })
};
moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            moneyManager.setMessage(true, response.data);
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, 'Перевод завершен');
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
            favoritesWidget.setMessage(true, response.data);
        } else {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, 'Пользователь добавлен');
        }
    })
};

favoritesWidget.removeUserCallback = function (id) {
    ApiConnector.removeUserFromFavorites(id, (response) =>{
        if (response.success) {
            favoritesWidget.setMessage(true, response.data);
        } else {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, 'Пользователь удален');
        }
    });
};


