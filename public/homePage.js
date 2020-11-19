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
            moneyManager.setMessage(true, 'Баланс пополнен');
        } else {
            moneyManager.setMessage(false, 'Ошибка при пополнении баланса!');
        }
    })
};

moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
          ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Конвертация завершена');
        } else {
            moneyManager.setMessage(false, 'Ошибка конвертации!');
        }
    })
};

moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
          ProfileWidget.showProfile(response.data);
            favoritesWidget.setMessage(true, 'Перевод завершен');
        } else {
           favoritesWidget.setMessage(false, 'Ошибка при переводе!'); 
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
            favoritesWidget.setMessage(false, 'Ошибка при добавлении пользователя!');
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
            favoritesWidget.setMessage(false, 'Ошибка при удалении пользователя!');
        }
    });
};