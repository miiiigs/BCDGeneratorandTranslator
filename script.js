let decimalInputDownload;
let dpInputUpload;


function clearInputs() {
    document.getElementById("gen-download-btn").style.display = "none";
    document.getElementById("trans-download-btn").style.display = "none";
    dpInputUpload = "";
    decimalInputDownload = "";
    document.getElementById("unpacked").value = "";
    document.getElementById("packed").value = "";
    document.getElementById("densely-packed").value = "";
    document.getElementById("decimal-output").value = "";
    document.getElementById("decimal-input").value = "";
    document.getElementById("bcd-input").value = "";
}

function enableDownloadButton() {
    document.getElementById("gen-download-btn").style.display = "block";
    document.getElementById("trans-download-btn").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function (event) { 
    const unpackedOutput = document.getElementById("unpacked");
    const packedOutput = document.getElementById("packed");
    const denselyPackedOutput = document.getElementById("densely-packed");
    const decimalOutput = document.getElementById("decimal-output")
    let inputs = [unpackedOutput, packedOutput, denselyPackedOutput, decimalOutput];

    inputs.forEach((input) => {
        input.disabled = true;
        input.placeholder = "";
        input.classList.add("disabled");
    });
});

function isValidDecimal(input) {
    const number = Number(input); 
    return !isNaN(number) && isFinite(number);
}

function isValidDenselyPackedBCD(input) {
    input = input.replace(/\s+/g, '');
    if (!/^[01]+$/.test(input)) {
        return false;
    }

    if (input.length !== 10) {
        return false;
    }
    return true; 
}


function generatorTextDownload() {
    const unpackedBCD = document.getElementById('unpacked').value;
    const packedBCD = document.getElementById('packed').value;
    const denselyPackedBCD = document.getElementById('densely-packed').value;

    const combinedContent = `Decimal to BCD\n\nInput:\nDecimal: ${decimalInputDownload}\n\nOutput:\nUnpacked BCD: ${unpackedBCD}\nPacked BCD: ${packedBCD}\nDensely-packed BCD: ${denselyPackedBCD}`;
    const blob = new Blob([combinedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "text_file.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function translatorTextDownload() {
    const decimalOutput = document.getElementById('decimal-output').value;

    const combinedContent = `Densely-packed BCD to Decimal\n\nInput:\nDensely-packed BCD: ${dpInputUpload}\n\nOutput:\nDecimal: ${decimalOutput}`;
    const blob = new Blob([combinedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "text_file.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


function showSection(sectionId) {
    const sections = ['bcd-generator', 'bcd-translator'];
    sections.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    clearInputs();
}

function generateBCD() {

    const decimal = document.getElementById('decimal-input').value;
    decimalInputDownload = decimal;
    if(isValidDecimal(decimal)) {
        const unpackedBCD = toUnpacked(decimal);
        const packedBCD = toPacked(decimal);
        const denselyPackedBCD = denselyFixer(decimal);

        enableDownloadButton();
        document.getElementById('unpacked').value = unpackedBCD;
        document.getElementById('packed').value = packedBCD;
        document.getElementById('densely-packed').value = denselyPackedBCD;
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a valid Decimal!",
        });
    }  
}


function translateBCD() {
    const denselyPackedBCD = document.getElementById('bcd-input').value;
    dpInputUpload = denselyPackedBCD
    if(isValidDenselyPackedBCD(denselyPackedBCD)) {

        const decimal = denselyPackedToDecimal(denselyPackedBCD);

        enableDownloadButton();
        document.getElementById('decimal-output').value = decimal;
    }
    else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a valid Densely-packed BCD!",
        });
    }
}

function toBinaryDigit(digit, len) {
    if (digit < 0 || digit >= Math.pow(2, len)) {
      throw new Error("Error: Cannot convert, not enough allowable bits.");
    }
    return digit.toString(2).padStart(len, '0');
}

function toUnpacked(digits) {
    let str = "";

    for (let i = 0; i < digits.length; i++) {
        if(digits.charAt(i) == '+') {
            str += "0 ";
        }
        else if(digits.charAt(i) == '-') {
            str += "1 ";
        }
        else{
            str += toBinaryDigit(parseInt(digits.charAt(i)), 8) + " ";
        }
    }

    return str.trim();
}

