// Script created by Max1Truc
// Source available on GitHub at https://GitHub.com/Max1Truc/crypt
// It's under the MIT License

// All is in the var name
const alphanumeric_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\"',!.;:=+-()/\\@%$*? ".repeat(2);

function crypt (message, password) {
    
    let extended_password = ((message.length - (message.length % password.length))/password.length) + 1;
    extended_password = password.repeat(extended_password);
    let crypted = "";
	
    for (let i = 0; i < message.length; i++) {
		index_in_alphanumeric_chars = alphanumeric_chars.indexOf(message[i]) + alphanumeric_chars.indexOf(extended_password[i]);
		crypted = crypted.concat(alphanumeric_chars[index_in_alphanumeric_chars]);
    };
    return crypted;
};

function decrypt (crypted_message, password) {
	
    let extended_password = ((crypted_message.length - (crypted_message.length % password.length))/password.length) + 1;
    extended_password = password.repeat(extended_password);
    let decrypted = "";
	
    for (let i = 0; i < crypted_message.length; i++) {
	index_in_alphanumeric_chars = (alphanumeric_chars.indexOf(crypted_message[i]) - alphanumeric_chars.indexOf(extended_password[i])) + (alphanumeric_chars.length / 2);
	decrypted = decrypted.concat(alphanumeric_chars[index_in_alphanumeric_chars]);
    };
    return decrypted;
};
