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
            favoritesWidget.setMessage(true, 'Баланс пополнен');
        } else {
            favoritesWidget.setMessage(false, response.data);
        }
    })
};

moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
          ProfileWidget.showProfile(response.data);
            favoritesWidget.setMessage(true, 'Конвертация завершена');
        } else {
            favoritesWidget.setMessage(false, response.data);
        }
    })
};

moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
          ProfileWidget.showProfile(response.data);
            favoritesWidget.setMessage(true, 'Перевод завершен');
        } else {
           favoritesWidget.setMessage(false, response.data); 
        }
    })
};

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(function (response) {
    console.log(response);
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    } else {
        favoritesWidget.setMessage(true, response.data)
    }
});

favoritesWidget.addUserCallback = function (data) {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'Пользователь добавлен');
        } else {
            favoritesWidget.setMessage(false, response.data);
        }
    })
};

favoritesWidget.removeUserCallback = function (id) {
    ApiConnector.removeUserFromFavorites(id, (response) =>{
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'Пользователь удален');
        } else {
            favoritesWidget.setMessage(false, response.data);
        }
    });
};