function toPacked(digits) {
    let str = "";
    let end_str = "";
    

    for (let i = 0; i < digits.length; i++) {
        if(digits.charAt(i) == '+') {
            end_str = "1100";
        }
        else if(digits.charAt(i) == '-') {
            end_str = "1101";
        }
        else{
                str += " " + toBinaryDigit(parseInt(digits.charAt(i)),4);
        }
    }

    str += " " + end_str;

    return str.trim();
}

function denselyPacked(packed) {
    let bcd = Array(13).fill('0');
    let checker = [packed[0], packed[4], packed[8]];
  
    [bcd[0], bcd[1], bcd[2]] = checker;
    console.log(checker);
    if (checker.join('') === '000') {
        bcd[9] = '0';
        [bcd[3], bcd[4], bcd[5]] = [packed[1], packed[2], packed[3]];
        [bcd[6], bcd[7], bcd[8]] = [packed[5], packed[6], packed[7]];
        [bcd[10], bcd[11], bcd[12]] = [packed[9], packed[10], packed[11]];
    } else {
        bcd[9] = '1';
        bcd[5] = packed[3];
        bcd[8] = packed[7];
        bcd[12] = packed[11];
  
        if (checker.join('') === '001') {
            [bcd[3], bcd[4]] = [packed[1], packed[2]];
            [bcd[6], bcd[7]] = [packed[5], packed[6]];
            [bcd[10], bcd[11]] = ['0', '0'];
        } else if (checker.join('') === '010') {
            [bcd[3], bcd[4]] = [packed[1], packed[2]];
            [bcd[6], bcd[7]] = [packed[9], packed[10]];
            [bcd[10], bcd[11]] = ['0', '1'];
        } else if (checker.join('') === '100') {
            [bcd[3], bcd[4]] = [packed[9], packed[10]];
            [bcd[6], bcd[7]] = [packed[5], packed[6]];
            [bcd[10], bcd[11]] = ['1', '0'];
        } else if (checker.join('') === '011') {
            [bcd[3], bcd[4]] = [packed[1], packed[2]];
            [bcd[6], bcd[7]] = ['1', '0'];
            [bcd[10], bcd[11]] = ['1', '1'];
        } else if (checker.join('') === '101') {
            [bcd[3], bcd[4]] = [packed[5], packed[6]];
            [bcd[6], bcd[7]] = ['0', '1'];
            [bcd[10], bcd[11]] = ['1', '1'];
        } else if (checker.join('') === '110') {
            [bcd[3], bcd[4]] = [packed[9], packed[10]];
            [bcd[6], bcd[7]] = ['0', '0'];
            [bcd[10], bcd[11]] = ['1', '1'];
        } else if (checker.join('') === '111') {
            [bcd[3], bcd[4]] = ['0', '0'];
            [bcd[6], bcd[7]] = ['1', '1'];
            [bcd[10], bcd[11]] = ['1', '1'];
        }
    }
  
    return bcd.slice(3);
  }
  
  function denselyFixer(decimal) {    
    if(decimal.charAt(0) == '+' || decimal.charAt(0) == '-') 
        return "N/A";
        
    let bcd = '';
    while (decimal.length % 3 !== 0) {
        decimal = '0' + decimal;
    }
    
    let parts = [];
    for (let i = 0; i < decimal.length; i += 3) {
        parts.push(decimal.slice(i, i + 3));
    }
    
    for (let part of parts) {
        let packed = toPacked(part);
        packed = packed.split(' ').join('');
        let denselyPackedPart = denselyPacked(packed);
        bcd += denselyPackedPart.join('') + ' ';
    }
    
    
  
    return bcd.trim();
  }

  function denselyPackedToPackedBCD(denselyPacked) {
    let packed = Array(12).fill('0');
    let checker1 = [denselyPacked[6], denselyPacked[7], denselyPacked[8]];
    let checker2 = [denselyPacked[6], denselyPacked[7], denselyPacked[8], denselyPacked[3], denselyPacked[4]];
  
    if (denselyPacked[6] === '0') {
        [packed[0], packed[1], packed[2], packed[3]] = ['0', denselyPacked[0], denselyPacked[1], denselyPacked[2]];
        [packed[4], packed[5], packed[6], packed[7]] = ['0', denselyPacked[3], denselyPacked[4], denselyPacked[5]];
        [packed[8], packed[9], packed[10], packed[11]] = ['0', denselyPacked[7], denselyPacked[8], denselyPacked[9]];
    } else if (checker1.join('') === '100') {
        [packed[0], packed[1], packed[2], packed[3]] = ['0', denselyPacked[0], denselyPacked[1], denselyPacked[2]];
        [packed[4], packed[5], packed[6], packed[7]] = ['0', denselyPacked[3], denselyPacked[4], denselyPacked[5]];
        [packed[8], packed[9], packed[10], packed[11]] = ['1', '0', '0', denselyPacked[9]];
    } else if (checker1.join('') === '101') {
        [packed[0], packed[1], packed[2], packed[3]] = ['0', denselyPacked[0], denselyPacked[1], denselyPacked[2]];
        [packed[4], packed[5], packed[6], packed[7]] = ['1', '0', '0', denselyPacked[5]];
        [packed[8], packed[9], packed[10], packed[11]] = ['0', denselyPacked[3], denselyPacked[4], denselyPacked[9]];
    } else if (checker1.join('') === '110') {
        [packed[0], packed[1], packed[2], packed[3]] = ['1', denselyPacked[0], denselyPacked[1], denselyPacked[2]];
        [packed[4], packed[5], packed[6], packed[7]] = ['0', denselyPacked[5], denselyPacked[9], denselyPacked[10]];
        [packed[8], packed[9], packed[10], packed[11]] = ['0', denselyPacked[10], denselyPacked[9], denselyPacked[10]];
    } else if (checker2.join('') === '11100') {
        [packed[0], packed[1], packed[2], packed[3]] = ['1', denselyPacked[0], denselyPacked[1], denselyPacked[2]];
        [packed[4], packed[5], packed[6], packed[7]] = ['1', denselyPacked[5], denselyPacked[9], denselyPacked[10]];
        [packed[8], packed[9], packed[10], packed[11]] = ['0', denselyPacked[10], denselyPacked[9], denselyPacked[10]];
    } else if (checker2.join('') === '11101') {
        [packed[0], packed[1], packed[2], packed[3]] = ['1', denselyPacked[0], denselyPacked[1], denselyPacked[2]];
        [packed[4], packed[5], packed[6], packed[7]] = ['0', denselyPacked[5], '1', denselyPacked[9]];
        [packed[8], packed[9], packed[10], packed[11]] = ['1', denselyPacked[10], denselyPacked[9], denselyPacked[10]];
    } else if (checker2.join('') === '11110') {
        [packed[0], packed[1], packed[2], packed[3]] = ['0', denselyPacked[0], denselyPacked[1], denselyPacked[2]];
        [packed[4], packed[5], packed[6], packed[7]] = ['1', denselyPacked[5], '1', denselyPacked[9]];
        [packed[8], packed[9], packed[10], packed[11]] = ['1', denselyPacked[10], denselyPacked[9], denselyPacked[10]];
    } else if (checker2.join('') === '11111') {
        [packed[0], packed[1], packed[2], packed[3]] = ['1', denselyPacked[0], denselyPacked[1], denselyPacked[2]];
        [packed[4], packed[5], packed[6], packed[7]] = ['1', denselyPacked[5], '1', denselyPacked[9]];
        [packed[8], packed[9], packed[10], packed[11]] = ['1', denselyPacked[10], denselyPacked[9], denselyPacked[10]];
    }
    
    return packed;
  }

  function packedBCDToDecimal(packedBCD) {
    let decimal = '';
    for (let i = 0; i < packedBCD.length; i += 4) {
        let digitBinary = packedBCD.slice(i, i + 4).join('');
        let digitDecimal = parseInt(digitBinary, 2);
        decimal += digitDecimal.toString();
    }
    return decimal;
  }

  function denselyPackedToDecimal(denselyPackedBCD) {
    let denselyPacked = denselyPackedBCD.split('');
    let packedBCD = denselyPackedToPackedBCD(denselyPacked);
    let decimalPart = packedBCDToDecimal(packedBCD);
    return parseFloat(decimalPart);
  }

  showSection('bcd-generator');