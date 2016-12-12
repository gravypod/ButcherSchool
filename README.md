Butcher School
==============

A site that teaches you the answers the HAM radio license exam questions so you can pass all of the exams. Is this faster then studying via book? For technician maybe.

Teaches?
--------

Well... more programs the answers into you. It'll give you questions repeatedly until you get them right 15 times in a row. This is basically a sure fire way to pass your tech exam.

What are these files?
---------------------

### [Converter Script](https://github.com/gravypod/ButcherSchool/blob/master/converter/convert.py)

A simple converter script that will convert .doc obtained from these sites:

* [2014-2018 Technician](http://ncvec.org/page.php?id=362)
* [2015-2019 General](http://ncvec.org/page.php?id=364)
* [2016-2020 Extra](http://www.ncvec.org/page.php?id=365)

### [Webpage](https://github.com/gravypod/ButcherSchool/tree/master/site)

All of the stuff needed to actually host the website. It's a single js and html file. This is designed to be as simple as possible. 

Data Storage
------------

All data is stored in [Local Storage](http://www.w3schools.com/html/html5_webstorage.asp) of the browser. I don't think this really needs a login service nor do I feel comfortable with hosting user data myself. I'm a software developer, not a devops guy.

Requirements
------------

 * 'antiword' cli application
 * Webserver
 * python to run the converter
