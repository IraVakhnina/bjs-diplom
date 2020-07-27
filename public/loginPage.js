"use strict";

const userForm = new UserForm();

userForm.loginFormCallback = (data = {login: null, password: null}) => {
	ApiConnector.login(data, (response) => {
		if (response.success) {
			location.reload();
		} else {
			alert(response.data);
		}
	})
}

userForm.registerFormCallback = (data = {login: null, password: null}) => {
	ApiConnector.register(data, (response) => {
		if (response.success) {
			location.reload();
		} else {
			alert(response.data);
		}
	})
}