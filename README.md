# Magento 1 labguage file to Magento 2
Simply we comparing keys of Magneto 2 with Magneto 1 csv files, to mirage it.

# Is it working?
I translated around 50% of Arabic and Turkish using this tool.

## How to?
### Setup Nodejs project
1. Download and install Nodejs (4.1.1 only tested)
2. Run `npm install`

### Prepare language
  <i>Example for `ar_SA`, ar is for Arabic, SA for Saudi Arabia.</i>

1. Download those 2 files
  ```
  index.js
  package.json
  ```
2. Put your Magento 1 csv file there `ar_SA/source.csv`
  ```
  |- ar_SA
      |- source.csv
  index.js
  package.json
  ```
3. Download xliff file from [crowdin.com](https://crowdin.com/project/magento-2/ar), we need 2 copies `ar_SA/source.xliff` and `ar_SA/target.xliff`
  ```
  |- ar_SA
      |- source.csv
      |- source.xliff
      |- target.xliff
  index.js
  package.json
  ```

### Run it now
Just run `node index.js`

## Q & A

Q: How to mirage all csv files of Magento 1 into 1 file?<br>
A: run this (Linux and Mac only) `cat *.csv > source.csv`.

Q: How to get Magento 1 language csv files?<br>
A: Find you language pack on [Magento Connect](https://www.magentocommerce.com/magento-connect/), then use this tool to [download Magento Connect packages](http://freegento.com/ddl-magento-extension.php), or [this website](http://ext.topmage.com).

Q: I'm translating my Magento on the live site, how to export it into csv file?<br>
A: Try [Magento translations from DB to CSV](https://github.com/ceefour/translation_exporter).

Q: How to install language package in Magento 2?
A: @MrGekko doing great job on that, go ahead and use his [Magneto 2 composer language packages](http://Magento2Translations.github.io)

# License
The MIT License (MIT)

Copyright (c) 2016 Hazem Khaled

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
