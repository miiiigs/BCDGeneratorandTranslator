# BCD Generator and Translator
CSARCH2 Group 10 Simulation Project


Link to site: https://github.com/miiiigs/BCDGeneratorandTranslator
# Recording Link
(link)

# BCD Generator and Translator
**Binary-Coded Decimal (BCD)** is a class of binary encodings for decimal numbers where each decimal digit is represented by its own binary sequence. A **BCD generator** creates BCD codes from decimal numbers, while a **BCD translator** converts BCD codes into other formats or decimal numbers. These tools are crucial in digital systems requiring precise decimal representation, such as financial calculations, digital clocks, and calculators.

# BCD Encoding (BCD Generator)

**Unpacked BCD** stores each decimal digit in a separate byte, with each digit taking up a 4-bit nibble within an 8-bit byte. This format allows for straightforward access to each decimal digit but is less memory efficient. 

**Decimal to Unpacked BCD:** 
To convert a decimal number to unpacked BCD, first isolate each decimal digit. Convert each digit into its 4-bit binary form and allocate a separate byte for each digit. For example, the decimal number 47 is converted to 0100 for 4 and 0111 for 7, stored in two bytes: 0000 0100 and 0000 0111.

**Packed BCD** encodes two decimal digits within a single byte, with each nibble (4 bits) representing one digit. This format is more space-efficient than unpacked BCD because it reduces the number of bytes needed to store the same number of digits.

**Decimal to Packed BCD:**
For packed BCD, separate the decimal number into individual digits and convert each digit into its 4-bit binary equivalent. Combine these binary digits into one byte. For instance, the decimal number 47 is converted to 0100 for 4 and 0111 for 7, which are packed together into a single byte: 0100 0111.

**Densely Packed BCD** uses a more compact encoding scheme to pack multiple decimal digits into fewer bytes. 3 decimal digits are encoded in 10-bit binary which was originally based on Chen-Ho encoding (1975, Tien Chi Chen & Dr.
Irving Ho, and later improved by Mike Cowlishaw (2002). This method maximizes data density and is especially useful for applications requiring efficient storage.

**Decimal to Densely-Packed BCD:**
- The first step is to convert a decimal number to Packed BCD. Packed BCD is a binary encoding of decimal digits where each decimal digit is represented by a 4-bit binary value. Next is to convert Packed BCD into DPBCD, this utilizes encoding rules that map groups of three decimal digits into the DPBCD format. For example, if you have 0001 1000 0011 (Packed BCD), you need to split it into 3-bit groups for the conversion. Each group is then mapped to a specific 10-bit DPBCD pattern using the encoding table. The mapping is determined by checking the three first bits of each 4-bit binary value from the Packed BCD to determine the correct DPBCD pattern.

| Test Case 1 | Test Case 2 |
| ------- | ------- |
| () | () |
| -| - |

| Test Case 3 | Test Case 4 |
| ------- | ------- |
| () | () |
| - | - |

# BCD Translator
Densely Packed BCD (DPBCD) is a compact binary encoding format that represents three decimal digits in 10 bits. The process of converting a DPBCD value to a decimal number involves decoding the 10-bit pattern into a series of decimal digits. Here's a step-by-step explanation of how to perform this conversion.

Steps for Conversion
Decode the Densely Packed BCD (DPBCD):
Each 10-bit DPBCD value corresponds to a specific combination of three decimal digits. The conversion from DPBCD to Packed BCD involves interpreting the 10-bit binary sequence according to predefined encoding rules. These rules map the DPBCD value to a corresponding Packed BCD format, which consists of a binary sequence where each 4-bit segment represents a decimal digit.

The DPBCD value is divided into components based on the encoding table:

Checker Bits: The bits used to determine the specific encoding pattern.
Data Bits: The bits that encode the actual decimal digits.
For example, if the DPBCD is 0010101011, you need to check the pattern using the checker bits and then map the remaining bits to the Packed BCD representation.

Convert Packed BCD to Decimal:
Once you have the Packed BCD representation from the DPBCD, convert it to the decimal number. Packed BCD represents each decimal digit with 4 bits.

The process involves:

Splitting: Break down the Packed BCD binary sequence into 4-bit segments.
Converting: Convert each 4-bit segment to its decimal equivalent.
For example, if the Packed BCD obtained from the DPBCD is 0001 1000 0011, split it into 4-bit groups:

0001 → 1
1000 → 8
0011 → 3
Combine these digits to get the final decimal number, which is 183.
  
| Test Case 1 | Test Case 2 |
| ------- | ------- |
| () | () |
| -| - |

| Test Case 3 | Test Case 4 |
| ------- | ------- |
| () | () |
| - | - |


# Analysis

However, these problems could be solved by simply spending more time tinkering with the code and understanding its nature.
