// Script created by Max1Truc
// Source available on GitHub at https://GitHub.com/Max1Truc/crypt
// It's under the MIT License

document.write("<p id='temp_global'></p>");

function crypt (message, password) {
	
    const alphanumeric_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789אגיךטכמןפצחש',!.;:=+-()/@%$*? abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789אגיךטכמןפצחש',!.;:=+-()/@%$*? ";
    
    let extended_password = ((message.length - (message.length % password.length))/password.length) + 1;
    extended_password = password.repeat(extended_password);
	
	
    for (let i = 0; i < message.length; i++) {
		index_in_alphanumeric_chars = alphanumeric_chars.indexOf(message[i]) + alphanumeric_chars.indexOf(extended_password[i]);
		document.getElementById("temp_global").innerHTML += alphanumeric_chars[index_in_alphanumeric_chars];
    };
	
    let crypted = document.getElementById("temp_global").innerHTML;
    document.getElementById("temp_global").innerHTML = "";
    return crypted;
};

function uncrypt (crypted_message, password) {
	
    const alphanumeric_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789אגיךטכמןפצחש',!.;:=+-()/@%$*? abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789אגיךטכמןפצחש',!.;:=+-()/@%$*? ";
    
    let extended_password = ((crypted_message.length - (crypted_message.length % password.length))/password.length) + 1;
    extended_password = password.repeat(extended_password);
	
	
    for (let i = 0; i < crypted_message.length; i++) {
	index_in_alphanumeric_chars = (alphanumeric_chars.indexOf(crypted_message[i]) - alphanumeric_chars.indexOf(extended_password[i])) + (alphanumeric_chars.length / 2);
	document.getElementById("temp_global").innerHTML += alphanumeric_chars[index_in_alphanumeric_chars];
    };
	
    let crypted = document.getElementById("temp_global").innerHTML;
    document.getElementById("temp_global").innerHTML = "";
    return crypted;
};
