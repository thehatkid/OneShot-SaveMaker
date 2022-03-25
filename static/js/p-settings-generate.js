const MARSHAL_VERSION = ['04', '08']; // Ruby Marshal version: 4.8 (04 08 in hex)
const MARSHAL_ARRAY = '5b';		// [
const MARSHAL_FIXNUM = '69';	// i
const MARSHAL_IVAR = '49';		// I
const MARSHAL_STRING = '22';	// "
const MARSHAL_TRUE = '54';		// T
const MARSHAL_FALSE = '46';		// F

function hexToBytes(str) {
	if (!str) {
		return new Uint8Array();
	}

	var a = [];

	for (var i = 0, len = str.length; i < len; i+=2) {
		a.push(parseInt(str.substr(i,2),16));
	}

	return new Uint8Array(a);
}

function bytesToHex(byteArray) {
	return Array.from(byteArray, function(byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join('')
}

String.prototype.hexEncode = function() {
    var hex;

    var result = '';
    for (var i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ('0' + hex).slice(-2);
    }

    return result;
}

String.prototype.toUTF8Bytes = function() {
	return new TextEncoder().encode(this.toString());
}

function generate() {
	var hexstring = '';
	let i_ign = document.getElementById('i_ign').value;
	let ign_bytes = i_ign.toUTF8Bytes();

	// Inputs validation
	if (i_ign.length == 0) {
		alert('Please enter the In-Game Player Name!');
		return false;
	}

	if (document.getElementById('s_beatsolstice').checked === true) {
		var s_beatsolstice = MARSHAL_TRUE;
	} else {
		var s_beatsolstice = MARSHAL_FALSE;
	}
	if (document.getElementById('s_beated').checked === true) {
		var s_beated = MARSHAL_TRUE;
	} else {
		var s_beated = MARSHAL_FALSE;
	}
	if (document.getElementById('s_smashed').checked === true) {
		var s_smashed = MARSHAL_TRUE;
	} else {
		var s_smashed = MARSHAL_FALSE;
	}
	if (document.getElementById('s_saved').checked === true) {
		var s_saved = MARSHAL_TRUE;
	} else {
		var s_saved = MARSHAL_FALSE;
	}
	if (document.getElementById('s_talkedtorue').checked === true) {
		var s_talkedtorue = MARSHAL_TRUE;
	} else {
		var s_talkedtorue = MARSHAL_FALSE;
	}
	if (document.getElementById('s_knowruename').checked === true) {
		var s_knowruename = MARSHAL_TRUE;
	} else {
		var s_knowruename = MARSHAL_FALSE;
	}
	if (document.getElementById('s_pickedmemory').checked === true) {
		var s_pickedmemory = MARSHAL_TRUE;
	} else {
		var s_pickedmemory = MARSHAL_FALSE;
	}

	// Putting second Marshal object (Game Variables)
	hexstring += MARSHAL_VERSION[0] + MARSHAL_VERSION[1];

	// Putting Game Switches (from 151 to 175)
	hexstring += MARSHAL_ARRAY; // Declarate as Ruby Array
	hexstring += '1e'; // 25 (1e in hex) elements in array

	// (game switches names from steam OneShot)
	hexstring += MARSHAL_FALSE;	// Switch 151: "PERMAFLAGS START HERE" (false)
	hexstring += s_beated;		// Switch 152: "Beat the game once"
	hexstring += s_smashed;		// Switch 153: "Smashed lightbulb once"
	hexstring += s_saved;		// Switch 154: "Saved world once"
	hexstring += s_talkedtorue;	// Switch 155: "Talked to Rue first time"
	hexstring += s_knowruename;	// Switch 156: "Know Rue's name"
	hexstring += s_pickedmemory;// Switch 157: "picked memory at title"
	hexstring += MARSHAL_FALSE;	// Switch 158: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 159: (unused) (false)
	hexstring += s_beatsolstice	// Switch 160: "Beat Solstice"
	hexstring += MARSHAL_FALSE;	// Switch 161: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 162: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 163: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 164: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 165: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 166: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 167: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 168: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 169: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 170: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 171: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 172: (unused) (false)
	hexstring += MARSHAL_FALSE;	// Switch 173: "DONT USE" (false)
	hexstring += MARSHAL_FALSE;	// Switch 174: "DONT USE" (false)
	hexstring += MARSHAL_FALSE;	// Switch 175: "PERMAFLAGS END HERE" (false)

	// Putting second Marshal object (Game Variables)
	hexstring += MARSHAL_VERSION[0] + MARSHAL_VERSION[1];

	// Putting Game Variables (from 76 to 100)
	hexstring += MARSHAL_ARRAY; // Declarate as Ruby Array
	hexstring += '1e'; // 25 (1e in hex) elements in array

	// (game variables names from steam OneShot)
	hexstring += MARSHAL_FIXNUM + '00'; // Variable 76: "BEGIN PERMA VARS" (0)
	hexstring += MARSHAL_FIXNUM + '06'; // Variable 77: "times game cleared"
	hexstring += MARSHAL_FIXNUM + '00'; // Variable 78: "times talked to rue"

	// Variables 79-99: (unused) (0)
	for (var i = 79; i <= 99; i++) {
		hexstring += MARSHAL_FIXNUM + '00';
	}

	hexstring += MARSHAL_FIXNUM + '00'; // Variable 100: "END PERMA VARS" (0)

	// Putting last Marshal object (In-Game Player Name)
	hexstring += MARSHAL_VERSION[0] + MARSHAL_VERSION[1];

	// Declarate IVAR and String with length
	hexstring += MARSHAL_IVAR + MARSHAL_STRING + String.fromCharCode(5 + ign_bytes.length).hexEncode();

	// Putting In-Game Player Name to String
	hexstring += bytesToHex(ign_bytes);

	hexstring += '063a064554'; // file ending

	// Exporting "p-settings.dat"
	var bytes = hexToBytes(hexstring);
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < bytes.length; i++) {
		ia[i] = bytes[i];
	}

	let blob = new Blob([ia], {type: 'application/octet-stream'});
	let dl = document.createElement('a');
	dl.href = URL.createObjectURL(blob);
	dl.setAttribute('download', 'p-settings.dat');
	dl.click();
}