#!/usr/bin/perl -w
use CGI '-utf8';
use CGI qw(:standard -debug);
use CGI::Cookie;
use CGI::Carp qw(fatalsToBrowser);

$nick=param("nick");

open my $handle, '<', "badWords.txt";
chomp(my @badWords = <$handle>);
close $handle;

$nickLowerCase = lc $nick;
$isNameOK=1;
foreach $name (@badWords) {
  if (index($nickLowerCase, $name) != -1) {
    $isNameOK=0;
  }
}

if ((length $nick) > 20 || (length $nick) < 2) {
    $isNameOK=0;
  }

if($isNameOK==1) {

  $gameBoxContent="<h3>Hello $nick</h3>
  <form action='http://155.230.194.245:54070' method=\"post\">
    <button type=\"submit\" value=\"$nick\" name=\"nick\" onclick=\"window.location.href='http://155.230.194.245:54070'\">Play</button>
  </form>"
}
else
{
  $gameBoxContent= "<h4>Nick cannot contain bad words and must be between 2-20 characters long.</h4>
  <form action=\"checkName.cgi\" method=\"post\">
  Enter your nick<br>
  <input type=\"text\"  value=\"\" name=\"nick\">
  <input type=\"submit\" value=\"Ok!\">
  </form>"
}

print header();
print <<"EOP";

<!DOCTYPE html>
<html lang="en">
<head>
  <title>Game</title>
  <link rel="stylesheet" href="menu.css">
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

</head>
<body>

<header>
  <h2>Welcome to a shooting game</h2>
</header>

<section>
<enterGameBox>
  $gameBoxContent
</enterGameBox>


  <article>
  <h1>About</h1>
  <p>This is a 2d shooting game. Server is implemented in node.js, while client side in Javascript and Perl/CGI.</p>
  <p>Graphic library is PIXI.js. Enjoy your stay. Don't try this at home. Peace.</p>
  </article>
  </section>

  <footer>
  <p>Created by Grzegorz Rypesc</p>
  </footer>

EOP
print <<"EOP";
</body>
</html>
EOP
